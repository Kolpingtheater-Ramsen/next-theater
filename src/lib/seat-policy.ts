import { MAX_SEATS, seatLabel, seatNumbers, SEATS_PER_ROW } from './tickets'

export type SeatPolicyResult = { notice: string | null; suggestedSeats: number[] | null }

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

type Candidate = { seats: number[]; changes: number; distance: number }

function prefer(candidate: Candidate, current: Candidate | undefined) {
  if (!current) return true
  for (const key of ['changes', 'distance'] as const) {
    if (candidate[key] !== current[key]) return candidate[key] < current[key]
  }
  const different = candidate.seats.findIndex((seat, index) => seat !== current.seats[index])
  return different >= 0 && candidate.seats[different] < current.seats[different]
}

function suggestSeats(blocks: number[][], booked: number[], selected: number[], existingSingles: Set<number>) {
  const count = selected.length
  if (count > MAX_SEATS) return null
  const occupied = new Set(booked), preferred = new Set(selected)
  const column = (seat: number) => seat % SEATS_PER_ROW + (seat % SEATS_PER_ROW >= SEATS_PER_ROW / 2 ? 1 : 0)
  const distance = (seat: number) => Math.min(...selected.map(other =>
    Math.abs(Math.floor(seat / SEATS_PER_ROW) - Math.floor(other / SEATS_PER_ROW)) * SEATS_PER_ROW +
    Math.abs(column(seat) - column(other))))
  let best: Candidate | undefined

  // Only suggest a complete group of adjacent seats within one physical block.
  // Never split guests across an aisle or rows to avoid a single free seat.
  for (const block of blocks) {
    for (let start = 0; start <= block.length - count; start++) {
      const seats = block.slice(start, start + count)
      if (seats.some(seat => occupied.has(seat))) continue
      // Include gaps caused by releasing original seats in other rows on edits.
      if (singleSeats(blocks, new Set([...occupied, ...seats])).some(seat => !existingSingles.has(seat))) continue
      const candidate = {
        seats,
        changes: seats.filter(seat => !preferred.has(seat)).length,
        distance: seats.reduce((sum, seat) => sum + distance(seat), 0),
      }
      if (prefer(candidate, best)) best = candidate
    }
  }
  return best?.seats ?? null
}

// Seat layout is guidance only. Availability and booking limits are enforced separately.
export function seatPolicy(capacity: number, booked: number[], selected: number[], original: number[] = []): SeatPolicyResult {
  if (!selected.length || selected.every(seat => original.includes(seat))) return { notice: null, suggestedSeats: null }
  const blocks = seatBlocks(capacity)
  const existingSingles = new Set(singleSeats(blocks, new Set([...booked, ...original])))
  const gaps = singleSeats(blocks, new Set([...booked, ...selected]))
    .filter(seat => !existingSingles.has(seat))
  return {
    notice: gaps.length
      ? `Es bleiben einzelne Plätze frei: ${gaps.map(seatLabel).join(', ')}. Wenn möglich, schließe die Lücken. Du kannst mit deiner Auswahl weiterbuchen.`
      : null,
    suggestedSeats: gaps.length ? suggestSeats(blocks, booked, selected, existingSingles) : null,
  }
}
