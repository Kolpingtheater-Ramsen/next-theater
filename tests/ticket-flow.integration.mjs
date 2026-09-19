import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const base = process.env.TICKET_TEST_URL
if (base && !['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('These tests only run against an isolated local database.')

test('ticket lifecycle on local D1', { skip: !base }, async t => {
  const run = randomUUID()
  const booking = (playId, seats, email = `${randomUUID()}@example.invalid`) => ({ playId, seats, email, name: 'Lokaler Tickettest', requestKey: randomUUID() })
  async function api(path, method = 'GET', body, headers = {}) {
    const response = await fetch(`${base}${path}`, { method, headers: { 'Content-Type': 'application/json', ...headers }, ...(body && { body: JSON.stringify(body) }) })
    return { status: response.status, data: await response.json(), headers: response.headers }
  }
  const performances = await api('/api/plays')
  const plays = performances.data.plays.filter(p => p.id.startsWith('romeo-julia-2026'))
  assert.equal(plays.length, 6)
  assert.deepEqual(plays.map(p => `${p.date} ${p.time}`), ['2026-12-27 17:00', '2026-12-27 19:30', '2026-12-28 17:00', '2026-12-28 19:30', '2026-12-29 17:00', '2026-12-29 19:30'])
  const adminLogin = await api('/api/admin/login', 'POST', { password: process.env.TICKET_TEST_ADMIN_PASSWORD || 'local-ticket-test-only' })
  assert.equal(adminLogin.status, 200)
  const fixture = await api('/api/admin/plays', 'POST', { title: `Lokaler Test ${run}`, date: '2030-12-29', time: '19:30', display_date: 'Lokaler Test', total_seats: 68 }, { Cookie: adminLogin.headers.get('set-cookie').split(';')[0] })
  assert.equal(fixture.status, 200)
  const play = fixture.data.id
  const payload = booking(play, [20, 21], `lifecycle-${run}@example.invalid`)
  let current, cookie
  await t.test('reject blocked seats, duplicate seat numbers, too many seats and cross-origin requests', async () => {
    for (const seats of [[0], [9], [70], [1, 1], [1, 2, 3, 4, 5, 6]]) assert.equal((await api('/api/bookings', 'POST', booking(play, seats))).status, 400)
    assert.equal((await api('/api/bookings', 'POST', payload, { Origin: 'https://unrelated.invalid' })).status, 403)
  })
  await t.test('create, retry and separate admission from management access', async () => {
    const created = await api('/api/bookings', 'POST', payload)
    assert.equal(created.status, 201)
    assert.equal(created.data.emailStatus, 'not_configured')
    const repeated = await api('/api/bookings', 'POST', payload)
    assert.equal(repeated.status, 200)
    assert.equal(repeated.data.bookingId, created.data.bookingId)
    const read = await api(`/api/bookings/${created.data.bookingId}`)
    current = read.data.booking
    assert.ok(current.admission_token && !current.id.includes(current.admission_token))
    assert.equal((await api(`/api/bookings/KTR1:${current.admission_token}`)).status, 404)
    assert.ok(read.headers.get('cache-control').includes('no-store'))
    assert.equal(read.data.walletAvailable, false)
    assert.equal((await api(`/api/bookings/${current.id}/wallet`, 'POST', {})).status, 503)
  })
  await t.test('update, prevent stale changes and preserve selected seats', async () => {
    const withGaps = await api(`/api/bookings/${current.id}`, 'PATCH', { seats: [21, 22, 23], version: 0 })
    assert.equal(withGaps.status, 200)
    assert.deepEqual(withGaps.data.booking.seats, [21, 22, 23])
    const updated = await api(`/api/bookings/${current.id}`, 'PATCH', { seats: [20, 21, 22], version: withGaps.data.booking.version })
    assert.equal(updated.status, 200)
    assert.deepEqual(updated.data.booking.seats, [20, 21, 22])
    current = updated.data.booking
    const stale = await api(`/api/bookings/${current.id}`, 'PATCH', { seats: [24], version: 0 })
    assert.equal(stale.status, 409)
    assert.equal(stale.data.code, 'changed')
  })
  await t.test('partial seat release can leave a gap without blocking the guest', async () => {
    const reduced = await api(`/api/bookings/${current.id}`, 'PATCH', { seats: [20, 22], version: current.version })
    assert.equal(reduced.status, 200)
    assert.deepEqual(reduced.data.booking.seats, [20, 22])
    current = reduced.data.booking
  })
  await t.test('concurrent requests cannot reserve one seat twice', async () => {
    const results = await Promise.all([api('/api/bookings', 'POST', booking(play, [30])), api('/api/bookings', 'POST', booking(play, [30]))])
    assert.deepEqual(results.map(r => r.status).sort(), [201, 409])
    assert.equal(results.find(r => r.status === 409).data.code, 'seat_conflict')
  })
  await t.test('concurrent same-email requests yield one booking', async () => {
    const email = `duplicate-${run}@example.invalid`
    const results = await Promise.all([api('/api/bookings', 'POST', booking(play, [31], email)), api('/api/bookings', 'POST', booking(play, [34], email))])
    assert.deepEqual(results.map(r => r.status).sort(), [201, 409])
    assert.equal(results.find(r => r.status === 409).data.code, 'duplicate_booking')
  })
  await t.test('replayed simultaneous requests return the same booking', async () => {
    const same = booking(play, [40])
    const results = await Promise.all([api('/api/bookings', 'POST', same), api('/api/bookings', 'POST', same)])
    assert.ok(results.every(r => r.status === 200 || r.status === 201), JSON.stringify(results.map(r => ({status:r.status,data:r.data}))))
    assert.equal(results[0].data.bookingId, results[1].data.bookingId)
  })
  await t.test('server accepts gaps, separated groups and middle seats', async () => {
    for (const seats of [[2], [1, 8], [12]]) {
      const result = await api('/api/bookings', 'POST', booking(play, seats))
      assert.equal(result.status, 201, JSON.stringify(result.data))
      assert.deepEqual((await api(`/api/bookings/${result.data.bookingId}`)).data.booking.seats, seats)
    }
  })
  await t.test('concurrent disjoint bookings both succeed even when they leave a gap', async () => {
    const results = await Promise.all([
      api('/api/bookings', 'POST', booking(play, [50, 51])),
      api('/api/bookings', 'POST', booking(play, [53, 54])),
    ])
    assert.deepEqual(results.map(r => r.status).sort(), [201, 201])
    const occupied = (await api(`/api/plays/${play}/seats`)).data.bookedSeats
    assert.ok(occupied.includes(51) && occupied.includes(53))
    assert.ok(!occupied.includes(52))
  })
  await t.test('admin session rejects forged credentials and supports admission-only scanning', async () => {
    assert.equal((await api('/api/admin/bookings', 'GET', undefined, { Authorization: `Bearer ${Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + 86400000 })).toString('base64')}` })).status, 401)
    const login = await api('/api/admin/login', 'POST', { password: process.env.TICKET_TEST_ADMIN_PASSWORD || 'local-ticket-test-only' })
    assert.equal(login.status, 200)
    cookie = login.headers.get('set-cookie').split(';')[0]
    const scanned = await api(`/api/admin/tickets?code=${encodeURIComponent(`KTR1:${current.admission_token}`)}`, 'GET', undefined, { Cookie: cookie })
    assert.equal(scanned.data.booking.id, current.id)
    assert.equal((await api('/api/admin/checkin', 'POST', { bookingId: current.id }, { Cookie: cookie })).status, 200)
    current = (await api(`/api/bookings/${current.id}`)).data.booking
    assert.equal(current.status, 'checked_in')
    const confirmed = await api(`/api/admin/bookings?playId=${play}&status=confirmed`, 'GET', undefined, { Cookie: cookie })
    assert.equal(confirmed.status, 200)
    assert.ok(confirmed.data.bookings.length > 0)
    assert.ok(confirmed.data.bookings.every(b => b.status === 'confirmed' && b.id !== current.id))
    assert.ok(confirmed.headers.get('cache-control').includes('no-store'))
    const csv = await fetch(`${base}/api/admin/bookings?playId=${play}&status=confirmed&format=csv`, { headers: { Cookie: cookie } })
    assert.equal(csv.status, 200)
    assert.ok(csv.headers.get('cache-control').includes('no-store'))
    const csvText = await csv.text()
    assert.ok(!csvText.includes(current.id))
    assert.ok(confirmed.data.bookings.every(b => csvText.includes(b.id)))
    assert.equal((await api(`/api/bookings/${current.id}`, 'DELETE', { version: current.version })).status, 409)
    assert.equal((await api('/api/admin/checkout', 'POST', { bookingId: current.id }, { Cookie: cookie })).status, 200)
    current = (await api(`/api/bookings/${current.id}`)).data.booking
  })
  await t.test('cancellation releases seats and logout revokes the session', async () => {
    assert.equal((await api(`/api/bookings/${current.id}`, 'DELETE', { version: current.version })).status, 200)
    const read = await api(`/api/bookings/${current.id}`)
    assert.equal(read.data.booking.status, 'cancelled')
    assert.deepEqual(read.data.booking.seats, [])
    const availability = await api(`/api/plays/${play}/seats`)
    assert.ok([20, 21, 22].every(seat => !availability.data.bookedSeats.includes(seat)))
    assert.equal((await api('/api/admin/logout', 'POST', {}, { Cookie: cookie })).status, 200)
    assert.equal((await api('/api/admin/bookings', 'GET', undefined, { Cookie: cookie })).status, 401)
  })
})
