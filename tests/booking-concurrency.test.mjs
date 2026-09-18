import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { localD1 } from './helpers/d1.mjs'

const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/db.ts'], bundle: true, write: false, format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const { createBooking, getBookingById, updateBookingSeats } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`)

test('relaxed layouts preserve atomic seat ownership and edit versions', async t => {
  const { sqlite, db } = localD1()
  t.after(() => sqlite.close())
  const playId = 'romeo-julia-2026-12-27-1700'
  const booking = (id, seats) => ({ id, playId, seats, name: 'Lokaler Test', email: `${id}@example.invalid`, requestKey: id, admissionToken: id })
  assert.equal((await createBooking(db, booking('left', [10, 11]))).success, true)
  assert.equal((await createBooking(db, booking('right', [13, 14]))).success, true)
  const conflict = await createBooking(db, booking('conflict', [20, 13]))
  assert.equal(conflict.error, 'seat_conflict')
  assert.equal(await getBookingById(db, 'conflict'), null)
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM booked_seats WHERE seat_number = 20').get().count, 0)

  const original = await getBookingById(db, 'left')
  assert.equal((await updateBookingSeats(db, original, [1, 8])).success, true)
  assert.equal((await updateBookingSeats(db, original, [20])).success, false)
  let current = await getBookingById(db, 'left')
  assert.deepEqual(current.seats, [1, 8])
  assert.equal(current.version, 1)
  assert.equal((await updateBookingSeats(db, current, [20, 13])).error, 'seat_conflict')
  current = await getBookingById(db, 'left')
  assert.deepEqual(current.seats, [1, 8])
  assert.equal(current.version, 1)
  assert.equal((await createBooking(db, { ...booking('duplicate', [20]), email: original.email })).error, 'duplicate_booking')
})
