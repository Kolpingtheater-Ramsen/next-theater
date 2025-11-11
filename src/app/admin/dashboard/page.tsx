"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { BookingWithSeats, PlayWithAvailability } from '@/types/database'

export default function AdminDashboardPage() {
  const [plays, setPlays] = useState<PlayWithAvailability[]>([])
  const [bookings, setBookings] = useState<BookingWithSeats[]>([])
  const [selectedPlayId, setSelectedPlayId] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSeatMap, setShowSeatMap] = useState(false)
  const router = useRouter()

  const ROWS = 7
  const SEATS_PER_SIDE = 5
  const TOTAL_SEATS_PER_ROW = SEATS_PER_SIDE * 2
  const TOTAL_SEATS = 68

  useEffect(() => {
    fetchPlays()
  }, [])

  const fetchPlays = async () => {
    try {
      const response = await fetch('/api/plays', {
        credentials: 'include'
      })
      const data = await response.json() as { success: boolean; plays?: PlayWithAvailability[] }
      
      if (data.success && data.plays) {
        setPlays(data.plays)
      } else {
        setError('Fehler beim Laden der Vorstellungen')
      }
    } catch (err) {
      console.error('Error fetching plays:', err)
      setError('Fehler beim Laden der Vorstellungen')
    }
  }

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = selectedPlayId === 'all' 
        ? '/api/admin/bookings'
        : `/api/admin/bookings?playId=${selectedPlayId}`
      
      const response = await fetch(url, {
        credentials: 'include'
      })
      
      if (response.status === 401) {
        router.push('/admin')
        return
      }
      
      const data = await response.json() as { success: boolean; bookings?: BookingWithSeats[]; error?: string }
      
      if (data.success && data.bookings) {
        setBookings(data.bookings)
      } else {
        setError(data.error || 'Fehler beim Laden der Buchungen')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Fehler beim Laden der Buchungen')
    } finally {
      setIsLoading(false)
    }
  }, [selectedPlayId, router])

  useEffect(() => {
    if (plays.length > 0) {
      fetchBookings()
    }
  }, [selectedPlayId, plays.length, fetchBookings])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { 
      method: 'POST',
      credentials: 'include'
    })
    router.push('/admin')
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / 10)
    const seatInRow = seatNumber % 10
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  const getSeatStatus = (seatNumber: number): 'open' | 'pending' | 'checked_in' | 'blocked' => {
    // Block first and last seat in row A (row 0)
    const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
    const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
    
    if (row === 0 && (seatInRow === 0 || seatInRow === TOTAL_SEATS_PER_ROW - 1)) {
      return 'blocked'
    }

    // Find if seat is booked
    const booking = bookings.find(b => b.seats.includes(seatNumber))
    if (!booking) return 'open'
    
    return booking.status === 'checked_in' ? 'checked_in' : 'pending'
  }

  const getSeatsByStatus = () => {
    const open = []
    const pending = []
    const checkedIn = []
    const blocked = []

    for (let i = 0; i < TOTAL_SEATS; i++) {
      const status = getSeatStatus(i)
      if (status === 'open') open.push(i)
      else if (status === 'pending') pending.push(i)
      else if (status === 'checked_in') checkedIn.push(i)
      else if (status === 'blocked') blocked.push(i)
    }

    return { open: open.length, pending: pending.length, checkedIn: checkedIn.length, blocked: blocked.length }
  }

  const getTotalSeats = () => {
    return bookings.reduce((sum, b) => sum + b.seats.length, 0)
  }

  const handleToggleCheckIn = async (bookingId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'confirmed') {
        // Check in
        const response = await fetch('/api/admin/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ bookingId }),
        })

        const data = await response.json() as { success: boolean; error?: string }
        
        if (data.success) {
          // Update local state
          setBookings(bookings.map(b => 
            b.id === bookingId ? { ...b, status: 'checked_in' } : b
          ))
        } else {
          alert(data.error || 'Fehler beim Einchecken')
        }
      } else if (currentStatus === 'checked_in') {
        // Check out (revert to confirmed)
        const response = await fetch(`/api/admin/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ bookingId }),
        })

        const data = await response.json() as { success: boolean; error?: string }
        
        if (data.success) {
          // Update local state
          setBookings(bookings.map(b => 
            b.id === bookingId ? { ...b, status: 'confirmed' } : b
          ))
        } else {
          alert(data.error || 'Fehler beim Auschecken')
        }
      }
    } catch (err) {
      console.error('Error toggling check-in:', err)
      alert('Fehler beim Aktualisieren des Status')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-blue-900/30 text-blue-400 border-blue-700',
      checked_in: 'bg-green-900/30 text-green-400 border-green-700',
      cancelled: 'bg-red-900/30 text-red-400 border-red-700'
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status === 'confirmed' ? 'Bestätigt' : status === 'checked_in' ? 'Eingecheckt' : 'Storniert'}
      </span>
    )
  }

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
            Admin-Dashboard
          </h1>
          <p className='text-site-100'>
            Buchungen verwalten und Statistiken anzeigen
          </p>
        </div>
        <div className='flex gap-3'>
          <a
            href='/admin/scan'
            className='px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' />
            </svg>
            Tickets Scannen
          </a>
          <button
            onClick={handleLogout}
            className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors'
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='glass rounded-xl p-6'>
          <p className='text-sm text-site-100 mb-1'>Buchungen Gesamt</p>
          <p className='text-3xl font-bold'>{bookings.length}</p>
        </div>
        <div className='glass rounded-xl p-6'>
          <p className='text-sm text-site-100 mb-1'>Gebuchte Plätze</p>
          <p className='text-3xl font-bold'>{getTotalSeats()}</p>
        </div>
        <div className='glass rounded-xl p-6'>
          <p className='text-sm text-site-100 mb-1'>Eingecheckt</p>
          <p className='text-3xl font-bold text-green-400'>
            {bookings.filter(b => b.status === 'checked_in').length}
          </p>
        </div>
        <div className='glass rounded-xl p-6'>
          <p className='text-sm text-site-100 mb-1'>Noch nicht eingecheckt</p>
          <p className='text-3xl font-bold text-blue-400'>
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
      </div>

      {/* Seat Map Stats */}
      {selectedPlayId !== 'all' && (
        <div className='glass rounded-xl p-6 mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-display font-bold'>Sitzplatz-Übersicht</h2>
            <button
              onClick={() => setShowSeatMap(!showSeatMap)}
              className='px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors text-sm'
            >
              {showSeatMap ? 'Sitzplan verbergen' : 'Sitzplan anzeigen'}
            </button>
          </div>

          {(() => {
            const stats = getSeatsByStatus()
            return (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <div className='text-center p-4 rounded-lg bg-green-900/20 border border-green-700'>
                  <p className='text-2xl font-bold text-green-400'>{stats.open}</p>
                  <p className='text-sm text-site-100'>Freie Plätze</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-blue-900/20 border border-blue-700'>
                  <p className='text-2xl font-bold text-blue-400'>{stats.pending}</p>
                  <p className='text-sm text-site-100'>Gebucht</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-purple-900/20 border border-purple-700'>
                  <p className='text-2xl font-bold text-purple-400'>{stats.checkedIn}</p>
                  <p className='text-sm text-site-100'>Eingecheckt</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-gray-900/20 border border-gray-700'>
                  <p className='text-2xl font-bold text-gray-400'>{stats.blocked}</p>
                  <p className='text-sm text-site-100'>Blockiert</p>
                </div>
              </div>
            )
          })()}

          {/* Seat Map Visualization */}
          {showSeatMap && (
            <div className='mt-6'>
              {/* Stage */}
              <div className='bg-gradient-to-b from-kolping-500/20 to-transparent p-4 rounded-lg mb-8 text-center'>
                <p className='text-sm font-semibold'>🎭 BÜHNE / STAGE</p>
              </div>

              {/* Seating area - matches booking page layout */}
              <div className='mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-site-700 scrollbar-track-site-900'>
                <div className='min-w-[420px] max-w-2xl mx-auto'>
                  {Array.from({ length: ROWS }).map((_, rowIndex) => (
                    <div key={rowIndex} className='flex items-center justify-center gap-2 mb-3'>
                      {/* Row label */}
                      <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                        {String.fromCharCode(65 + rowIndex)}
                      </div>

                      {/* Left side seats */}
                      <div className='flex gap-1.5'>
                        {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                          const seatNumber = rowIndex * TOTAL_SEATS_PER_ROW + seatIndex
                          const status = getSeatStatus(seatNumber)
                          const label = getSeatLabel(seatNumber)
                          
                          return (
                            <div
                              key={seatNumber}
                              className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium flex items-center justify-center
                                transition-all relative group cursor-default
                                ${status === 'open' ? 'bg-green-600/90 hover:bg-green-600 text-white border-2 border-green-500' : ''}
                                ${status === 'pending' ? 'bg-blue-600/90 hover:bg-blue-600 text-white border-2 border-blue-500' : ''}
                                ${status === 'checked_in' ? 'bg-purple-600/90 hover:bg-purple-600 text-white border-2 border-purple-500' : ''}
                                ${status === 'blocked' ? 'bg-site-800 text-site-500 border-2 border-site-700 cursor-not-allowed' : ''}
                              `}
                              title={`${label} - ${status.replace('_', ' ').toUpperCase()}`}
                            >
                              {seatIndex + 1}
                              <div className='absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-site-900 px-2 py-1 rounded text-xs whitespace-nowrap z-10 border border-site-700 shadow-lg'>
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Middle pathway */}
                      <div className='w-6 md:w-8' />

                      {/* Right side seats */}
                      <div className='flex gap-1.5'>
                        {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                          const seatNumber = rowIndex * TOTAL_SEATS_PER_ROW + SEATS_PER_SIDE + seatIndex
                          const status = getSeatStatus(seatNumber)
                          const label = getSeatLabel(seatNumber)
                          
                          return (
                            <div
                              key={seatNumber}
                              className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium flex items-center justify-center
                                transition-all relative group cursor-default
                                ${status === 'open' ? 'bg-green-600/90 hover:bg-green-600 text-white border-2 border-green-500' : ''}
                                ${status === 'pending' ? 'bg-blue-600/90 hover:bg-blue-600 text-white border-2 border-blue-500' : ''}
                                ${status === 'checked_in' ? 'bg-purple-600/90 hover:bg-purple-600 text-white border-2 border-purple-500' : ''}
                                ${status === 'blocked' ? 'bg-site-800 text-site-500 border-2 border-site-700 cursor-not-allowed' : ''}
                              `}
                              title={`${label} - ${status.replace('_', ' ').toUpperCase()}`}
                            >
                              {seatIndex + 6}
                              <div className='absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-site-900 px-2 py-1 rounded text-xs whitespace-nowrap z-10 border border-site-700 shadow-lg'>
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Row label (right side) */}
                      <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                        {String.fromCharCode(65 + rowIndex)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className='flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-site-700'>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-md bg-green-600 border-2 border-green-500' />
                  <span className='text-sm text-site-100'>Verfügbar</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-md bg-blue-600 border-2 border-blue-500' />
                  <span className='text-sm text-site-100'>Gebucht</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-md bg-purple-600 border-2 border-purple-500' />
                  <span className='text-sm text-site-100'>Eingecheckt</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-md bg-site-800 border-2 border-site-700' />
                  <span className='text-sm text-site-100'>Blockiert</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      <div className='glass rounded-xl p-4 mb-6'>
        <label htmlFor='play-filter' className='block text-sm font-medium mb-2'>
          Nach Vorstellung filtern
        </label>
        <select
          id='play-filter'
          value={selectedPlayId}
          onChange={(e) => setSelectedPlayId(e.target.value)}
          className='w-full md:w-auto px-4 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 focus:outline-none focus:ring-2 focus:ring-kolping-400'
        >
          <option value='all'>Alle Vorstellungen</option>
          {plays.map((play) => (
            <option key={play.id} value={play.id}>
              {play.display_date} ({play.available_seats} Plätze verfügbar)
            </option>
          ))}
        </select>
      </div>

      {/* Bookings List */}
      <div className='glass rounded-xl p-6'>
        <h2 className='text-xl font-display font-bold mb-4'>
          Buchungen {selectedPlayId !== 'all' && `für ${plays.find(p => p.id === selectedPlayId)?.display_date}`}
        </h2>

        {error && (
          <div className='p-4 mb-4 rounded-lg bg-red-900/20 border border-red-700'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner text='Lade Buchungen...' size='lg' />
        ) : bookings.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-site-100'>Keine Buchungen gefunden</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-site-700'>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Name</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>E-Mail</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Vorstellung</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Plätze</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Status</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Buchungsdatum</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Ein-/Auschecken</th>
                  <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className='border-b border-site-800 hover:bg-site-800/30'>
                    <td className='py-3 px-2 text-sm'>{booking.name}</td>
                    <td className='py-3 px-2 text-sm text-site-100'>{booking.email}</td>
                    <td className='py-3 px-2 text-sm text-site-100'>
                      {booking.play?.display_date || 'N/A'}
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      <div className='flex flex-wrap gap-1'>
                        {booking.seats.sort((a, b) => a - b).map((seat) => (
                          <span key={seat} className='px-2 py-0.5 bg-site-700 rounded text-xs'>
                            {getSeatLabel(seat)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className='py-3 px-2 text-sm text-site-100'>
                      {new Date(booking.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      <button
                        onClick={() => handleToggleCheckIn(booking.id, booking.status)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          booking.status === 'confirmed'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Einchecken' : 'Check-In rückgängig'}
                      </button>
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      <a
                        href={`/booking/view/${booking.id}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-kolping-400 hover:text-kolping-300 text-xs underline'
                      >
                        Anzeigen
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

