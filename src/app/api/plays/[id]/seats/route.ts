import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookedSeatsForPlay, getPlayById } from '@/lib/db'

/**
 * GET /api/plays/[id]/seats
 * Returns booked seat numbers for a specific play
 */
export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playId } = await params
    
    // Get D1 database from Cloudflare context
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }
    
    // Verify play exists
    const play = await getPlayById(db, playId)
    if (!play) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Play not found'
        },
        { status: 404 }
      )
    }
    
    // Fetch booked seats
    const bookedSeats = await getBookedSeatsForPlay(db, playId)
    
    return NextResponse.json({
      success: true,
      playId,
      bookedSeats,
      totalSeats: play.total_seats,
      availableSeats: play.total_seats - bookedSeats.length
    })
  } catch (error) {
    console.error('Error fetching booked seats:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch booked seats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

