import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookingById, cancelBooking } from '@/lib/db'

/**
 * GET /api/bookings/[id]
 * Returns booking details including play and seat information
 */
export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    
    // Get D1 database from Cloudflare context
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }
    
    // Fetch booking
    const booking = await getBookingById(db, bookingId)
    
    if (!booking) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Booking not found'
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      booking
    })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bookings/[id]
 * Cancels a booking (requires email verification)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    
    // Get D1 database from Cloudflare context
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }
    
    // Parse request body for email verification
    let body: { email?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required for cancellation' },
        { status: 400 }
      )
    }
    
    // Cancel booking
    const result = await cancelBooking(db, bookingId, email)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Failed to cancel booking'
        },
        { status: result.error?.includes('not found') ? 404 : 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Error canceling booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to cancel booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

