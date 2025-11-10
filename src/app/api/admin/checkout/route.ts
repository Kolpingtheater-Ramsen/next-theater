import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'

/**
 * POST /api/admin/checkout
 * Reverts a booking from checked_in back to confirmed (admin only)
 */
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!requireAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { bookingId } = body
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    // Get D1 database
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }
    
    // Check if booking exists and is checked_in
    const booking = await db
      .prepare('SELECT * FROM bookings WHERE id = ? AND status = ?')
      .bind(bookingId, 'checked_in')
      .first()
    
    if (!booking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found or not checked in' 
        },
        { status: 404 }
      )
    }
    
    // Update booking status back to confirmed
    const result = await db
      .prepare('UPDATE bookings SET status = ? WHERE id = ?')
      .bind('confirmed', bookingId)
      .run()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to revert check-in' },
        { status: 500 }
      )
    }
    
    // Get updated booking with seats
    const updatedBooking = await db
      .prepare(`
        SELECT 
          b.*,
          GROUP_CONCAT(bs.seat_number) as seat_numbers
        FROM bookings b
        LEFT JOIN booked_seats bs ON b.id = bs.booking_id
        WHERE b.id = ?
        GROUP BY b.id
      `)
      .bind(bookingId)
      .first()
    
    return NextResponse.json({
      success: true,
      message: 'Check-in reverted successfully',
      booking: {
        ...updatedBooking,
        seats: updatedBooking?.seat_numbers ? 
          String(updatedBooking.seat_numbers).split(',').map(Number) : []
      }
    })
  } catch (error) {
    console.error('Error reverting check-in:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to revert check-in',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

