import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import {
  getPlayById,
  getBookedSeatsForPlay,
  hasExistingBooking,
  createBooking
} from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'
import { sendDiscordSeatUpdate } from '@/lib/discord'

/**
 * POST /api/bookings
 * Creates a new booking with validation and double-booking prevention
 */
export const runtime = 'edge'

interface CreateBookingRequest {
  playId: string
  name: string
  email: string
  seats: number[]
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function generateBookingId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export async function POST(request: NextRequest) {
  try {
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
    let body: CreateBookingRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
      const { playId, name, email, seats } = body
    
    // Validation: Required fields
    if (!playId || !name || !email || !seats) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validation: Name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    // Validation: Email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    // Validation: Seats
    if (!Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one seat must be selected' },
        { status: 400 }
      )
    }
    
    if (seats.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 seats per booking' },
        { status: 400 }
      )
    }
    
    // Validate seat numbers are valid
    const invalidSeats = seats.filter(s => !Number.isInteger(s) || s < 1 || s > 68)
    if (invalidSeats.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid seat numbers' },
        { status: 400 }
      )
    }
    
    // Check for duplicate seats in request
    if (new Set(seats).size !== seats.length) {
      return NextResponse.json(
        { success: false, error: 'Duplicate seats in selection' },
        { status: 400 }
      )
    }
    
    // Verify play exists
    const play = await getPlayById(db, playId)
    if (!play) {
      return NextResponse.json(
        { success: false, error: 'Play not found' },
        { status: 404 }
      )
    }
    
    // Check if user already has a booking for this play
      const normalizedEmail = email.trim().toLowerCase()
      const alreadyBooked = await hasExistingBooking(db, playId, normalizedEmail)
    if (alreadyBooked) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You already have a booking for this show' 
        },
        { status: 409 }
      )
    }
    
      // Check if seats are already booked
      const bookedSeats = await getBookedSeatsForPlay(db, playId)
      const conflictingSeats = seats.filter(s => bookedSeats.includes(s))
      
      if (conflictingSeats.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Some selected seats are already booked',
            conflictingSeats 
          },
          { status: 409 }
        )
      }
      // Check if enough seats available
      const availableSeatsBefore = play.total_seats - bookedSeats.length
      if (seats.length > availableSeatsBefore) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Not enough seats available',
            availableSeats: availableSeatsBefore
          },
          { status: 409 }
        )
      }
    
    // Create booking
      const bookingId = generateBookingId()
      const result = await createBooking(db, {
        id: bookingId,
        playId,
        name: name.trim(),
        email: normalizedEmail,
        seats
      })
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to create booking'
        },
        { status: 500 }
      )
    }
    
    // Send confirmation email (await to catch errors during development)
    let emailStatus = 'not_configured'
    let emailError = null
    if (env.RESEND_API_KEY) {
      emailStatus = 'sending'
      // Get the full URL for the booking link
      const baseUrl = new URL(request.url).origin
      
      try {
        // Await email send to catch errors
        const emailResult = await sendBookingConfirmation(
            {
            name: name.trim(),
            email: normalizedEmail,
            id: bookingId,
            },
          play,
          seats,
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
        console.error('Failed to send confirmation email:', error)
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email')
    }

      // Notify Discord webhook if configured
      const availableSeatsAfterBooking = Math.max(availableSeatsBefore - seats.length, 0)
      const showLabel = play.display_date || `${play.date} ${play.time}`
      await sendDiscordSeatUpdate({
        webhookUrl: env.DISCORD_WEBHOOK_URL,
        showLabel,
        seatCount: seats.length,
        availableSeatCount: availableSeatsAfterBooking,
        action: 'booked',
      })
    
    // Return success with booking ID
    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: 'Booking created successfully',
        debug_email_status: emailStatus, // Remove this after debugging
        debug_email_error: emailError // Remove this after debugging
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

