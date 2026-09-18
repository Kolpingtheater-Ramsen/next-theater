import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { webcrypto } from 'node:crypto'
import { localD1 } from './helpers/d1.mjs'
const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/google-wallet.ts', 'src/lib/tickets.ts'], bundle: true, write: false, outdir: '/tmp/ticket-unit-unused', format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const wallet = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles.find(f => f.path.endsWith('google-wallet.js')).text).toString('base64')}`)
const tickets = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles.find(f => f.path.endsWith('tickets.js')).text).toString('base64')}`)
const play = { id: 'romeo-test', title: 'Romeo und Julia', date: '2026-12-27', time: '19:30', timezone: 'Europe/Berlin', venue: 'Klosterhof 7, Ramsen', total_seats: 68 }
const booking = { id: 'private-management-secret', admission_token: 'public-admission-code', name: 'Testgast', email: 'private@example.invalid', play, play_id: play.id, seats: [1, 12], status: 'confirmed' }
const env = { GOOGLE_WALLET_ISSUER_ID: '12345' }

test('calendar and Wallet use correct Berlin winter and summer offsets', () => {
  assert.equal(tickets.performanceStart(play).toISOString(), '2026-12-27T18:30:00.000Z')
  assert.equal(wallet.walletEventTime(play), '2026-12-27T19:30:00+01:00')
  assert.equal(wallet.walletEventTime({ ...play, date: '2026-07-01' }), '2026-07-01T19:30:00+02:00')
  const ics = tickets.ticketCalendar(play, 'public-admission-code')
  assert.match(ics, /DTSTART:20261227T183000Z/)
  assert.doesNotMatch(ics, /DTEND:/)
  assert.match(tickets.ticketCalendar({ ...play, duration_minutes: 120 }, 'code'), /DTEND:20261227T203000Z/)
})
test('Wallet passes expose admission codes only and follow booking status', () => {
  const object = wallet.walletObject(env, booking)
  const text = JSON.stringify(object)
  assert.equal(object.barcode.value, 'KTR1:public-admission-code')
  assert.equal(object.seatInfo.seat.defaultValue.value, 'A2, B3')
  assert.ok(!text.includes(booking.id) && !text.includes(booking.email))
  assert.equal(wallet.walletObject(env, { ...booking, status: 'cancelled', seats: [] }).state, 'INACTIVE')
  assert.equal(wallet.walletObject(env, { ...booking, status: 'checked_in' }).state, 'COMPLETED')
  assert.equal(wallet.walletConfigured(env), false)
})
test('Wallet JWT signatures verify with the public key', async () => {
  const keys = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
  const der = await webcrypto.subtle.exportKey('pkcs8', keys.privateKey)
  const pem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(der).toString('base64')}\n-----END PRIVATE KEY-----`
  const jwt = await wallet.signWalletJwt({ aud: 'google', typ: 'savetowallet', payload: { eventTicketObjects: [{ id: '12345.test' }] } }, pem)
  const [header, payload, signature] = jwt.split('.')
  assert.equal(JSON.parse(Buffer.from(header, 'base64url')).alg, 'RS256')
  assert.equal(await webcrypto.subtle.verify('RSASSA-PKCS1-v1_5', keys.publicKey, Buffer.from(signature, 'base64url'), Buffer.from(`${header}.${payload}`)), true)
})
test('seat layout contains exactly the configured capacity and blocks the front corners', () => {
  assert.equal(tickets.seatNumbers(68).length, 68)
  assert.equal(tickets.validSeats([0], 68), false)
  assert.equal(tickets.validSeats([9], 68), false)
  assert.equal(tickets.validSeats([1, 1], 68), false)
  assert.equal(tickets.validSeats([69], 68), true)
})

const keys = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
const der = await webcrypto.subtle.exportKey('pkcs8', keys.privateKey)
function walletFixture(t) {
  const { sqlite, db } = localD1()
  t.after(() => sqlite.close())
  sqlite.prepare('INSERT INTO plays (id,title,date,time,display_date,total_seats) VALUES (?,?,?,?,?,?)')
    .run(play.id, play.title, play.date, play.time, 'Wallet Test', 68)
  sqlite.prepare('INSERT INTO bookings (id,play_id,name,email,admission_token) VALUES (?,?,?,?,?)')
    .run(booking.id, play.id, booking.name, booking.email, booking.admission_token)
  for (const seat of [1, 2]) sqlite.prepare('INSERT INTO booked_seats (booking_id,play_id,seat_number) VALUES (?,?,?)').run(booking.id, play.id, seat)
  const configured = { ...env, GOOGLE_WALLET_ENABLED: 'true', GOOGLE_WALLET_CLIENT_EMAIL: `${crypto.randomUUID()}@example.invalid`,
    GOOGLE_WALLET_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\n${Buffer.from(der).toString('base64')}\n-----END PRIVATE KEY-----`, DB: db }
  const row = () => ({ ...sqlite.prepare('SELECT * FROM bookings WHERE id = ?').get(booking.id) })
  const google = { stored: null, unavailable: false, classMissing: true, classReviewStatus: 'APPROVED',
    classPatchUnavailable: false, classCreateConflict: false, beforeWrite: null, writes: [] }
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'ephemeral-test-token' })
    assert.ok(url.startsWith('https://walletobjects.googleapis.com/walletobjects/v1/'))
    const resource = new URL(url).pathname.split('/')[3]
    if (!['eventTicketClass', 'eventTicketObject'].includes(resource)) return new Response(null, { status: 404 })
    assert.equal(options.headers.Authorization, 'Bearer ephemeral-test-token')
    if (google.unavailable) return new Response(null, { status: 503 })
    if (url.includes('eventTicketClass')) {
      if (options.method === 'GET') return google.classMissing
        ? new Response(null, { status: 404 }) : Response.json({ reviewStatus: google.classReviewStatus })
      if (options.method === 'POST' && google.classCreateConflict) {
        google.classMissing = false
        google.classReviewStatus = 'DRAFT'
        return new Response(null, { status: 409 })
      }
      if (options.method === 'PATCH' && google.classPatchUnavailable) return new Response(null, { status: 503 })
      google.classMissing = false
      google.classReviewStatus = 'APPROVED'
      google.writes.push(JSON.parse(options.body))
      return Response.json({})
    }
    // Google forbids issuing objects for a class that is still a draft.
    if (google.classReviewStatus.toUpperCase() === 'DRAFT') return new Response(null, { status: 400 })
    if (options.method === 'PATCH' && !google.stored) return new Response(null, { status: 404 })
    if (google.beforeWrite) await google.beforeWrite()
    google.stored = JSON.parse(options.body)
    google.writes.push(google.stored)
    return Response.json(google.stored)
  })
  return { configured, google, sqlite, row, ticket: () => ({ ...row(), play, seats: [1, 2] }) }
}

test('Wallet save creates a class and pass, signs an object-only link and retries cancellation', async t => {
  const { configured, google, sqlite, row, ticket } = walletFixture(t)
  const link = await wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de')
  const [header, payload, signature] = link.split('/').at(-1).split('.')
  assert.equal(await webcrypto.subtle.verify('RSASSA-PKCS1-v1_5', keys.publicKey, Buffer.from(signature, 'base64url'), Buffer.from(`${header}.${payload}`)), true)
  const claims = JSON.parse(Buffer.from(payload, 'base64url'))
  assert.deepEqual(claims.payload, { eventTicketObjects: [{ id: '12345.ticket_public-admission-code' }] })
  assert.deepEqual(claims.origins, ['kolpingtheater-ramsen.de'])
  assert.equal(row().wallet_issued, 1)
  assert.equal(row().wallet_sync_pending, 0)
  assert.ok(google.writes.some(value => value.dateTime?.start === '2026-12-27T19:30:00+01:00'))
  assert.equal(google.stored.seatInfo.seat.defaultValue.value, 'A2, A3')
  sqlite.exec('UPDATE booked_seats SET seat_number = 3 WHERE seat_number = 2; UPDATE bookings SET version = version + 1, wallet_sync_pending = 1')
  assert.equal(await wallet.syncWalletPass(configured, booking.id), 'synced')
  assert.equal(google.stored.seatInfo.seat.defaultValue.value, 'A2, A4')
  for (const [status, expected] of [['checked_in', 'COMPLETED'], ['confirmed', 'ACTIVE']]) {
    sqlite.prepare('UPDATE bookings SET status = ?, version = version + 1, wallet_sync_pending = 1').run(status)
    assert.equal(await wallet.syncWalletPass(configured, booking.id), 'synced')
    assert.equal(google.stored.state, expected)
  }
  sqlite.exec("UPDATE bookings SET status = 'cancelled', version = version + 1, wallet_sync_pending = 1; DELETE FROM booked_seats")
  google.unavailable = true
  assert.equal(await wallet.syncWalletPass(configured, booking.id), 'pending')
  assert.equal(row().wallet_sync_pending, 1)
  google.unavailable = false
  assert.equal(await wallet.syncWalletPass(configured, booking.id), 'synced')
  assert.equal(google.stored.state, 'INACTIVE')
  assert.equal(row().wallet_sync_pending, 0)
})

test('Wallet issuance submits an existing draft class before creating its first pass', async t => {
  const { configured, google, ticket } = walletFixture(t)
  google.classMissing = false
  google.classReviewStatus = 'DRAFT'
  await wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de')
  assert.equal(google.writes[0].reviewStatus, 'UNDER_REVIEW')
  assert.equal(google.stored.state, 'ACTIVE')
  // An approved class needs no further write when ticket details change.
  google.writes.length = 0
  assert.equal(await wallet.syncWalletPass(configured, booking.id), 'synced')
  assert.equal(google.writes.length, 1)
  assert.equal(google.writes[0].state, 'ACTIVE')
})

test('a failed draft submission leaves issuance pending and recovers on retry', async t => {
  const { configured, google, sqlite, row, ticket } = walletFixture(t)
  google.classMissing = false
  google.classReviewStatus = 'draft'
  google.classPatchUnavailable = true
  await assert.rejects(wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de'))
  assert.equal(google.stored, null)
  assert.equal(row().wallet_sync_pending, 1)
  google.classPatchUnavailable = false
  sqlite.exec('UPDATE wallet_sync_jobs SET retry_at = 0')
  assert.equal((await wallet.syncPendingWalletPasses(configured)).synced, 1)
  assert.equal(google.stored.state, 'ACTIVE')
})

test('a concurrently created draft class is read and submitted before issuing a pass', async t => {
  const { configured, google, ticket } = walletFixture(t)
  google.classCreateConflict = true
  await wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de')
  assert.equal(google.writes[0].reviewStatus, 'UNDER_REVIEW')
  assert.equal(google.stored.state, 'ACTIVE')
})

test('failed first issuance persists intent and the worker recreates the missing class', async t => {
  const { configured, google, sqlite, row, ticket } = walletFixture(t)
  google.unavailable = true
  await assert.rejects(wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de'))
  assert.equal(row().wallet_issued, 1)
  assert.equal(row().wallet_sync_pending, 1)
  const failure = sqlite.prepare('SELECT * FROM wallet_sync_jobs').get()
  assert.equal(failure.attempts, 1)
  assert.ok(failure.retry_at > Date.now() / 1000)
  assert.equal((await wallet.syncPendingWalletPasses(configured)).attempted, 0)
  google.unavailable = false
  sqlite.exec('UPDATE wallet_sync_jobs SET retry_at = 0')
  assert.equal((await wallet.syncPendingWalletPasses(configured)).synced, 1)
  assert.equal(google.classMissing, false)
  assert.equal(row().wallet_sync_pending, 0)
})

test('concurrent writers serialize and a cancellation during issuance never returns an active save link', async t => {
  const { configured, google, sqlite, row, ticket } = walletFixture(t)
  google.beforeWrite = async () => {
    assert.equal(await wallet.syncWalletPass(configured, booking.id), 'busy')
    sqlite.exec("UPDATE bookings SET status = 'cancelled', version = version + 1, wallet_sync_pending = 1; DELETE FROM booked_seats")
    google.beforeWrite = null
  }
  await assert.rejects(wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de'))
  assert.equal(row().wallet_sync_pending, 1)
  assert.equal((await wallet.syncPendingWalletPasses(configured)).synced, 1)
  assert.equal(google.stored.state, 'INACTIVE')
})

test('a crashed writer is reclaimed only after lease expiry', async t => {
  const { configured, sqlite } = walletFixture(t)
  sqlite.exec('UPDATE bookings SET wallet_issued = 1, wallet_sync_pending = 1')
  sqlite.prepare('INSERT INTO wallet_sync_jobs (booking_id,lease_token,lease_until) VALUES (?,?,?)')
    .run(booking.id, 'crashed', Math.floor(Date.now() / 1000) + 120)
  assert.equal((await wallet.syncPendingWalletPasses(configured)).attempted, 0)
  sqlite.exec('UPDATE wallet_sync_jobs SET lease_until = 0')
  assert.equal((await wallet.syncPendingWalletPasses(configured)).synced, 1)
})

test('a late provider response after lease expiry schedules reconciliation', async t => {
  const { configured, google, sqlite, row, ticket } = walletFixture(t)
  google.beforeWrite = async () => {
    google.beforeWrite = null
    sqlite.exec("UPDATE wallet_sync_jobs SET lease_until = 0; UPDATE bookings SET status = 'cancelled', version = version + 1, wallet_sync_pending = 1; DELETE FROM booked_seats")
    assert.equal(await wallet.syncWalletPass(configured, booking.id), 'synced')
    assert.equal(row().wallet_sync_pending, 0)
  }
  await assert.rejects(wallet.createWalletLink(configured, ticket(), 'https://kolpingtheater-ramsen.de'))
  assert.equal(row().wallet_sync_pending, 1)
  assert.equal((await wallet.syncPendingWalletPasses(configured)).synced, 1)
  assert.equal(google.stored.state, 'INACTIVE')
})

test('failed jobs back off without starving later bookings', async t => {
  const { configured, sqlite } = walletFixture(t)
  sqlite.exec('UPDATE bookings SET wallet_issued = 1, wallet_sync_pending = 1')
  // More failed jobs than one worker batch can process.
  for (let i = 0; i < 51; i++) {
    const id = `failed-${i}`
    sqlite.prepare('INSERT INTO bookings (id,play_id,name,email,admission_token,wallet_issued,wallet_sync_pending) VALUES (?,?,?,?,?,1,1)')
      .run(id, play.id, 'Local Test', `${id}@example.invalid`, id)
    sqlite.prepare('INSERT INTO wallet_sync_jobs (booking_id,retry_at,attempts) VALUES (?,?,1)')
      .run(id, Math.floor(Date.now() / 1000) + 600)
  }
  const result = await wallet.syncPendingWalletPasses(configured)
  assert.equal(result.attempted, 1)
  assert.equal(result.synced, 1)
})
