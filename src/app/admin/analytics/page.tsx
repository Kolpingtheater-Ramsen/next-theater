'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { AnalyticsResponse } from '@/app/api/admin/analytics/route'

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#eab308']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/admin/analytics', {
        credentials: 'include',
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      const result = (await response.json()) as AnalyticsResponse

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || 'Fehler beim Laden der Analysen')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Fehler beim Laden der Analysen')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/admin')
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / 10)
    const seatInRow = seatNumber % 10
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto'>
        <LoadingSpinner text='Lade Analysen...' size='lg' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto'>
        <div className='glass rounded-xl p-6'>
          <p className='text-red-400'>{error}</p>
          <button
            onClick={fetchAnalytics}
            className='mt-4 px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const ROWS = 7
  const SEATS_PER_SIDE = 5
  const TOTAL_SEATS_PER_ROW = SEATS_PER_SIDE * 2

  const seatHeatmapMap = new Map(data.seatHeatmap.map((s) => [s.seat_number, s.booking_count]))
  const maxBookings = Math.max(...data.seatHeatmap.map((s) => s.booking_count), 1)

  const getHeatmapColor = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
    const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
    if (row === 0 && (seatInRow === 0 || seatInRow === TOTAL_SEATS_PER_ROW - 1)) {
      return 'bg-site-800 border-site-700'
    }

    const count = seatHeatmapMap.get(seatNumber) || 0
    const intensity = count / maxBookings

    if (intensity === 0) return 'bg-site-700 border-site-600'
    if (intensity < 0.25) return 'bg-green-900/50 border-green-700'
    if (intensity < 0.5) return 'bg-yellow-900/50 border-yellow-600'
    if (intensity < 0.75) return 'bg-orange-900/50 border-orange-600'
    return 'bg-red-900/50 border-red-600'
  }

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>Analysen</h1>
          <p className='text-site-100'>Buchungsstatistiken und Trends</p>
        </div>
        <div className='flex gap-3'>
          <a
            href='/admin/dashboard'
            className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors'
          >
            ← Dashboard
          </a>
          <button
            onClick={handleLogout}
            className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors'
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8'>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Buchungen</p>
          <p className='text-2xl font-bold'>{data.summary.totalBookings}</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Plätze</p>
          <p className='text-2xl font-bold'>{data.summary.totalSeats}</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Ø Gruppengröße</p>
          <p className='text-2xl font-bold'>{data.summary.avgGroupSize}</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Stornierungen</p>
          <p className='text-2xl font-bold text-red-400'>{data.summary.totalCancellations}</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Stornierungsrate</p>
          <p className='text-2xl font-bold text-red-400'>{data.summary.cancellationRate}%</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Eingecheckt</p>
          <p className='text-2xl font-bold text-green-400'>{data.summary.checkedInCount}</p>
        </div>
        <div className='glass rounded-xl p-4'>
          <p className='text-xs text-site-100 mb-1'>Check-In-Rate</p>
          <p className='text-2xl font-bold text-green-400'>{data.summary.checkInRate}%</p>
        </div>
      </div>

      {/* Bookings Over Time */}
      <div className='glass rounded-xl p-6 mb-8'>
        <h2 className='text-xl font-display font-bold mb-6'>Buchungen & Stornierungen über Zeit</h2>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data.dailyStats}>
              <defs>
                <linearGradient id='colorBookings' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#f97316' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#f97316' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='colorSeats' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#22c55e' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
              <XAxis
                dataKey='date'
                stroke='#9ca3af'
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis stroke='#9ca3af' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('de-DE')}
              />
              <Legend />
              <Area
                type='monotone'
                dataKey='bookings'
                name='Buchungen'
                stroke='#f97316'
                fillOpacity={1}
                fill='url(#colorBookings)'
              />
              <Area
                type='monotone'
                dataKey='seats'
                name='Plätze'
                stroke='#22c55e'
                fillOpacity={1}
                fill='url(#colorSeats)'
              />
              <Area type='monotone' dataKey='cancellations' name='Stornierungen' stroke='#ef4444' fill='#ef4444' fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-8 mb-8'>
        {/* Hourly Distribution */}
        <div className='glass rounded-xl p-6'>
          <h2 className='text-xl font-display font-bold mb-6'>Buchungen nach Uhrzeit</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.hourlyDistribution}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis dataKey='hour' stroke='#9ca3af' fontSize={11} tickFormatter={(v) => `${v}:00`} />
                <YAxis stroke='#9ca3af' fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(v) => `${v}:00 - ${v}:59 Uhr`}
                />
                <Bar dataKey='bookings' name='Buchungen' fill='#f97316' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week Distribution */}
        <div className='glass rounded-xl p-6'>
          <h2 className='text-xl font-display font-bold mb-6'>Buchungen nach Wochentag</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.dayOfWeekDistribution}>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis dataKey='dayName' stroke='#9ca3af' fontSize={11} />
                <YAxis stroke='#9ca3af' fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey='bookings' name='Buchungen' fill='#3b82f6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Booking Velocity per Show */}
      {data.bookingVelocity.length > 0 && (
        <div className='glass rounded-xl p-6 mb-8'>
          <h2 className='text-xl font-display font-bold mb-6'>Buchungsgeschwindigkeit pro Vorstellung</h2>
          <p className='text-sm text-site-100 mb-4'>Kumulative Sitzplätze, gebucht nach Tagen vor der Vorstellung</p>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart>
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis
                  dataKey='daysBeforeShow'
                  type='number'
                  stroke='#9ca3af'
                  fontSize={12}
                  reversed
                  label={{ value: 'Tage vor Vorstellung', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis stroke='#9ca3af' fontSize={12} label={{ value: 'Plätze', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(v) => `${v} Tage vorher`}
                />
                <Legend />
                {data.bookingVelocity.map((play, index) => (
                  <Line
                    key={play.play_id}
                    data={play.data}
                    type='monotone'
                    dataKey='cumulativeSeats'
                    name={play.display_date}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Per-Show Statistics */}
      <div className='glass rounded-xl p-6 mb-8'>
        <h2 className='text-xl font-display font-bold mb-6'>Statistik pro Vorstellung</h2>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-site-700'>
                <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Vorstellung</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Kapazität</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Gebucht</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Auslastung</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Ø Gruppe</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Eingecheckt</th>
                <th className='text-right py-3 px-2 text-sm font-semibold text-site-100'>Storniert</th>
              </tr>
            </thead>
            <tbody>
              {data.playStats.map((play) => {
                const occupancy = ((play.booked_seats / play.total_seats) * 100).toFixed(1)
                return (
                  <tr key={play.play_id} className='border-b border-site-800 hover:bg-site-800/30'>
                    <td className='py-3 px-2 text-sm font-medium'>{play.display_date}</td>
                    <td className='py-3 px-2 text-sm text-right text-site-100'>{play.total_seats}</td>
                    <td className='py-3 px-2 text-sm text-right'>{play.booked_seats}</td>
                    <td className='py-3 px-2 text-sm text-right'>
                      <span
                        className={`${
                          Number(occupancy) >= 90
                            ? 'text-red-400'
                            : Number(occupancy) >= 70
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {occupancy}%
                      </span>
                    </td>
                    <td className='py-3 px-2 text-sm text-right text-site-100'>
                      {play.avg_group_size ? play.avg_group_size.toFixed(1) : '-'}
                    </td>
                    <td className='py-3 px-2 text-sm text-right text-green-400'>{play.checked_in_bookings}</td>
                    <td className='py-3 px-2 text-sm text-right text-red-400'>{play.cancelled_bookings}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-8 mb-8'>
        {/* Status Distribution Pie */}
        <div className='glass rounded-xl p-6'>
          <h2 className='text-xl font-display font-bold mb-6'>Buchungsstatus-Verteilung</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Bestätigt',
                      value: data.playStats.reduce((sum, p) => sum + p.confirmed_bookings, 0),
                    },
                    {
                      name: 'Eingecheckt',
                      value: data.playStats.reduce((sum, p) => sum + p.checked_in_bookings, 0),
                    },
                    { name: 'Storniert', value: data.summary.totalCancellations },
                  ]}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  <Cell fill='#3b82f6' />
                  <Cell fill='#22c55e' />
                  <Cell fill='#ef4444' />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy by Show */}
        <div className='glass rounded-xl p-6'>
          <h2 className='text-xl font-display font-bold mb-6'>Auslastung pro Vorstellung</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data.playStats.map((p) => ({
                  name: p.display_date.split(' ')[0] + ' ' + p.display_date.split(' ')[1]?.replace(',', ''),
                  occupancy: ((p.booked_seats / p.total_seats) * 100).toFixed(1),
                  available: (((p.total_seats - p.booked_seats) / p.total_seats) * 100).toFixed(1),
                }))}
                layout='vertical'
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                <XAxis type='number' domain={[0, 100]} stroke='#9ca3af' fontSize={12} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey='name' type='category' stroke='#9ca3af' fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey='occupancy' name='Belegt' stackId='a' fill='#f97316' />
                <Bar dataKey='available' name='Frei' stackId='a' fill='#374151' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seat Heatmap */}
      <div className='glass rounded-xl p-6 mb-8'>
        <h2 className='text-xl font-display font-bold mb-4'>Sitzplatz-Beliebtheit</h2>
        <p className='text-sm text-site-100 mb-6'>Zeigt, welche Plätze am häufigsten gebucht werden (alle Vorstellungen)</p>

        {/* Stage */}
        <div className='bg-gradient-to-b from-kolping-500/20 to-transparent p-4 rounded-lg mb-8 text-center max-w-2xl mx-auto'>
          <p className='text-sm font-semibold'>BÜHNE / STAGE</p>
        </div>

        {/* Seat Grid */}
        <div className='mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-site-700 scrollbar-track-site-900'>
          <div className='min-w-[420px] max-w-2xl mx-auto'>
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <div key={rowIndex} className='flex items-center justify-center gap-2 mb-3'>
                <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                  {String.fromCharCode(65 + rowIndex)}
                </div>

                {/* Left side seats */}
                <div className='flex gap-1.5'>
                  {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                    const seatNumber = rowIndex * TOTAL_SEATS_PER_ROW + seatIndex
                    const isBlocked =
                      rowIndex === 0 && (seatIndex === 0 || seatIndex === TOTAL_SEATS_PER_ROW - 1)
                    const count = seatHeatmapMap.get(seatNumber) || 0

                    return (
                      <div
                        key={seatNumber}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium flex items-center justify-center
                          border-2 ${getHeatmapColor(seatNumber)}
                          ${isBlocked ? 'cursor-not-allowed' : 'cursor-default'}
                          relative group
                        `}
                        title={`${getSeatLabel(seatNumber)}: ${count} Buchungen`}
                      >
                        {seatIndex + 1}
                        <div className='absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-site-900 px-2 py-1 rounded text-xs whitespace-nowrap z-10 border border-site-700 shadow-lg'>
                          {getSeatLabel(seatNumber)}: {count}x gebucht
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className='w-6 md:w-8' />

                {/* Right side seats */}
                <div className='flex gap-1.5'>
                  {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                    const seatNumber = rowIndex * TOTAL_SEATS_PER_ROW + SEATS_PER_SIDE + seatIndex
                    const count = seatHeatmapMap.get(seatNumber) || 0

                    return (
                      <div
                        key={seatNumber}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium flex items-center justify-center
                          border-2 ${getHeatmapColor(seatNumber)}
                          cursor-default relative group
                        `}
                        title={`${getSeatLabel(seatNumber)}: ${count} Buchungen`}
                      >
                        {seatIndex + 6}
                        <div className='absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-site-900 px-2 py-1 rounded text-xs whitespace-nowrap z-10 border border-site-700 shadow-lg'>
                          {getSeatLabel(seatNumber)}: {count}x gebucht
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                  {String.fromCharCode(65 + rowIndex)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='flex flex-wrap justify-center gap-4 pt-4 border-t border-site-700'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-site-700 border-2 border-site-600' />
            <span className='text-sm text-site-100'>Nie gebucht</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-green-900/50 border-2 border-green-700' />
            <span className='text-sm text-site-100'>Selten</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-yellow-900/50 border-2 border-yellow-600' />
            <span className='text-sm text-site-100'>Mittel</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-orange-900/50 border-2 border-orange-600' />
            <span className='text-sm text-site-100'>Oft</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-md bg-red-900/50 border-2 border-red-600' />
            <span className='text-sm text-site-100'>Sehr beliebt</span>
          </div>
        </div>
      </div>
    </div>
  )
}
