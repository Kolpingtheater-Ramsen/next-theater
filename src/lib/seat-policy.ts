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

type Candidate = { seats: number[]; groups: number; changes: number; distance: number }

function prefer(candidate: Candidate, current: Candidate | undefined) {
  if (!current) return true
  for (const key of ['groups', 'changes', 'distance'] as const) {
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
  let best: (Candidate | undefined)[] = Array(count + 1)
  best[0] = { seats: [], groups: 0, changes: 0, distance: 0 }

  // Each physical block has at most five seats. Enumerate its small set of
  // choices, then combine the best result for each seat count across blocks.
  // This also checks newly freed seats outside the selected row when editing.
  for (const block of blocks) {
    const free = block.filter(seat => !occupied.has(seat))
    const options: Candidate[] = []
    for (let mask = 0; mask < 2 ** free.length; mask++) {
      const seats = free.filter((_, index) => mask & (1 << index))
      if (seats.length > count) continue
      const chosen = new Set(seats)
      if (singleSeats([block], new Set([...occupied, ...seats])).some(seat => !existingSingles.has(seat))) continue
      options.push({
        seats,
        groups: seats.filter(seat => seat === block[0] || !chosen.has(seat - 1)).length,
        changes: seats.filter(seat => !preferred.has(seat)).length,
        distance: seats.reduce((sum, seat) => sum + distance(seat), 0),
      })
    }
    const next: (Candidate | undefined)[] = Array(count + 1)
    for (const previous of best) {
      if (!previous) continue
      for (const option of options) {
        const size = previous.seats.length + option.seats.length
        if (size > count) continue
        const candidate = {
          seats: [...previous.seats, ...option.seats],
          groups: previous.groups + option.groups,
          changes: previous.changes + option.changes,
          distance: previous.distance + option.distance,
        }
        if (prefer(candidate, next[size])) next[size] = candidate
      }
    }
    best = next
  }
  return best[count]?.seats ?? null
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
