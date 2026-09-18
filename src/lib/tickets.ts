import type { Play } from '@/types/database'

export const MAX_SEATS = 5
export const SEATS_PER_ROW = 10
export const BLOCKED_SEATS = [0, 9]
export const DEFAULT_VENUE = 'Klosterhof 7, 67305 Ramsen'
export const DEFAULT_TIMEZONE = 'Europe/Berlin'

export function seatLabel(seat: number) {
  return `${String.fromCharCode(65 + Math.floor(seat / SEATS_PER_ROW))}${seat % SEATS_PER_ROW + 1}`
}

export function seatNumbers(capacity: number) {
  return Array.from({ length: capacity + BLOCKED_SEATS.length }, (_, seat) => seat)
    .filter(seat => !BLOCKED_SEATS.includes(seat))
}

export function validSeats(value: unknown, capacity: number): value is number[] {
  const available = new Set(seatNumbers(capacity))
  return Array.isArray(value) && value.length > 0 && value.length <= MAX_SEATS &&
    new Set(value).size === value.length && value.every(seat => Number.isInteger(seat) && available.has(seat))
}

// Convert venue wall time to an instant, independent of the visitor's timezone.
export function performanceStart(play: Pick<Play, 'date' | 'time' | 'timezone'>): Date {
  const wall = Date.parse(`${play.date}T${play.time}:00Z`)
  let instant = wall
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: play.timezone || DEFAULT_TIMEZONE, year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  })
  for (let i = 0; i < 2; i++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p => [p.type, p.value]))
    const displayed = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`)
    instant += wall - displayed
  }
  return new Date(instant)
}

export function hasStarted(play: Play, now = Date.now()) {
  return performanceStart(play).getTime() <= now
}

export function isBookingOpen(play: Play, now = Date.now()) {
  return play.published !== 0 && play.booking_open !== 0 && !hasStarted(play, now)
}

export function formatDay(date: string, long = false) {
  return new Intl.DateTimeFormat('de-DE', { timeZone: 'UTC', weekday: long ? 'long' : 'short', day: 'numeric', month: long ? 'long' : '2-digit', year: 'numeric' }).format(new Date(`${date}T12:00:00Z`))
}

export function admissionCode(token: string) { return `KTR1:${token}` }

export function ticketCalendar(play: Play, ticket: string, now = new Date()) {
  const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const start = performanceStart(play)
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kolpingtheater Ramsen//Tickets//DE',
    'BEGIN:VEVENT', `UID:${ticket}@kolpingtheater-ramsen.de`, `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    ...(play.duration_minutes ? [`DTEND:${stamp(new Date(start.getTime() + play.duration_minutes * 60000))}`] : []),
    `SUMMARY:${escape(`${play.title} · Kolpingtheater Ramsen`)}`,
    `LOCATION:${escape(play.venue || DEFAULT_VENUE)}`, 'END:VEVENT', 'END:VCALENDAR',
  ]
  // Fold at 75 UTF-8 octets without splitting a Unicode character (RFC 5545).
  return lines.map(line => {
    let result = '', width = 0
    for (const char of line) {
      const size = new TextEncoder().encode(char).length
      if (width + size > 75) { result += '\r\n '; width = 1 }
      result += char; width += size
    }
    return result
  }).join('\r\n') + '\r\n'
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
