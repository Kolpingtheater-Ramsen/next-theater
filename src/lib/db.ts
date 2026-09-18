import type { D1Database } from '@/types/env'
import type { Play, Booking, BookingWithSeats, PlayWithAvailability } from '@/types/database'
import { hasStarted } from './tickets'

export async function getAllPlaysWithAvailability(db: D1Database): Promise<PlayWithAvailability[]> {
  const result = await db.prepare(`SELECT p.*, COUNT(bs.seat_number) as booked_seats,
    (p.total_seats - COUNT(bs.seat_number)) as available_seats
    FROM plays p LEFT JOIN booked_seats bs ON p.id = bs.play_id
    WHERE p.published = 1 GROUP BY p.id ORDER BY p.date, p.time`).all<PlayWithAvailability>()
  return (result.results || []).filter(play => !hasStarted(play)).map(play => ({
    ...play, available_seats: Math.max(0, play.available_seats), is_sold_out: play.available_seats <= 0,
  }))
}

export async function getPlayById(db: D1Database, id: string): Promise<Play | null> {
  return db.prepare('SELECT * FROM plays WHERE id = ?').bind(id).first<Play>()
}

export async function getBookedSeatsForPlay(db: D1Database, id: string): Promise<number[]> {
  const result = await db.prepare('SELECT seat_number FROM booked_seats WHERE play_id = ? ORDER BY seat_number').bind(id).all<{seat_number: number}>()
  return (result.results || []).map(row => row.seat_number)
}

export async function getBookingById(db: D1Database, id: string): Promise<BookingWithSeats | null> {
  const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first<Booking>()
  if (!booking) return null
  const [seats, play] = await Promise.all([
    db.prepare('SELECT seat_number FROM booked_seats WHERE booking_id = ? ORDER BY seat_number').bind(id).all<{seat_number: number}>(),
    getPlayById(db, booking.play_id),
  ])
  return { ...booking, seats: (seats.results || []).map(row => row.seat_number), ...(play && { play }) }
}

export async function getBookingByRequestKey(db: D1Database, key: string) {
  const row = await db.prepare('SELECT id FROM bookings WHERE request_key = ?').bind(key).first<{ id: string }>()
  return row ? getBookingById(db, row.id) : null
}

export type BookingFailure = 'seat_conflict' | 'duplicate_booking' | 'request_conflict' | 'changed' | 'database'
export function bookingFailure(error: unknown): BookingFailure {
  const text = error instanceof Error ? `${error.message} ${String(error.cause || '')}` : String(error)
  if (text.includes('duplicate_booking')) return 'duplicate_booking'
  if (text.includes('booked_seats.play_id')) return 'seat_conflict'
  if (text.includes('bookings.request_key')) return 'request_conflict'
  return 'database'
}

export async function createBooking(db: D1Database, data: {
  id: string; playId: string; name: string; email: string; seats: number[]; requestKey: string; admissionToken: string
}): Promise<{ success: boolean; error?: BookingFailure }> {
  try {
    await db.batch([
      db.prepare(`INSERT INTO bookings (id,play_id,name,email,status,admission_token,request_key,email_status)
        VALUES (?,?,?,?,'confirmed',?,?,'pending')`)
        .bind(data.id, data.playId, data.name, data.email, data.admissionToken, data.requestKey),
      ...data.seats.map(seat => db.prepare('INSERT INTO booked_seats (booking_id,play_id,seat_number) VALUES (?,?,?)').bind(data.id,data.playId,seat)),
    ])
    return { success: true }
  } catch (error) { return { success: false, error: bookingFailure(error) } }
}

export async function updateBookingSeats(db: D1Database, booking: BookingWithSeats, seats: number[]) {
  const version = booking.version || 0
  const allowed = `EXISTS (SELECT 1 FROM bookings WHERE id = ? AND status = 'confirmed' AND version = ?)`
  try {
    const results = await db.batch([
      db.prepare(`DELETE FROM booked_seats WHERE booking_id = ? AND ${allowed}`).bind(booking.id,booking.id,version),
      ...seats.map(seat => db.prepare(`INSERT INTO booked_seats (booking_id,play_id,seat_number) SELECT ?,?,? WHERE ${allowed}`)
        .bind(booking.id,booking.play_id,seat,booking.id,version)),
      db.prepare(`UPDATE bookings SET version = version + 1, wallet_sync_pending = 1
        WHERE id = ? AND status = 'confirmed' AND version = ?`).bind(booking.id,version),
    ])
    return { success: !!results.at(-1)?.meta.changes, error: 'changed' as BookingFailure }
  } catch (error) { return { success: false, error: bookingFailure(error) } }
}

export async function cancelBooking(db: D1Database, booking: BookingWithSeats) {
  const version = booking.version || 0
  const results = await db.batch([
    db.prepare(`UPDATE bookings SET status = 'cancelled', cancelled_at = datetime('now'), version = version + 1, wallet_sync_pending = 1
      WHERE id = ? AND status = 'confirmed' AND version = ?`).bind(booking.id,version),
    db.prepare(`DELETE FROM booked_seats WHERE booking_id = ? AND EXISTS
      (SELECT 1 FROM bookings WHERE id = ? AND status = 'cancelled' AND version = ?)`).bind(booking.id,booking.id,version + 1),
  ])
  return { success: !!results[0].meta.changes }
}
