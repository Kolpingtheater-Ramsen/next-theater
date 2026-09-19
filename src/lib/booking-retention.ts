import type { D1Database } from '@/types/env'
import type { Play } from '@/types/database'
import { DEFAULT_TIMEZONE, performanceStart } from './tickets'

export const BOOKING_RETENTION_DAYS = 14

// Use the actual performance's timezone, not the worker's UTC calendar date.
export function bookingDeletionTime(play: Play) {
  const duration = Math.max(0, play.duration_minutes || 0) * 60_000
  return performanceStart(play).getTime() + duration + BOOKING_RETENTION_DAYS * 86_400_000
}

export async function purgeExpiredBookings(db: D1Database, now = Date.now()) {
  const summary = {
    deletedBookings: 0, deletedSeats: 0,
    affectedPlays: [] as { id: string; title: string; date: string; displayDate: string }[],
  }
  // The broad date bound includes every timezone; the precise check is below.
  const candidates = await db.prepare(`SELECT p.* FROM plays p
    WHERE p.date <= ? AND EXISTS (SELECT 1 FROM bookings b WHERE b.play_id = p.id)`)
    .bind(new Date(now - (BOOKING_RETENTION_DAYS - 1) * 86_400_000).toISOString().slice(0, 10)).all<Play>()

  for (const play of candidates.results || []) {
    if (!(bookingDeletionTime(play) <= now)) continue
    // Recheck the schedule inside the transaction, in case an administrator
    // postponed the performance after the candidate query.
    const eligible = `play_id IN (SELECT id FROM plays WHERE id = ? AND date = ? AND time = ?
      AND COALESCE(timezone, ?) = ? AND COALESCE(duration_minutes, 0) = ?)`
    const values = [play.id, play.date, play.time, DEFAULT_TIMEZONE, play.timezone || DEFAULT_TIMEZONE, play.duration_minutes || 0]
    const [seats, bookings] = await db.batch([
      db.prepare(`SELECT COUNT(*) AS count FROM booked_seats WHERE ${eligible}`).bind(...values),
      // Foreign keys atomically remove booked_seats and wallet_sync_jobs too.
      // Only counts leave this helper, never names, emails or access tokens.
      db.prepare(`DELETE FROM bookings WHERE ${eligible} RETURNING 1 AS deleted`).bind(...values),
    ])
    const count = bookings.results?.length || 0
    summary.deletedBookings += count
    summary.deletedSeats += (seats.results?.[0] as { count: number } | undefined)?.count || 0
    if (count) summary.affectedPlays.push({ id: play.id, title: play.title, date: play.date, displayDate: play.display_date })
  }

  await db.batch([
    db.prepare('DELETE FROM ticket_rate_limits WHERE resets_at <= ?').bind(Math.floor(now / 1000)),
    db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(now),
  ])
  return summary
}
