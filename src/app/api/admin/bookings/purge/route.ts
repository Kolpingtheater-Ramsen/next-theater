import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'

/**
 * DELETE /api/admin/bookings/purge
 * Deletes all bookings (and their seats via CASCADE) for plays older than 2 weeks.
 * No emails are sent. This is a GDPR/data-privacy cleanup action.
 */
export const runtime = 'edge'

export async function DELETE(request: NextRequest) {
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

    // Calculate cutoff date (14 days ago)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 14)
    const cutoffStr = cutoff.toISOString().split('T')[0] // YYYY-MM-DD

    // Find plays older than 2 weeks
    const oldPlays = await db
      .prepare('SELECT id, title, date, display_date FROM plays WHERE date < ?')
      .bind(cutoffStr)
      .all()

    if (!oldPlays.results || oldPlays.results.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Keine Vorstellungen älter als 2 Wochen gefunden.',
        deletedBookings: 0,
        deletedSeats: 0,
        affectedPlays: []
      })
    }

    const playIds = oldPlays.results.map((p) => String(p.id))

    // Count what we're about to delete
    const placeholders = playIds.map(() => '?').join(',')

    const bookingCount = await db
      .prepare(`SELECT COUNT(*) as cnt FROM bookings WHERE play_id IN (${placeholders})`)
      .bind(...playIds)
      .first<{ cnt: number }>()

    const seatCount = await db
      .prepare(`SELECT COUNT(*) as cnt FROM booked_seats WHERE play_id IN (${placeholders})`)
      .bind(...playIds)
      .first<{ cnt: number }>()

    // Delete booked_seats first, then bookings (CASCADE should handle it, but being explicit)
    await db
      .prepare(`DELETE FROM booked_seats WHERE play_id IN (${placeholders})`)
      .bind(...playIds)
      .run()

    await db
      .prepare(`DELETE FROM bookings WHERE play_id IN (${placeholders})`)
      .bind(...playIds)
      .run()

    return NextResponse.json({
      success: true,
      message: `${bookingCount?.cnt || 0} Buchungen und ${seatCount?.cnt || 0} Sitzplätze gelöscht.`,
      deletedBookings: bookingCount?.cnt || 0,
      deletedSeats: seatCount?.cnt || 0,
      affectedPlays: oldPlays.results.map((p) => ({
        id: p.id,
        title: p.title,
        date: p.date,
        displayDate: p.display_date
      }))
    })
  } catch (error) {
    console.error('Error purging old bookings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Löschen alter Buchungen',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
