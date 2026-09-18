import { seatLabel, seatNumbers, SEATS_PER_ROW } from './tickets'

export type SeatPolicyIssue = { code: 'single_seat_gap' | 'split_group'; message: string; seats: number[] }

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

export function seatPolicy(capacity: number, booked: number[], selected: number[], original: number[] = []) {
  const blocks = seatBlocks(capacity)
  const occupied = new Set(booked)
  const existingSingles = new Set(singleSeats(blocks, new Set([...booked, ...original])))
  const newSingles = (choice: number[]) => singleSeats(blocks, new Set([...booked, ...choice]))
    .filter(seat => !existingSingles.has(seat))
  const candidates = selected.length ? blocks.flatMap(block => block.flatMap((_, index) => {
    const choice = block.slice(index, index + selected.length)
    return choice.length === selected.length && choice.every(seat => !occupied.has(seat)) &&
      !newSingles(choice).length ? [choice] : []
  })) : []
  // Prefer a nearby alternative; never silently change a visitor's selection.
  const center = selected.reduce((sum, seat) => sum + seat, 0) / (selected.length || 1)
  candidates.sort((a, b) => Math.abs(a.reduce((sum, seat) => sum + seat, 0) / a.length - center) -
    Math.abs(b.reduce((sum, seat) => sum + seat, 0) / b.length - center))
  const sorted = [...selected].sort((a, b) => a - b)
  const unchanged = original.length === sorted.length && [...original].sort((a, b) => a - b).every((seat, i) => seat === sorted[i])
  let issue: SeatPolicyIssue | null = null
  if (selected.length && !unchanged) {
    const gaps = newSingles(selected)
    if (gaps.length) issue = {
      code: 'single_seat_gap', seats: gaps,
      message: `So ${gaps.length === 1 ? 'bleibt ein einzelner Platz' : 'bleiben einzelne Plätze'} frei: ${gaps.map(seatLabel).join(', ')}. Bitte schließe die Lücke oder verschiebe deine Auswahl.`,
    }
    else if (candidates.length && !candidates.some(choice => choice.every((seat, i) => seat === sorted[i]))) issue = {
      code: 'split_group', seats: [],
      message: 'Bitte wähle zusammenhängende Plätze in einem Sitzblock. Für eure Gruppe sind noch passende Plätze frei.',
    }
  }
  return { issue, suggestion: issue ? candidates[0] || null : null }
}
