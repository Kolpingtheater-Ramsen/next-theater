import { seatLabel, seatNumbers, SEATS_PER_ROW } from './tickets'

// Aisles, row boundaries and unavailable corners separate physical seat blocks.
export function seatBlocks(capacity: number): number[][] {
  const blocks: number[][] = []
  for (const seat of seatNumbers(capacity)) {
    const last = blocks.at(-1)
    const previous = last?.at(-1)
    if (previous === undefined || seat !== previous + 1 ||
      Math.floor(seat / SEATS_PER_ROW) !== Math.floor(previous / SEATS_PER_ROW) ||
      seat % SEATS_PER_ROW === SEATS_PER_ROW / 2) blocks.push([seat])
    else last!.push(seat)
  }
  return blocks
}

function singleSeats(blocks: number[][], occupied: Set<number>): number[] {
  return blocks.flatMap(block => block.filter((seat, index) => !occupied.has(seat) &&
    (index === 0 || occupied.has(block[index - 1])) &&
    (index === block.length - 1 || occupied.has(block[index + 1]))))
}

// Seat layout is guidance only. Availability and booking limits are enforced separately.
export function seatPolicy(capacity: number, booked: number[], selected: number[], original: number[] = []) {
  if (!selected.length || selected.every(seat => original.includes(seat))) return { notice: null }
  const blocks = seatBlocks(capacity)
  const existingSingles = new Set(singleSeats(blocks, new Set([...booked, ...original])))
  const gaps = singleSeats(blocks, new Set([...booked, ...selected]))
    .filter(seat => !existingSingles.has(seat))
  return {
    notice: gaps.length
      ? `Es bleiben einzelne Plätze frei: ${gaps.map(seatLabel).join(', ')}. Wenn möglich, schließe die Lücken. Du kannst mit deiner Auswahl weiterbuchen.`
      : null,
  }
}
