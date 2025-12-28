// Database utility functions for D1
import type { D1Database } from '@/types/env'
import type { Play, Booking, BookingWithSeats, PlayWithAvailability } from '@/types/database'

/**
 * Get D1 database instance from request context
 * Works with Cloudflare Pages Functions
 */
export function getDatabase(request: Request): D1Database | null {
  // @ts-expect-error - Cloudflare specific property
  const env = request.env as { DB?: D1Database }
  return env?.DB || null
}

/**
 * Get all plays with availability information
 */
export async function getAllPlaysWithAvailability(db: D1Database): Promise<PlayWithAvailability[]> {
  const query = `
    SELECT 
      p.*,
      COUNT(bs.seat_number) as booked_seats,
      (p.total_seats - COUNT(bs.seat_number)) as available_seats,
      CASE WHEN COUNT(bs.seat_number) >= p.total_seats THEN 1 ELSE 0 END as is_sold_out
    FROM plays p
    LEFT JOIN booked_seats bs ON p.id = bs.play_id
    GROUP BY p.id
    ORDER BY p.date ASC, p.time ASC
  `
  
  const result = await db.prepare(query).all<PlayWithAvailability>()
  
  return result.results?.map(play => ({
    ...play,
    is_sold_out: Boolean(play.is_sold_out)
  })) || []
}

/**
 * Get a single play by ID
 */
export async function getPlayById(db: D1Database, playId: string): Promise<Play | null> {
  const result = await db
    .prepare('SELECT * FROM plays WHERE id = ?')
    .bind(playId)
    .first<Play>()
  
  return result
}

/**
 * Get booked seat numbers for a specific play
 */
export async function getBookedSeatsForPlay(db: D1Database, playId: string): Promise<number[]> {
  const result = await db
    .prepare('SELECT seat_number FROM booked_seats WHERE play_id = ? ORDER BY seat_number ASC')
    .bind(playId)
    .all<{ seat_number: number }>()
  
  return result.results?.map(row => row.seat_number) || []
}

/**
 * Check if an email already has a booking for a specific play
 */
export async function hasExistingBooking(
  db: D1Database,
  playId: string,
  email: string
): Promise<boolean> {
  const result = await db
      .prepare('SELECT COUNT(*) as count FROM bookings WHERE play_id = ? AND LOWER(email) = LOWER(?) AND status IN (?, ?)')
      .bind(playId, email, 'confirmed', 'checked_in')
    .first<{ count: number }>()
  
  return (result?.count || 0) > 0
}

/**
 * Create a new booking with seats
 * Uses a transaction to ensure atomicity
 */
export async function createBooking(
  db: D1Database,
  bookingData: {
    id: string
    playId: string
    name: string
    email: string
    seats: number[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Prepare all statements
    const statements = [
      // Insert booking
      db.prepare('INSERT INTO bookings (id, play_id, name, email, status) VALUES (?, ?, ?, ?, ?)')
        .bind(bookingData.id, bookingData.playId, bookingData.name, bookingData.email, 'confirmed'),
      
      // Insert each seat
      ...bookingData.seats.map(seatNumber =>
        db.prepare('INSERT INTO booked_seats (booking_id, play_id, seat_number) VALUES (?, ?, ?)')
          .bind(bookingData.id, bookingData.playId, seatNumber)
      )
    ]
    
    // Execute as batch (transaction)
    const results = await db.batch(statements)
    
    // Check if all succeeded
    const allSucceeded = results.every(r => r.success)
    
    if (!allSucceeded) {
      const failedResult = results.find(r => !r.success)
      return {
        success: false,
        error: failedResult?.error || 'Failed to create booking'
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error creating booking:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get booking details by ID
 */
export async function getBookingById(db: D1Database, bookingId: string): Promise<BookingWithSeats | null> {
  // Get booking
  const booking = await db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(bookingId)
    .first<Booking>()
  
  if (!booking) return null
  
  // Get seats
  const seatsResult = await db
    .prepare('SELECT seat_number FROM booked_seats WHERE booking_id = ? ORDER BY seat_number ASC')
    .bind(bookingId)
    .all<{ seat_number: number }>()
  
  const seats = seatsResult.results?.map(row => row.seat_number) || []
  
  // Get play details
  const play = await getPlayById(db, booking.play_id)
  
  return {
    ...booking,
    seats,
    ...(play && { play })
  }
}

/**
 * Update seats for an existing booking
 * Uses a transaction to ensure atomicity
 */
export async function updateBookingSeats(
  db: D1Database,
  bookingId: string,
  playId: string,
  newSeats: number[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete existing seats and insert new ones in a transaction
    const statements = [
      // Delete all existing seats for this booking
      db.prepare('DELETE FROM booked_seats WHERE booking_id = ?')
        .bind(bookingId),
      
      // Insert each new seat
      ...newSeats.map(seatNumber =>
        db.prepare('INSERT INTO booked_seats (booking_id, play_id, seat_number) VALUES (?, ?, ?)')
          .bind(bookingId, playId, seatNumber)
      )
    ]
    
    // Execute as batch (transaction)
    const results = await db.batch(statements)
    
    // Check if all succeeded
    const allSucceeded = results.every(r => r.success)
    
    if (!allSucceeded) {
      const failedResult = results.find(r => !r.success)
      return {
        success: false,
        error: failedResult?.error || 'Failed to update seats'
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating booking seats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Cancel a booking (soft delete by changing status)
 */
export async function cancelBooking(
  db: D1Database,
  bookingId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify email matches before canceling
    const booking = await db
      .prepare('SELECT email FROM bookings WHERE id = ?')
      .bind(bookingId)
      .first<{ email: string }>()
    
    if (!booking) {
      return { success: false, error: 'Booking not found' }
    }
    
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: 'Email does not match booking' }
    }
    
    // Delete seats (CASCADE should handle this, but explicit is better)
    await db
      .prepare('DELETE FROM booked_seats WHERE booking_id = ?')
      .bind(bookingId)
      .run()
    
    // Update booking status
    const result = await db
      .prepare('UPDATE bookings SET status = ? WHERE id = ?')
      .bind('cancelled', bookingId)
      .run()
    
    if (!result.success) {
      return { success: false, error: 'Failed to cancel booking' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error canceling booking:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

