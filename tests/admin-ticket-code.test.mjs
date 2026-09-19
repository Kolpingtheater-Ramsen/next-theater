import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/admin-ticket-code.ts'], bundle: true, write: false, format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const { extractAdminTicketCode } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`)

test('scanner and manual entry accept admission codes, ticket IDs and links', () => {
  assert.equal(extractAdminTicketCode(' KTR1:1234-abcd\n'), 'KTR1:1234-abcd')
  assert.equal(extractAdminTicketCode('booking-test-123'), 'booking-test-123')
  assert.equal(extractAdminTicketCode('https://kolpingtheater-ramsen.de/booking/view/booking-test-123?new=true#ticket'), 'booking-test-123')
  assert.equal(extractAdminTicketCode('http://localhost:8791/booking/view/booking-test-123/'), 'booking-test-123')
})

test('unrelated QR codes and malformed input cannot become ticket lookups', () => {
  for (const input of ['', 'KTR1:', 'KTR1:not-a-code', 'booking-', 'booking-test/extra', 'hello',
    'https://example.com/elsewhere/view/booking-test', 'https://example.com/booking/view/booking-test/other',
    'javascript:booking-test', 'file:///booking/view/booking-test']) {
    assert.equal(extractAdminTicketCode(input), null, input)
  }
})
