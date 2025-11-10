import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import type { BookingWithSeats } from '@/types/database'

/**
 * GET /api/admin/bookings?playId=xxx
 * Returns all bookings for a specific play (admin only)
 */
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!requireAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const playId = searchParams.get('playId')
    
    // Get D1 database
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }
    
    let query: string
    let params: string[]
    
    if (playId) {
      // Get bookings for specific play
      query = `
        SELECT 
          b.*,
          GROUP_CONCAT(bs.seat_number) as seat_numbers,
          p.title as play_title,
          p.display_date as play_display_date
        FROM bookings b
        LEFT JOIN booked_seats bs ON b.id = bs.booking_id
        LEFT JOIN plays p ON b.play_id = p.id
        WHERE b.play_id = ? AND b.status != 'cancelled'
        GROUP BY b.id
        ORDER BY b.created_at DESC
      `
      params = [playId]
    } else {
      // Get all bookings
      query = `
        SELECT 
          b.*,
          GROUP_CONCAT(bs.seat_number) as seat_numbers,
          p.title as play_title,
          p.display_date as play_display_date
        FROM bookings b
        LEFT JOIN booked_seats bs ON b.id = bs.booking_id
        LEFT JOIN plays p ON b.play_id = p.id
        WHERE b.status != 'cancelled'
        GROUP BY b.id
        ORDER BY b.created_at DESC
      `
      params = []
    }
    
    const result = await db.prepare(query).bind(...params).all()
    
    // Transform results
    const bookings: BookingWithSeats[] = result.results?.map((row) => ({
      id: String(row.id),
      play_id: String(row.play_id),
      name: String(row.name),
      email: String(row.email),
      status: String(row.status) as 'confirmed' | 'cancelled' | 'checked_in',
      created_at: String(row.created_at),
      seats: row.seat_numbers ? String(row.seat_numbers).split(',').map(Number) : [],
      play: {
        id: String(row.play_id),
        title: String(row.play_title),
        display_date: String(row.play_display_date),
        date: '',
        time: '',
        total_seats: 68,
        created_at: ''
      }
    })) || []
    
    return NextResponse.json({
      success: true,
      bookings,
      total: bookings.length
    })
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

