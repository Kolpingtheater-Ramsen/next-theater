import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/seat-policy.ts'], bundle: true, write: false, format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const { seatPolicy, seatBlocks } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`)

test('blocks respect front corners, the aisle and row boundaries', () => {
  assert.deepEqual(seatBlocks(68).slice(0, 4), [[1, 2, 3, 4], [5, 6, 7, 8], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19]])
  assert.equal(seatBlocks(68).flat().length, 68)
})
test('new single-seat gaps produce optional guidance', () => {
  for (const selected of [[2], [1, 2, 3], [10, 11, 13, 14]]) {
    const policy = seatPolicy(68, [], selected)
    assert.match(policy.notice, /Du kannst mit deiner Auswahl weiterbuchen/)
  }
  assert.equal(seatPolicy(68, [], [1, 2]).notice, null)
})
test('separate groups and seats in the middle of a free block need no warning', () => {
  for (const selected of [[1, 8], [4, 5], [14, 15], [8, 10], [12]]) {
    assert.equal(seatPolicy(68, [], selected).notice, null)
  }
})
test('existing isolated seats do not trigger new warnings', () => {
  assert.equal(seatPolicy(68, [1, 2, 3], [4]).notice, null)
  assert.equal(seatPolicy(68, [1, 2, 3], [10, 11]).notice, null)
})
test('partial releases and unchanged bookings remain free of warnings', () => {
  assert.equal(seatPolicy(68, [10, 14], [11, 12], [11, 12, 13]).notice, null)
  assert.equal(seatPolicy(68, [], [1], [1, 8]).notice, null)
  assert.equal(seatPolicy(68, [], [1, 8], [1, 8]).notice, null)
  assert.equal(seatPolicy(68, [], [], [1, 2]).notice, null)
})
test('moving a seat can explain a newly released gap without refusing the edit', () => {
  assert.match(seatPolicy(68, [10, 12], [1, 2], [11]).notice, /B2.*weiterbuchen/)
})
