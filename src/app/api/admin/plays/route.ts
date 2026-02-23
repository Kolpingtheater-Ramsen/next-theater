import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'

export const runtime = 'edge'

interface PlayRow {
  id: string
  title: string
  date: string
  time: string
  display_date: string
  total_seats: number
  created_at: string
  booking_count: number
}

/**
 * GET /api/admin/plays — List all plays with booking counts
 */
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { env } = getRequestContext()
    const db = env.DB
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 })
    }

    const result = await db.prepare(`
      SELECT
        p.*,
        COUNT(DISTINCT b.id) as booking_count
      FROM plays p
      LEFT JOIN bookings b ON p.id = b.play_id AND b.status != 'cancelled'
      GROUP BY p.id
      ORDER BY p.date ASC, p.time ASC
    `).all()

    const plays: PlayRow[] = (result.results || []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      date: String(row.date),
      time: String(row.time),
      display_date: String(row.display_date),
      total_seats: Number(row.total_seats) || 68,
      created_at: String(row.created_at),
      booking_count: Number(row.booking_count) || 0,
    }))

    return NextResponse.json({ success: true, plays })
  } catch (error) {
    console.error('Error fetching admin plays:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plays', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/plays — Create a new play
 */
export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { env } = getRequestContext()
    const db = env.DB
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 })
    }

    const body = await request.json() as {
      title: string
      date: string
      time: string
      display_date: string
      total_seats: number
    }

    if (!body.title || !body.date || !body.time || !body.display_date) {
      return NextResponse.json({ success: false, error: 'Alle Felder sind erforderlich' }, { status: 400 })
    }

    const id = `play-${crypto.randomUUID()}`
    const totalSeats = body.total_seats || 68

    await db.prepare(`
      INSERT INTO plays (id, title, date, time, display_date, total_seats, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, body.title, body.date, body.time, body.display_date, totalSeats).run()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating play:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create play', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/plays — Update existing play (only if no bookings exist)
 */
export async function PUT(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { env } = getRequestContext()
    const db = env.DB
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 })
    }

    const body = await request.json() as {
      id: string
      title: string
      date: string
      time: string
      display_date: string
      total_seats: number
    }

    if (!body.id || !body.title || !body.date || !body.time || !body.display_date) {
      return NextResponse.json({ success: false, error: 'Alle Felder sind erforderlich' }, { status: 400 })
    }

    // Check for existing bookings
    const bookingCheck = await db.prepare(
      `SELECT COUNT(*) as count FROM bookings WHERE play_id = ? AND status != 'cancelled'`
    ).bind(body.id).first<{ count: number }>()

    if (bookingCheck && bookingCheck.count > 0) {
      return NextResponse.json(
        { success: false, error: `Bearbeitung nicht möglich: ${bookingCheck.count} aktive Buchung(en) vorhanden` },
        { status: 409 }
      )
    }

    await db.prepare(`
      UPDATE plays SET title = ?, date = ?, time = ?, display_date = ?, total_seats = ?
      WHERE id = ?
    `).bind(body.title, body.date, body.time, body.display_date, body.total_seats || 68, body.id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating play:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update play', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/plays — Delete a play (only if no bookings exist)
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { env } = getRequestContext()
    const db = env.DB
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 })
    }

    const body = await request.json() as { id: string }

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Play-ID erforderlich' }, { status: 400 })
    }

    // Check for existing bookings
    const bookingCheck = await db.prepare(
      `SELECT COUNT(*) as count FROM bookings WHERE play_id = ? AND status != 'cancelled'`
    ).bind(body.id).first<{ count: number }>()

    if (bookingCheck && bookingCheck.count > 0) {
      return NextResponse.json(
        { success: false, error: `Löschen nicht möglich: ${bookingCheck.count} aktive Buchung(en) vorhanden` },
        { status: 409 }
      )
    }

    await db.prepare(`DELETE FROM plays WHERE id = ?`).bind(body.id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting play:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete play', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
