import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookingById, cancelBooking, getBookedSeatsForPlay, updateBookingSeats, getPlayById } from '@/lib/db'
import { sendCancellationConfirmation, sendBookingModification } from '@/lib/email'
import { sendDiscordSeatUpdate } from '@/lib/discord'

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
    
    // Get booking details before canceling (for email)
    const booking = await getBookingById(db, bookingId)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Verify email matches
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Email does not match booking' },
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
    
    // Send cancellation confirmation email (await to catch errors)
    let emailStatus = 'not_configured'
    let emailError = null
    if (env.RESEND_API_KEY && booking.play) {
      emailStatus = 'sending'
      // Get the full URL for the banner image
      const baseUrl = new URL(request.url).origin
      try {
        const emailResult = await sendCancellationConfirmation(
          {
            name: booking.name,
            email: booking.email,
          },
          booking.play,
          booking.seats,
          {
            apiKey: env.RESEND_API_KEY,
            fromEmail: env.FROM_EMAIL || 'ticket-noreply@kolpingtheater-ramsen.de',
            theaterName: env.THEATER_NAME || 'Kolpingtheater Ramsen',
            replyToEmail: env.REPLY_TO_EMAIL || env.FROM_EMAIL || 'kolpingjugendramsen@gmail.com',
          },
          baseUrl
        )
        
        if (emailResult.success) {
          emailStatus = 'sent'
        } else {
          emailStatus = 'failed'
          emailError = emailResult.error || 'Unknown error'
        }
      } catch (error) {
        emailStatus = 'failed'
        emailError = error instanceof Error ? error.message : String(error)
        console.error('Failed to send cancellation email:', error)
      }
    } else {
      console.warn('RESEND_API_KEY not configured or booking has no play - skipping cancellation email')
    }

      if (env.DISCORD_WEBHOOK_URL && booking.play) {
        const remainingBookedSeats = await getBookedSeatsForPlay(db, booking.play_id)
        const availableSeatsAfterCancellation = booking.play.total_seats - remainingBookedSeats.length
        const showLabel = booking.play.display_date || `${booking.play.date} ${booking.play.time}`
        await sendDiscordSeatUpdate({
          webhookUrl: env.DISCORD_WEBHOOK_URL,
          showLabel,
          seatCount: booking.seats.length,
          availableSeatCount: availableSeatsAfterCancellation,
          action: 'cancelled',
        })
      }
    
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      debug_email_status: emailStatus, // Remove this after debugging
      debug_email_error: emailError // Remove this after debugging
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

/**
 * PATCH /api/bookings/[id]
 * Updates seats for an existing booking
 */
export async function PATCH(
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
    
    // Parse request body
    let body: { seats?: number[] }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    const { seats } = body
    
    // Validation: seats array required
    if (!seats || !Array.isArray(seats)) {
      return NextResponse.json(
        { success: false, error: 'Seats array is required' },
        { status: 400 }
      )
    }
    
    // Validation: at least 1 seat, max 5
    if (seats.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mindestens ein Sitzplatz muss ausgewählt sein' },
        { status: 400 }
      )
    }
    
    if (seats.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximal 5 Sitzplätze pro Buchung' },
        { status: 400 }
      )
    }
    
    // Check for duplicate seats in request
    if (new Set(seats).size !== seats.length) {
      return NextResponse.json(
        { success: false, error: 'Doppelte Plätze in der Auswahl' },
        { status: 400 }
      )
    }
    
    // Get existing booking
    const booking = await getBookingById(db, bookingId)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Buchung nicht gefunden' },
        { status: 404 }
      )
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Diese Buchung wurde bereits storniert' },
        { status: 400 }
      )
    }
    
    // Get play details
    const play = await getPlayById(db, booking.play_id)
    if (!play) {
      return NextResponse.json(
        { success: false, error: 'Vorstellung nicht gefunden' },
        { status: 404 }
      )
    }
    
    // Validate seat numbers (0-based indexing, seats 0 and 9 are blocked)
    const BLOCKED_SEATS = [0, 9] // A1 and A10 don't exist
    const maxSeatIndex = play.total_seats + BLOCKED_SEATS.length
    const invalidSeats = seats.filter(s => !Number.isInteger(s) || s < 0 || s >= maxSeatIndex || BLOCKED_SEATS.includes(s))
    if (invalidSeats.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Ungültige Sitzplatznummern' },
        { status: 400 }
      )
    }
    
    // Get all booked seats for this play
    const allBookedSeats = await getBookedSeatsForPlay(db, booking.play_id)
    
    // Filter out current booking's seats to check for conflicts with OTHER bookings
    const otherBookedSeats = allBookedSeats.filter(s => !booking.seats.includes(s))
    
    // Check if any new seats are already booked by others
    const conflictingSeats = seats.filter(s => otherBookedSeats.includes(s))
    if (conflictingSeats.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Einige ausgewählte Plätze sind bereits gebucht',
          conflictingSeats 
        },
        { status: 409 }
      )
    }
    
    // Check if seats actually changed
    const oldSeats = [...booking.seats].sort((a, b) => a - b)
    const newSeats = [...seats].sort((a, b) => a - b)
    const seatsChanged = oldSeats.length !== newSeats.length || 
                         oldSeats.some((s, i) => s !== newSeats[i])
    
    if (!seatsChanged) {
      return NextResponse.json({
        success: true,
        message: 'Keine Änderungen vorgenommen',
        booking: { ...booking, seats }
      })
    }
    
    // Update seats
    const result = await updateBookingSeats(db, bookingId, booking.play_id, seats)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Fehler beim Aktualisieren der Sitzplätze'
        },
        { status: 500 }
      )
    }
    
    // Send modification email
    let emailStatus = 'not_configured'
    let emailError = null
    if (env.RESEND_API_KEY) {
      emailStatus = 'sending'
      const baseUrl = new URL(request.url).origin
      
      try {
        const emailResult = await sendBookingModification(
          {
            name: booking.name,
            email: booking.email,
            id: bookingId,
          },
          play,
          seats,
          booking.seats,
          {
            apiKey: env.RESEND_API_KEY,
            fromEmail: env.FROM_EMAIL || 'ticket-noreply@kolpingtheater-ramsen.de',
            theaterName: env.THEATER_NAME || 'Kolpingtheater Ramsen',
            replyToEmail: env.REPLY_TO_EMAIL || env.FROM_EMAIL || 'kolpingjugendramsen@gmail.com',
          },
          baseUrl
        )
        
        if (emailResult.success) {
          emailStatus = 'sent'
        } else {
          emailStatus = 'failed'
          emailError = emailResult.error || 'Unknown error'
        }
      } catch (error) {
        emailStatus = 'failed'
        emailError = error instanceof Error ? error.message : String(error)
        console.error('Failed to send modification email:', error)
      }
    }
    
    // Send Discord notification
    if (env.DISCORD_WEBHOOK_URL) {
      const seatDiff = seats.length - booking.seats.length
      const remainingBookedSeats = await getBookedSeatsForPlay(db, booking.play_id)
      const availableSeatsAfter = play.total_seats - remainingBookedSeats.length
      const showLabel = play.display_date || `${play.date} ${play.time}`
      
      await sendDiscordSeatUpdate({
        webhookUrl: env.DISCORD_WEBHOOK_URL,
        showLabel,
        seatCount: Math.abs(seatDiff),
        availableSeatCount: availableSeatsAfter,
        action: seatDiff > 0 ? 'booked' : seatDiff < 0 ? 'cancelled' : 'booked',
      })
    }
    
    // Return updated booking
    const updatedBooking = await getBookingById(db, bookingId)
    
    return NextResponse.json({
      success: true,
      message: 'Buchung erfolgreich aktualisiert',
      booking: updatedBooking,
      debug_email_status: emailStatus,
      debug_email_error: emailError
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Fehler beim Aktualisieren der Buchung',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

