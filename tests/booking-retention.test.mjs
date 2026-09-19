import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { localD1 } from './helpers/d1.mjs'

const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/booking-retention.ts', 'workers/wallet-sync.ts'], bundle: true, write: false,
  outdir: '/tmp/retention-unit-unused', format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const load = suffix => import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles.find(f => f.path.endsWith(suffix)).text).toString('base64')}`)
const retention = await load('booking-retention.js')
const worker = (await load('wallet-sync.js')).default
const play = { id: 'retention-test', title: 'Retention test', date: '2026-12-27', time: '19:30',
  display_date: 'Retention test', total_seats: 68, timezone: 'Europe/Berlin', duration_minutes: null }
const expires = Date.parse('2027-01-10T18:30:00Z')

function fixture(t, changes = {}) {
  const { db, sqlite } = localD1()
  t.after(() => sqlite.close())
  const p = { ...play, ...changes }
  sqlite.prepare('INSERT INTO plays (id,title,date,time,display_date,total_seats,timezone,duration_minutes) VALUES (?,?,?,?,?,?,?,?)')
    .run(p.id, p.title, p.date, p.time, p.display_date, p.total_seats, p.timezone, p.duration_minutes)
  for (const [index, status] of ['confirmed', 'cancelled', 'checked_in'].entries()) {
    const id = `private-booking-${index}`
    sqlite.prepare('INSERT INTO bookings (id,play_id,name,email,status,admission_token,request_key,wallet_issued,wallet_sync_pending) VALUES (?,?,?,?,?,?,?,1,1)')
      .run(id, p.id, 'Private Testgast', `private-${index}@example.invalid`, status, `private-admission-${index}`, `private-request-${index}`)
    if (status !== 'cancelled') sqlite.prepare('INSERT INTO booked_seats (booking_id,play_id,seat_number) VALUES (?,?,?)').run(id, p.id, index + 1)
    sqlite.prepare('INSERT INTO wallet_sync_jobs (booking_id) VALUES (?)').run(id)
  }
  return { db, sqlite, play: p }
}

test('retention uses venue timezone and configured duration, including summer dates', () => {
  assert.equal(retention.bookingDeletionTime(play), expires)
  assert.equal(retention.bookingDeletionTime({ ...play, duration_minutes: 120 }), expires + 7_200_000)
  assert.equal(retention.bookingDeletionTime({ ...play, date: '2026-07-01' }), Date.parse('2026-07-15T17:30:00Z'))
})

test('never deletes early; expiry deletes every status, seats and sync jobs atomically', async t => {
  const { db, sqlite } = fixture(t)
  assert.equal((await retention.purgeExpiredBookings(db, expires - 1)).deletedBookings, 0)
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM bookings').get().n, 3)
  const result = await retention.purgeExpiredBookings(db, expires)
  assert.equal(result.deletedBookings, 3)
  assert.equal(result.deletedSeats, 2)
  assert.equal(result.affectedPlays.length, 1)
  assert.doesNotMatch(JSON.stringify(result), /private-|Private Testgast|example\.invalid/)
  for (const table of ['bookings', 'booked_seats', 'wallet_sync_jobs']) {
    assert.equal(sqlite.prepare(`SELECT count(*) AS n FROM ${table}`).get().n, 0)
  }
  assert.ok(sqlite.prepare('SELECT id FROM plays WHERE id = ?').get(play.id))
  assert.equal((await retention.purgeExpiredBookings(db, expires + 1)).deletedBookings, 0)
})

test('keeps later performances and bookings when an expired performance is purged', async t => {
  const { db, sqlite } = fixture(t)
  const future = 'romeo-julia-2026-12-29-1930'
  sqlite.prepare('INSERT INTO bookings (id,play_id,name,email,admission_token) VALUES (?,?,?,?,?)')
    .run('future-booking', future, 'Later Guest', 'later@example.invalid', 'future-admission')
  assert.equal((await retention.purgeExpiredBookings(db, expires)).deletedBookings, 3)
  assert.deepEqual(sqlite.prepare('SELECT id FROM bookings').all().map(row => row.id), ['future-booking'])
})

test('does not delete a performance postponed during candidate selection', async t => {
  const { db, sqlite } = fixture(t)
  const batch = db.batch
  let postponed = false
  db.batch = async statements => {
    if (!postponed) {
      postponed = true
      sqlite.prepare('UPDATE plays SET date = ? WHERE id = ?').run('2027-12-27', play.id)
    }
    return batch(statements)
  }
  const result = await retention.purgeExpiredBookings(db, expires)
  assert.equal(result.deletedBookings, 0)
  assert.equal(result.deletedSeats, 0)
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM bookings').get().n, 3)
})

test('database failure rolls back bookings and their dependent rows', async t => {
  const { db, sqlite } = fixture(t)
  sqlite.exec("CREATE TRIGGER fail_retention BEFORE DELETE ON bookings BEGIN SELECT RAISE(ABORT, 'test rollback'); END")
  await assert.rejects(retention.purgeExpiredBookings(db, expires), /test rollback/)
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM bookings').get().n, 3)
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM booked_seats').get().n, 2)
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM wallet_sync_jobs').get().n, 3)
})

test('scheduled cleanup runs with Wallet disabled and removes only expired technical records', async t => {
  const { db, sqlite } = fixture(t, { date: '2020-01-01' })
  for (const [id, expiry] of [['expired', 0], ['active', Date.now() + 86_400_000]]) {
    sqlite.prepare('INSERT INTO admin_sessions (token_hash,expires_at) VALUES (?,?)').run(id, expiry)
    sqlite.prepare('INSERT INTO ticket_rate_limits (key,hits,resets_at) VALUES (?,1,?)').run(id, Math.floor(expiry / 1000))
  }
  await worker.scheduled({}, { DB: db, GOOGLE_WALLET_ENABLED: 'false' })
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM bookings').get().n, 0)
  assert.deepEqual(sqlite.prepare('SELECT token_hash FROM admin_sessions').all().map(row => row.token_hash), ['active'])
  assert.deepEqual(sqlite.prepare('SELECT key FROM ticket_rate_limits').all().map(row => row.key), ['active'])
})
