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

test('suggests the nearest edge seat and preserves the requested seat count', () => {
  assert.deepEqual(seatPolicy(68, [], [2]).suggestedSeats, [1])
  assert.deepEqual(seatPolicy(68, [], [11, 12]).suggestedSeats, [10, 11])
  assert.equal(seatPolicy(68, [], [1, 2]).suggestedSeats, null)
})

test('prefers sitting together, without treating the aisle as an adjacent seat', () => {
  const suggested = seatPolicy(68, [], [1, 2, 3]).suggestedSeats
  assert.deepEqual(suggested, [10, 11, 12])
  assert.equal(seatPolicy(68, [], suggested).notice, null)
})

test('finds split alternatives when no complete group fits and never uses occupied seats', () => {
  const free = [1, 2, 3, 4, 10, 11, 12, 13]
  const booked = seatBlocks(68).flat().filter(seat => !free.includes(seat))
  const selected = [1, 2, 3, 10, 11]
  const suggested = seatPolicy(68, booked, selected).suggestedSeats
  assert.deepEqual(suggested, [1, 2, 3, 4, 10])
  assert.ok(suggested.every(seat => free.includes(seat)))
  assert.equal(seatPolicy(68, booked, suggested).notice, null)
  assert.deepEqual(selected, [1, 2, 3, 10, 11])
})

test('reports no alternative when every available choice would leave a new single seat', () => {
  const booked = seatBlocks(68).flat().filter(seat => ![1, 2, 3, 4].includes(seat))
  const policy = seatPolicy(68, booked, [1, 2, 3])
  assert.ok(policy.notice)
  assert.equal(policy.suggestedSeats, null)
})

test('edit recommendations also prevent gaps caused by releasing original seats in another row', () => {
  assert.deepEqual(seatPolicy(68, [10, 12], [1], [11]).suggestedSeats, [11])
  assert.equal(seatPolicy(68, [], [1], [1, 8]).suggestedSeats, null)
})

test('recommendations agree with an exhaustive search for every eight-seat booking layout', () => {
  // Independently enumerate all booked / selected / free layouts and all
  // possible replacements. This catches missed alternatives and unsafe ones.
  const blocks = [[1, 2, 3, 4], [5, 6, 7, 8]]
  const seats = blocks.flat()
  const singles = occupied => blocks.flatMap(block => block.filter((seat, index) =>
    !occupied.includes(seat) &&
    (index === 0 || occupied.includes(block[index - 1])) &&
    (index === block.length - 1 || occupied.includes(block[index + 1]))))
  const choices = (values, size, start = 0, chosen = []) => {
    if (chosen.length === size) return [chosen]
    return values.slice(start).flatMap((seat, offset) => choices(values, size, start + offset + 1, [...chosen, seat]))
  }
  for (let layout = 0; layout < 3 ** seats.length; layout++) {
    let code = layout
    const booked = [], selected = []
    for (const seat of seats) {
      if (code % 3 === 1) booked.push(seat)
      if (code % 3 === 2) selected.push(seat)
      code = Math.floor(code / 3)
    }
    if (!selected.length || selected.length > 5) continue
    const policy = seatPolicy(8, booked, selected)
    if (!policy.notice) { assert.equal(policy.suggestedSeats, null); continue }
    const existing = singles(booked)
    const valid = candidate => !singles([...booked, ...candidate]).some(seat => !existing.includes(seat))
    const feasible = choices(seats.filter(seat => !booked.includes(seat)), selected.length).some(valid)
    assert.equal(policy.suggestedSeats !== null, feasible, `layout ${layout}`)
    if (policy.suggestedSeats) {
      assert.equal(policy.suggestedSeats.length, selected.length)
      assert.equal(new Set(policy.suggestedSeats).size, selected.length)
      assert.ok(policy.suggestedSeats.every(seat => seats.includes(seat) && !booked.includes(seat)))
      assert.ok(valid(policy.suggestedSeats), `layout ${layout}`)
    }
  }
})
