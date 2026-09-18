import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { webcrypto } from 'node:crypto'
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

test('Wallet save flow creates an event and pass, signs an object-only link, and queues failed updates', async t => {
  const keys = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify'])
  const der = await webcrypto.subtle.exportKey('pkcs8', keys.privateKey)
  const state = { ...booking, seats: [1, 2], version: 0, wallet_issued: 0, wallet_sync_pending: 0 }
  const configured = { ...env, GOOGLE_WALLET_ENABLED: 'true', GOOGLE_WALLET_CLIENT_EMAIL: 'wallet-test@example.invalid', GOOGLE_WALLET_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\n${Buffer.from(der).toString('base64')}\n-----END PRIVATE KEY-----`, DB: {
    prepare(sql) { return {
      bind() { return this },
      async first() { return sql.includes('FROM plays') ? play : { ...state } },
      async all() { return { results: state.seats.map(seat_number => ({ seat_number })) } },
      async run() {
        if (sql.includes('wallet_issued = 1')) state.wallet_issued = 1
        if (sql.includes('wallet_sync_pending = 1')) state.wallet_sync_pending = 1
        if (sql.includes('wallet_sync_pending = 0')) state.wallet_sync_pending = 0
        return { meta: { changes: 1 } }
      },
    } },
  } }
  let stored, unavailable = false
  const writes = []
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'ephemeral-test-token' })
    assert.ok(url.startsWith('https://walletobjects.googleapis.com/walletobjects/v1/'))
    assert.equal(options.headers.Authorization, 'Bearer ephemeral-test-token')
    if (url.includes('eventticketclass')) {
      if (options.method === 'GET') return new Response(null, { status: 404 })
      writes.push(JSON.parse(options.body))
      return Response.json({})
    }
    if (unavailable) return new Response(null, { status: 503 })
    if (options.method === 'PATCH' && !stored) return new Response(null, { status: 404 })
    stored = JSON.parse(options.body)
    writes.push(stored)
    return Response.json(stored)
  })
  const link = await wallet.createWalletLink(configured, state, 'https://kolpingtheater-ramsen.de')
  const [header, payload, signature] = link.split('/').at(-1).split('.')
  assert.equal(await webcrypto.subtle.verify('RSASSA-PKCS1-v1_5', keys.publicKey, Buffer.from(signature, 'base64url'), Buffer.from(`${header}.${payload}`)), true)
  const claims = JSON.parse(Buffer.from(payload, 'base64url'))
  assert.deepEqual(claims.payload, { eventTicketObjects: [{ id: '12345.ticket_public-admission-code' }] })
  assert.deepEqual(claims.origins, ['kolpingtheater-ramsen.de'])
  assert.equal(state.wallet_issued, 1)
  assert.equal(state.wallet_sync_pending, 0)
  assert.ok(writes.some(value => value.dateTime?.start === '2026-12-27T19:30:00+01:00'))
  assert.equal(stored.seatInfo.seat.defaultValue.value, 'A2, A3')
  state.status = 'cancelled'; state.seats = []; state.version++
  unavailable = true
  await wallet.syncWalletPass(configured, state.id)
  assert.equal(state.wallet_sync_pending, 1)
  unavailable = false
  await wallet.syncWalletPass(configured, state.id)
  assert.equal(stored.state, 'INACTIVE')
  assert.equal(state.wallet_sync_pending, 0)
})
