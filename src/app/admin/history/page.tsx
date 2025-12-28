'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { BookingWithSeats, PlayWithAvailability } from '@/types/database'

interface CheckInHistoryEntry extends BookingWithSeats {
  checked_in_at: string | null
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CheckInHistoryEntry[]>([])
  const [plays, setPlays] = useState<PlayWithAvailability[]>([])
  const [selectedPlayId, setSelectedPlayId] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchPlays = async () => {
    try {
      const response = await fetch('/api/plays', { credentials: 'include' })
      const data = (await response.json()) as { success: boolean; plays?: PlayWithAvailability[] }
      if (data.success && data.plays) {
        setPlays(data.plays)
      }
    } catch (err) {
      console.error('Error fetching plays:', err)
    }
  }

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      params.append('status', 'checked_in')
      params.append('sortBy', 'checked_in_at')
      if (selectedPlayId !== 'all') {
        params.append('playId', selectedPlayId)
      }

      const response = await fetch(`/api/admin/history?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      const data = (await response.json()) as { success: boolean; bookings?: CheckInHistoryEntry[]; error?: string }

      if (data.success && data.bookings) {
        setHistory(data.bookings)
      } else {
        setError(data.error || 'Fehler beim Laden der Historie')
      }
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Fehler beim Laden der Historie')
    } finally {
      setIsLoading(false)
    }
  }, [router, selectedPlayId])

  useEffect(() => {
    fetchPlays()
  }, [])

  useEffect(() => {
    fetchHistory()
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchHistory, 10000)
    return () => clearInterval(interval)
  }, [fetchHistory])

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

  const formatTime = (dateString: string | null): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeSince = (dateString: string | null): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 1) return 'gerade eben'
    if (diffMins < 60) return `vor ${diffMins} Min.`
    if (diffHours < 24) return `vor ${diffHours} Std.`
    return formatDateTime(dateString)
  }

  // Group by time periods
  const groupedHistory = history.reduce(
    (acc, entry) => {
      if (!entry.checked_in_at) return acc

      const date = new Date(entry.checked_in_at)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 5) {
        acc.justNow.push(entry)
      } else if (diffMins < 30) {
        acc.recent.push(entry)
      } else if (diffMins < 60) {
        acc.lastHour.push(entry)
      } else {
        acc.earlier.push(entry)
      }
      return acc
    },
    { justNow: [] as CheckInHistoryEntry[], recent: [] as CheckInHistoryEntry[], lastHour: [] as CheckInHistoryEntry[], earlier: [] as CheckInHistoryEntry[] }
  )

  const renderHistorySection = (title: string, entries: CheckInHistoryEntry[], highlight?: boolean) => {
    if (entries.length === 0) return null

    return (
      <div className='mb-8'>
        <h3 className={`text-lg font-semibold mb-4 ${highlight ? 'text-green-400' : 'text-site-100'}`}>
          {title} ({entries.length})
        </h3>
        <div className='space-y-3'>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`glass rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 ${
                highlight ? 'border border-green-500/30 bg-green-900/10' : ''
              }`}
            >
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-3 mb-1'>
                  <span className='text-lg font-semibold truncate'>{entry.name}</span>
                  <span className='px-2 py-0.5 rounded text-xs font-semibold bg-green-900/30 text-green-400 border border-green-700'>
                    Eingecheckt
                  </span>
                </div>
                <div className='text-sm text-site-100 truncate'>{entry.email}</div>
              </div>

              <div className='flex flex-wrap gap-1'>
                {entry.seats.sort((a, b) => a - b).map((seat) => (
                  <span key={seat} className='px-2 py-0.5 bg-site-700 rounded text-xs font-medium'>
                    {getSeatLabel(seat)}
                  </span>
                ))}
              </div>

              <div className='text-right md:min-w-[140px]'>
                <div className='text-sm font-medium'>{formatTime(entry.checked_in_at)}</div>
                <div className='text-xs text-site-100'>{getTimeSince(entry.checked_in_at)}</div>
              </div>

              <div className='text-right md:min-w-[180px]'>
                <div className='text-xs text-site-100'>{entry.play?.display_date || '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto'>
      {/* Header */}
      <div className='mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>Check-In Historie</h1>
          <p className='text-site-100'>Zuletzt eingecheckte Gäste (aktualisiert automatisch)</p>
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

      {/* Filter */}
      <div className='glass rounded-xl p-4 mb-6'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div className='w-full sm:w-auto sm:min-w-[300px]'>
            <label htmlFor='play-filter' className='block text-sm font-medium mb-2'>
              Nach Vorstellung filtern
            </label>
            <select
              id='play-filter'
              value={selectedPlayId}
              onChange={(e) => setSelectedPlayId(e.target.value)}
              className='w-full px-4 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 focus:outline-none focus:ring-2 focus:ring-kolping-400'
            >
              <option value='all'>Alle Vorstellungen</option>
              {plays.map((play) => (
                <option key={play.id} value={play.id}>
                  {play.display_date}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-4'>
            <div className='text-sm text-site-100'>
              <span className='font-semibold text-site-50'>{history.length}</span> Check-Ins
            </div>
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className='px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2'
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Aktualisieren
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='glass rounded-xl p-4 mb-6 border border-red-700 bg-red-900/20'>
          <p className='text-red-400'>{error}</p>
        </div>
      )}

      {/* Content */}
      {isLoading && history.length === 0 ? (
        <LoadingSpinner text='Lade Historie...' size='lg' />
      ) : history.length === 0 ? (
        <div className='glass rounded-xl p-12 text-center'>
          <svg className='w-16 h-16 mx-auto mb-4 text-site-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
            />
          </svg>
          <p className='text-site-100 text-lg'>Noch keine Check-Ins vorhanden</p>
          <p className='text-site-200 text-sm mt-2'>Eingecheckte Gäste erscheinen hier in Echtzeit</p>
        </div>
      ) : (
        <>
          {renderHistorySection('Gerade eben', groupedHistory.justNow, true)}
          {renderHistorySection('Letzte 30 Minuten', groupedHistory.recent)}
          {renderHistorySection('Letzte Stunde', groupedHistory.lastHour)}
          {renderHistorySection('Früher', groupedHistory.earlier)}
        </>
      )}
    </div>
  )
}
