import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import type { BookingWithSeats } from '@/types/database'

const TOTAL_SEATS_PER_ROW = 10
const CSV_HEADERS = [
  'Buchung ID',
  'Name',
  'E-Mail',
  'Vorstellungstitel',
  'Vorstellungsdatum',
  'Status',
  'Plätze',
  'Angelegt am'
]

const getSeatLabel = (seatNumber: number): string => {
  const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
  const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
  return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
}

const formatSeatsForCsv = (seats: number[]) => {
  if (!seats || seats.length === 0) return ''
  return seats
    .slice()
    .sort((a, b) => a - b)
    .map(getSeatLabel)
    .join(' ')
}

const normalizeForFilename = (value: string) => {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'alle'
}

const escapeCsvValue = (value: string) => {
  const needsEscaping = /[",\n]/.test(value)
  const sanitized = value.replace(/"/g, '""')
  return needsEscaping ? `"${sanitized}"` : sanitized
}

const createCsvResponse = (bookings: BookingWithSeats[], filenameSuffix: string) => {
  const rows = bookings.map((booking) => [
    booking.id,
    booking.name,
    booking.email,
    booking.play?.title || '',
    booking.play?.display_date || '',
    booking.status,
    formatSeatsForCsv(booking.seats),
    new Date(booking.created_at).toISOString()
  ])
  
  const csv = [CSV_HEADERS, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(String(value ?? ''))).join(','))
    .join('\n')

  const dateStamp = new Date().toISOString().split('T')[0]
  const filename = `buchungen-${normalizeForFilename(filenameSuffix || 'alle')}-${dateStamp}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}

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
    const formatParam = searchParams.get('format')
    const rawSearchQuery = searchParams.get('query')
    const normalizedSearchQuery = rawSearchQuery ? rawSearchQuery.trim().toLowerCase() : ''
    const hasSearchQuery = normalizedSearchQuery.length > 0
    const searchCondition = hasSearchQuery
      ? ' AND (LOWER(b.name) LIKE ? OR LOWER(b.email) LIKE ?)'
      : ''
    const searchPattern = `%${normalizedSearchQuery}%`
    const wantsCsv = formatParam?.toLowerCase() === 'csv'
    
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
          p.display_date as play_display_date,
          p.total_seats as play_total_seats
        FROM bookings b
        LEFT JOIN booked_seats bs ON b.id = bs.booking_id
        LEFT JOIN plays p ON b.play_id = p.id
        WHERE b.play_id = ? AND b.status != 'cancelled'${searchCondition}
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
          p.display_date as play_display_date,
          p.total_seats as play_total_seats
        FROM bookings b
        LEFT JOIN booked_seats bs ON b.id = bs.booking_id
        LEFT JOIN plays p ON b.play_id = p.id
        WHERE b.status != 'cancelled'${searchCondition}
        GROUP BY b.id
        ORDER BY b.created_at DESC
      `
      params = []
    }

    if (hasSearchQuery) {
      params.push(searchPattern, searchPattern)
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
        total_seats: Number(row.play_total_seats) || 68,
        created_at: ''
      }
    })) || []
    
    if (wantsCsv) {
      const suffix = playId
        ? bookings[0]?.play?.display_date || playId
        : 'alle'
      return createCsvResponse(bookings, suffix)
    }

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

