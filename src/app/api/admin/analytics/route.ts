import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'

export const runtime = 'edge'

interface DailyStats {
  date: string
  bookings: number
  seats: number
  cancellations: number
  cancelledSeats: number
}

interface PlayStats {
  play_id: string
  display_date: string
  total_seats: number
  booked_seats: number
  cancelled_bookings: number
  checked_in_bookings: number
  confirmed_bookings: number
  avg_group_size: number
}

interface HourlyDistribution {
  hour: number
  bookings: number
}

interface DayOfWeekDistribution {
  day: number
  dayName: string
  bookings: number
}

interface BookingVelocity {
  play_id: string
  display_date: string
  data: { daysBeforeShow: number; cumulativeSeats: number }[]
}

interface SeatHeatmap {
  seat_number: number
  booking_count: number
}

export interface AnalyticsResponse {
  success: boolean
  data?: {
    summary: {
      totalBookings: number
      totalSeats: number
      totalCancellations: number
      cancellationRate: number
      avgGroupSize: number
      checkedInCount: number
      checkInRate: number
    }
    dailyStats: DailyStats[]
    playStats: PlayStats[]
    hourlyDistribution: HourlyDistribution[]
    dayOfWeekDistribution: DayOfWeekDistribution[]
    bookingVelocity: BookingVelocity[]
    seatHeatmap: SeatHeatmap[]
  }
  error?: string
}

/**
 * GET /api/admin/analytics
 * Returns comprehensive analytics data for the booking system
 */
export async function GET(request: NextRequest): Promise<NextResponse<AnalyticsResponse>> {
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

    // 1. Summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancellations,
        SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as checked_in_count
      FROM bookings
    `
    const summaryResult = await db.prepare(summaryQuery).first<{
      total_bookings: number
      total_cancellations: number
      checked_in_count: number
    }>()

    const seatsQuery = `
      SELECT COUNT(*) as total_seats FROM booked_seats
    `
    const seatsResult = await db.prepare(seatsQuery).first<{ total_seats: number }>()

    const avgGroupQuery = `
      SELECT AVG(seat_count) as avg_group_size 
      FROM (
        SELECT booking_id, COUNT(*) as seat_count 
        FROM booked_seats 
        GROUP BY booking_id
      )
    `
    const avgGroupResult = await db.prepare(avgGroupQuery).first<{ avg_group_size: number }>()

    // 2. Daily booking/cancellation stats
    const dailyStatsQuery = `
      SELECT 
        date(created_at) as date,
        SUM(CASE WHEN status != 'cancelled' THEN 1 ELSE 0 END) as bookings,
        0 as seats,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancellations
      FROM bookings
      GROUP BY date(created_at)
      ORDER BY date ASC
    `
    const dailyStatsResult = await db.prepare(dailyStatsQuery).all<{
      date: string
      bookings: number
      seats: number
      cancellations: number
    }>()

    // Get seats per day separately
    const dailySeatsQuery = `
      SELECT 
        date(b.created_at) as date,
        COUNT(bs.seat_number) as seats
      FROM bookings b
      JOIN booked_seats bs ON b.id = bs.booking_id
      WHERE b.status != 'cancelled'
      GROUP BY date(b.created_at)
    `
    const dailySeatsResult = await db.prepare(dailySeatsQuery).all<{
      date: string
      seats: number
    }>()

    const seatsMap = new Map(dailySeatsResult.results?.map(r => [r.date, r.seats]) || [])
    const dailyStats: DailyStats[] = (dailyStatsResult.results || []).map(row => ({
      ...row,
      seats: seatsMap.get(row.date) || 0,
      cancelledSeats: 0
    }))

    // 3. Per-play statistics
    const playStatsQuery = `
      SELECT 
        p.id as play_id,
        p.display_date,
        p.total_seats,
        COUNT(DISTINCT CASE WHEN b.status != 'cancelled' THEN bs.seat_number END) as booked_seats,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN b.status = 'checked_in' THEN 1 ELSE 0 END) as checked_in_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings
      FROM plays p
      LEFT JOIN bookings b ON p.id = b.play_id
      LEFT JOIN booked_seats bs ON b.id = bs.booking_id AND b.status != 'cancelled'
      GROUP BY p.id
      ORDER BY p.date ASC, p.time ASC
    `
    const playStatsResult = await db.prepare(playStatsQuery).all<{
      play_id: string
      display_date: string
      total_seats: number
      booked_seats: number
      cancelled_bookings: number
      checked_in_bookings: number
      confirmed_bookings: number
    }>()

    // Calculate avg group size per play
    const playGroupSizeQuery = `
      SELECT 
        b.play_id,
        AVG(seat_count) as avg_group_size
      FROM (
        SELECT b.play_id, b.id, COUNT(bs.seat_number) as seat_count
        FROM bookings b
        JOIN booked_seats bs ON b.id = bs.booking_id
        WHERE b.status != 'cancelled'
        GROUP BY b.id
      ) b
      GROUP BY b.play_id
    `
    const playGroupSizeResult = await db.prepare(playGroupSizeQuery).all<{
      play_id: string
      avg_group_size: number
    }>()
    const groupSizeMap = new Map(playGroupSizeResult.results?.map(r => [r.play_id, r.avg_group_size]) || [])

    const playStats: PlayStats[] = (playStatsResult.results || []).map(row => ({
      ...row,
      avg_group_size: groupSizeMap.get(row.play_id) || 0
    }))

    // 4. Hourly distribution (when do people book?)
    const hourlyQuery = `
      SELECT 
        CAST(strftime('%H', created_at) AS INTEGER) as hour,
        COUNT(*) as bookings
      FROM bookings
      WHERE status != 'cancelled'
      GROUP BY hour
      ORDER BY hour ASC
    `
    const hourlyResult = await db.prepare(hourlyQuery).all<HourlyDistribution>()

    // Fill in missing hours
    const hourlyMap = new Map((hourlyResult.results || []).map(r => [r.hour, r.bookings]))
    const hourlyDistribution: HourlyDistribution[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      bookings: hourlyMap.get(i) || 0
    }))

    // 5. Day of week distribution
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
    const dayOfWeekQuery = `
      SELECT 
        CAST(strftime('%w', created_at) AS INTEGER) as day,
        COUNT(*) as bookings
      FROM bookings
      WHERE status != 'cancelled'
      GROUP BY day
      ORDER BY day ASC
    `
    const dayOfWeekResult = await db.prepare(dayOfWeekQuery).all<{ day: number; bookings: number }>()

    const dayMap = new Map((dayOfWeekResult.results || []).map(r => [r.day, r.bookings]))
    const dayOfWeekDistribution: DayOfWeekDistribution[] = Array.from({ length: 7 }, (_, i) => ({
      day: i,
      dayName: dayNames[i],
      bookings: dayMap.get(i) || 0
    }))

    // 6. Booking velocity per show (cumulative bookings over time)
    const velocityQuery = `
      SELECT 
        b.play_id,
        p.display_date,
        p.date as show_date,
        date(b.created_at) as booking_date,
        COUNT(bs.seat_number) as seats
      FROM bookings b
      JOIN plays p ON b.play_id = p.id
      JOIN booked_seats bs ON b.id = bs.booking_id
      WHERE b.status != 'cancelled'
      GROUP BY b.play_id, date(b.created_at)
      ORDER BY b.play_id, booking_date ASC
    `
    const velocityResult = await db.prepare(velocityQuery).all<{
      play_id: string
      display_date: string
      show_date: string
      booking_date: string
      seats: number
    }>()

    // Group by play and calculate cumulative
    const velocityMap = new Map<string, { display_date: string; data: Map<number, number> }>()
    for (const row of velocityResult.results || []) {
      if (!velocityMap.has(row.play_id)) {
        velocityMap.set(row.play_id, { display_date: row.display_date, data: new Map() })
      }
      const showDate = new Date(row.show_date)
      const bookingDate = new Date(row.booking_date)
      const daysBeforeShow = Math.ceil((showDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const playData = velocityMap.get(row.play_id)!
      const currentSeats = playData.data.get(daysBeforeShow) || 0
      playData.data.set(daysBeforeShow, currentSeats + row.seats)
    }

    const bookingVelocity: BookingVelocity[] = Array.from(velocityMap.entries()).map(([play_id, { display_date, data }]) => {
      // Sort by days before show (descending) and calculate cumulative
      const sortedDays = Array.from(data.entries()).sort((a, b) => b[0] - a[0])
      let cumulative = 0
      const cumulativeData = sortedDays.map(([daysBeforeShow, seats]) => {
        cumulative += seats
        return { daysBeforeShow, cumulativeSeats: cumulative }
      }).reverse()
      
      return { play_id, display_date, data: cumulativeData }
    })

    // 7. Seat popularity heatmap
    const seatHeatmapQuery = `
      SELECT 
        seat_number,
        COUNT(*) as booking_count
      FROM booked_seats bs
      JOIN bookings b ON bs.booking_id = b.id
      WHERE b.status != 'cancelled'
      GROUP BY seat_number
      ORDER BY seat_number ASC
    `
    const seatHeatmapResult = await db.prepare(seatHeatmapQuery).all<SeatHeatmap>()

    // Calculate derived metrics
    const totalBookings = summaryResult?.total_bookings || 0
    const totalCancellations = summaryResult?.total_cancellations || 0
    const checkedInCount = summaryResult?.checked_in_count || 0
    const activeBookings = totalBookings - totalCancellations
    const cancellationRate = totalBookings > 0 ? (totalCancellations / totalBookings) * 100 : 0
    const checkInRate = activeBookings > 0 ? (checkedInCount / activeBookings) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalBookings: activeBookings,
          totalSeats: seatsResult?.total_seats || 0,
          totalCancellations,
          cancellationRate: Math.round(cancellationRate * 10) / 10,
          avgGroupSize: Math.round((avgGroupResult?.avg_group_size || 0) * 10) / 10,
          checkedInCount,
          checkInRate: Math.round(checkInRate * 10) / 10
        },
        dailyStats,
        playStats,
        hourlyDistribution,
        dayOfWeekDistribution,
        bookingVelocity,
        seatHeatmap: seatHeatmapResult.results || []
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
      },
      { status: 500 }
    )
  }
}
