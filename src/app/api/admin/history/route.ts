import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import type { BookingWithSeats } from '@/types/database'

export const runtime = 'edge'

/**
 * GET /api/admin/history
 * Returns check-in history sorted by checked_in_at timestamp
 */
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { env } = getRequestContext()
    const db = env.DB

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const playId = url.searchParams.get('playId')
    const limit = parseInt(url.searchParams.get('limit') || '100', 10)

    // Build query to get checked-in bookings sorted by check-in time
    let query = `
      SELECT 
        b.id,
        b.play_id,
        b.name,
        b.email,
        b.status,
        b.created_at,
        b.cancelled_at,
        b.checked_in_at,
        GROUP_CONCAT(bs.seat_number) as seat_numbers,
        p.id as play_id,
        p.title as play_title,
        p.display_date as play_display_date,
        p.total_seats as play_total_seats
      FROM bookings b
      LEFT JOIN booked_seats bs ON b.id = bs.booking_id
      LEFT JOIN plays p ON b.play_id = p.id
      WHERE b.status = 'checked_in' AND b.checked_in_at IS NOT NULL
    `

    const params: string[] = []

    if (playId) {
      query += ` AND b.play_id = ?`
      params.push(playId)
    }

    query += `
      GROUP BY b.id
      ORDER BY b.checked_in_at DESC
      LIMIT ?
    `
    params.push(String(limit))

    const result = await db.prepare(query).bind(...params).all()

    const bookings: BookingWithSeats[] = result.results?.map((row) => ({
      id: String(row.id),
      play_id: String(row.play_id),
      name: String(row.name),
      email: String(row.email),
      status: String(row.status) as 'confirmed' | 'cancelled' | 'checked_in',
      created_at: String(row.created_at),
      cancelled_at: row.cancelled_at ? String(row.cancelled_at) : null,
      checked_in_at: row.checked_in_at ? String(row.checked_in_at) : null,
      seats: row.seat_numbers ? String(row.seat_numbers).split(',').map(Number) : [],
      play: {
        id: String(row.play_id),
        title: String(row.play_title),
        display_date: String(row.play_display_date),
        date: '',
        time: '',
        total_seats: Number(row.play_total_seats) || 68,
        created_at: ''
      }
    })) || []

    return NextResponse.json({
      success: true,
      bookings,
      total: bookings.length
    })
  } catch (error) {
    console.error('Error fetching check-in history:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
