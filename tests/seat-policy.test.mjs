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
test('a middle gap and a single seat at the edge are rejected with a valid alternative', () => {
  for (const selected of [[2], [1, 2, 3], [10, 11, 13, 14]]) {
    const policy = seatPolicy(68, [], selected)
    assert.equal(policy.issue.code, 'single_seat_gap')
    assert.ok(policy.suggestion)
    assert.equal(seatPolicy(68, [], policy.suggestion).issue, null)
  }
  assert.equal(seatPolicy(68, [], [1, 2]).issue, null)
  assert.equal(seatPolicy(68, [], [1, 2, 3, 4]).issue, null)
})
test('groups stay together when an orphan-free contiguous group is available', () => {
  for (const selected of [[1, 8], [4, 5], [14, 15], [8, 10]]) {
    assert.equal(seatPolicy(68, [], selected).issue.code, 'split_group')
  }
})
test('existing isolated seats can be booked and do not block another row', () => {
  assert.equal(seatPolicy(68, [1, 2, 3], [4]).issue, null)
  assert.equal(seatPolicy(68, [1, 2, 3], [10, 11]).issue, null)
})
test('the final scattered seats remain bookable when no suitable contiguous group remains', () => {
  const booked = seatBlocks(68).flat().filter(seat => ![1, 8].includes(seat))
  assert.equal(seatPolicy(68, booked, [1, 8]).issue, null)
})
test('edits also check newly released seats; unchanged legacy selections remain valid', () => {
  assert.equal(seatPolicy(68, [10, 14], [1, 2, 3, 4], [11, 13]).issue, null)
  assert.equal(seatPolicy(68, [10, 12], [1, 2], [11]).issue.code, 'single_seat_gap')
  assert.equal(seatPolicy(68, [], [1, 8], [1, 8]).issue, null)
})
test('exhaustive single-block choices never introduce isolated seats when accepted', () => {
  const block = [10, 11, 12, 13, 14]
  const isolates = taken => block.filter((seat, index) => !taken.includes(seat) &&
    (index === 0 || taken.includes(block[index - 1])) && (index === 4 || taken.includes(block[index + 1])))
  for (let occupied = 0; occupied < 32; occupied++) for (let chosen = 1; chosen < 32; chosen++) {
    if (occupied & chosen) continue
    const booked = block.filter((_, i) => occupied & (1 << i))
    const selected = block.filter((_, i) => chosen & (1 << i))
    if (!seatPolicy(68, booked, selected).issue) {
      const old = isolates(booked)
      assert.ok(isolates([...booked, ...selected]).every(seat => old.includes(seat)))
    }
  }
})
