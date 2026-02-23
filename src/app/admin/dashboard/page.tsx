"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import MessageModal from '@/components/MessageModal'
import type { BookingWithSeats, PlayWithAvailability, Play } from '@/types/database'

interface AdminPlay extends Play {
  booking_count: number
}

function formatDisplayDate(date: string, time: string): string {
  const d = new Date(date + 'T' + time)
  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const day = weekdays[d.getDay()]
  const dd = d.getDate().toString().padStart(2, '0')
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${day}, ${dd}.${mm}.${yyyy} - ${time} Uhr`
}

export default function AdminDashboardPage() {
  const [plays, setPlays] = useState<PlayWithAvailability[]>([])
  const [bookings, setBookings] = useState<BookingWithSeats[]>([])
  const [selectedPlayId, setSelectedPlayId] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSeatMap, setShowSeatMap] = useState(false)
  const [messageModal, setMessageModal] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showOnlyNotCheckedIn, setShowOnlyNotCheckedIn] = useState(false)
  const [showEmails, setShowEmails] = useState(false)
  const [purgeConfirm, setPurgeConfirm] = useState(false)
  const [isPurging, setIsPurging] = useState(false)
  // Play management state
  const [adminPlays, setAdminPlays] = useState<AdminPlay[]>([])
  const [playsExpanded, setPlaysExpanded] = useState(false)
  const [showPlayForm, setShowPlayForm] = useState(false)
  const [editingPlayId, setEditingPlayId] = useState<string | null>(null)
  const [playForm, setPlayForm] = useState({ title: '', date: '', time: '', total_seats: 68 })
  const [playFormLoading, setPlayFormLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const router = useRouter()

  const ROWS = 7
  const SEATS_PER_SIDE = 5
  const TOTAL_SEATS_PER_ROW = SEATS_PER_SIDE * 2
  const BLOCKED_SEATS = [0, 9] // A1 and A10 don't exist
  const TOTAL_SEATS = 68 + BLOCKED_SEATS.length // 68 bookable + 2 blocked = 70 physical seats

  useEffect(() => {
    fetchPlays()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

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

  const fetchAdminPlays = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/plays', { credentials: 'include' })
      if (response.status === 401) { router.push('/admin'); return }
      const data = await response.json() as { success: boolean; plays?: AdminPlay[] }
      if (data.success && data.plays) {
        setAdminPlays(data.plays)
      }
    } catch (err) {
      console.error('Error fetching admin plays:', err)
    }
  }, [router])

  useEffect(() => {
    fetchAdminPlays()
  }, [fetchAdminPlays])

  const handleCreatePlay = async () => {
    if (!playForm.title || !playForm.date || !playForm.time) return
    setPlayFormLoading(true)
    try {
      const display_date = formatDisplayDate(playForm.date, playForm.time)
      const response = await fetch('/api/admin/plays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...playForm, display_date }),
      })
      const data = await response.json() as { success: boolean; error?: string }
      if (data.success) {
        setPlayForm({ title: '', date: '', time: '', total_seats: 68 })
        setShowPlayForm(false)
        fetchAdminPlays()
        fetchPlays()
        setMessageModal({ message: 'Vorstellung erfolgreich erstellt', type: 'success' })
      } else {
        setMessageModal({ message: data.error || 'Fehler beim Erstellen', type: 'error' })
      }
    } catch {
      setMessageModal({ message: 'Fehler beim Erstellen der Vorstellung', type: 'error' })
    } finally {
      setPlayFormLoading(false)
    }
  }

  const handleUpdatePlay = async (id: string) => {
    if (!playForm.title || !playForm.date || !playForm.time) return
    setPlayFormLoading(true)
    try {
      const display_date = formatDisplayDate(playForm.date, playForm.time)
      const response = await fetch('/api/admin/plays', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...playForm, display_date }),
      })
      const data = await response.json() as { success: boolean; error?: string }
      if (data.success) {
        setEditingPlayId(null)
        setPlayForm({ title: '', date: '', time: '', total_seats: 68 })
        fetchAdminPlays()
        fetchPlays()
        setMessageModal({ message: 'Vorstellung aktualisiert', type: 'success' })
      } else {
        setMessageModal({ message: data.error || 'Fehler beim Aktualisieren', type: 'error' })
      }
    } catch {
      setMessageModal({ message: 'Fehler beim Aktualisieren der Vorstellung', type: 'error' })
    } finally {
      setPlayFormLoading(false)
    }
  }

  const handleDeletePlay = async (id: string) => {
    try {
      const response = await fetch('/api/admin/plays', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })
      const data = await response.json() as { success: boolean; error?: string }
      if (data.success) {
        setDeleteConfirmId(null)
        fetchAdminPlays()
        fetchPlays()
        setMessageModal({ message: 'Vorstellung gelöscht', type: 'success' })
      } else {
        setMessageModal({ message: data.error || 'Fehler beim Löschen', type: 'error' })
      }
    } catch {
      setMessageModal({ message: 'Fehler beim Löschen der Vorstellung', type: 'error' })
    }
  }

  const startEditPlay = (play: AdminPlay) => {
    setEditingPlayId(play.id)
    setPlayForm({ title: play.title, date: play.date, time: play.time, total_seats: play.total_seats })
    setShowPlayForm(false)
  }

  const cancelEditPlay = () => {
    setEditingPlayId(null)
    setPlayForm({ title: '', date: '', time: '', total_seats: 68 })
  }

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (selectedPlayId !== 'all') {
        params.append('playId', selectedPlayId)
      }
      if (debouncedSearchTerm) {
        params.append('query', debouncedSearchTerm)
      }
      const queryString = params.toString()
      const url = queryString ? `/api/admin/bookings?${queryString}` : '/api/admin/bookings'
      
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
  }, [selectedPlayId, router, debouncedSearchTerm])

  const handleExportCsv = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (selectedPlayId !== 'all') {
        params.append('playId', selectedPlayId)
      }
      if (debouncedSearchTerm) {
        params.append('query', debouncedSearchTerm)
      }
      params.append('format', 'csv')
      const url = `/api/admin/bookings?${params.toString()}`

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const dateSuffix = new Date().toISOString().split('T')[0]
      const playDisplayDate = selectedPlayId === 'all'
        ? 'alle'
        : (plays.find((play) => play.id === selectedPlayId)?.display_date || 'vorstellung')
      const safePlayLabel = playDisplayDate
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'vorstellung'

      link.href = downloadUrl
      link.download = `buchungen-${safePlayLabel}-${dateSuffix}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Error exporting bookings:', err)
      setMessageModal({ message: 'Export fehlgeschlagen. Bitte erneut versuchen.', type: 'error' })
    }
  }, [selectedPlayId, debouncedSearchTerm, router, plays])

  const handlePurgeOldBookings = useCallback(async () => {
    try {
      setIsPurging(true)
      const response = await fetch('/api/admin/bookings/purge', {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      const data = await response.json() as {
        success: boolean
        message?: string
        deletedBookings?: number
        error?: string
      }

      if (data.success) {
        setMessageModal({
          message: data.message || 'Alte Buchungen gelöscht.',
          type: data.deletedBookings ? 'success' : 'info'
        })
        // Refresh bookings
        fetchBookings()
      } else {
        setMessageModal({
          message: data.error || 'Fehler beim Löschen',
          type: 'error'
        })
      }
    } catch (err) {
      console.error('Error purging bookings:', err)
      setMessageModal({
        message: 'Fehler beim Löschen alter Buchungen.',
        type: 'error'
      })
    } finally {
      setIsPurging(false)
      setPurgeConfirm(false)
    }
  }, [router, fetchBookings])

  useEffect(() => {
    if (plays.length > 0) {
      fetchBookings()
    } else {
      setIsLoading(false)
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

  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split('@')
    if (!domain) return '***'
    
    // Show first character, mask the rest until @
    const maskedLocal = localPart.length > 0 
      ? `${localPart[0]}${'*'.repeat(Math.min(localPart.length - 1, 5))}`
      : '***'
    
    return `${maskedLocal}@${domain}`
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
          setMessageModal({ message: data.error || 'Fehler beim Einchecken', type: 'error' })
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
          setMessageModal({ message: data.error || 'Fehler beim Auschecken', type: 'error' })
        }
      }
    } catch (err) {
      console.error('Error toggling check-in:', err)
      setMessageModal({ message: 'Fehler beim Aktualisieren des Status', type: 'error' })
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

  const filteredBookings = showOnlyNotCheckedIn 
    ? bookings.filter(b => b.status === 'confirmed')
    : bookings

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
            href='/admin/analytics'
            className='px-4 py-2 rounded-lg border border-kolping-400 hover:bg-kolping-500/10 text-kolping-100 font-semibold transition-colors flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
            Analysen
          </a>
          <a
            href='/admin/history'
            className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            Historie
          </a>
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
            onClick={() => setPurgeConfirm(true)}
            disabled={isPurging}
            className='px-4 py-2 rounded-lg border border-red-700 hover:bg-red-900/30 text-red-400 font-semibold transition-colors flex items-center gap-2 disabled:opacity-50'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
            </svg>
            Alte Daten löschen
          </button>
          <button
            onClick={handleLogout}
            className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors'
          >
            Abmelden
          </button>
        </div>
      </div>

      {plays.length > 0 && (<>
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

      {/* Play Management Section */}
      <div className='glass rounded-xl mb-8'>
        <button
          onClick={() => setPlaysExpanded(!playsExpanded)}
          className='w-full flex items-center justify-between p-6 text-left'
        >
          <h2 className='text-xl font-display font-bold'>Stücke verwalten</h2>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${playsExpanded ? 'rotate-180' : ''}`}
            fill='none' stroke='currentColor' viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>

        {playsExpanded && (
          <div className='px-6 pb-6'>
            {/* New Play Button */}
            {!showPlayForm && !editingPlayId && (
              <button
                onClick={() => {
                  setShowPlayForm(true)
                  setPlayForm({ title: '', date: '', time: '', total_seats: 68 })
                }}
                className='mb-4 px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors text-sm flex items-center gap-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Neues Stück anlegen
              </button>
            )}

            {/* Inline Create Form */}
            {showPlayForm && (
              <div className='mb-4 p-4 rounded-lg bg-site-800/50 border border-site-700'>
                <h3 className='text-sm font-semibold mb-3'>Neues Stück anlegen</h3>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
                  <input
                    type='text'
                    placeholder='Titel'
                    value={playForm.title}
                    onChange={(e) => setPlayForm({ ...playForm, title: e.target.value })}
                    className='px-3 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                  />
                  <input
                    type='date'
                    value={playForm.date}
                    onChange={(e) => setPlayForm({ ...playForm, date: e.target.value })}
                    className='px-3 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                  />
                  <input
                    type='time'
                    value={playForm.time}
                    onChange={(e) => setPlayForm({ ...playForm, time: e.target.value })}
                    className='px-3 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                  />
                  <input
                    type='number'
                    placeholder='Plätze'
                    value={playForm.total_seats}
                    onChange={(e) => setPlayForm({ ...playForm, total_seats: parseInt(e.target.value) || 68 })}
                    className='px-3 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                  />
                  <div className='flex gap-2'>
                    <button
                      onClick={handleCreatePlay}
                      disabled={playFormLoading || !playForm.title || !playForm.date || !playForm.time}
                      className='flex-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-50'
                    >
                      {playFormLoading ? 'Speichern...' : 'Erstellen'}
                    </button>
                    <button
                      onClick={() => setShowPlayForm(false)}
                      className='px-3 py-2 rounded-lg border border-site-700 hover:bg-site-700/30 text-sm transition-colors'
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
                {playForm.date && playForm.time && (
                  <p className='mt-2 text-xs text-site-400'>
                    Anzeige-Datum: {formatDisplayDate(playForm.date, playForm.time)}
                  </p>
                )}
              </div>
            )}

            {/* Plays Table */}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-site-700'>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Titel</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Datum</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Uhrzeit</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Anzeige-Datum</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Plätze</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Buchungen</th>
                    <th className='text-left py-3 px-2 text-sm font-semibold text-site-100'>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPlays.map((play) => (
                    editingPlayId === play.id ? (
                      <tr key={play.id} className='border-b border-site-800 bg-site-800/30'>
                        <td className='py-2 px-2'>
                          <input
                            type='text'
                            value={playForm.title}
                            onChange={(e) => setPlayForm({ ...playForm, title: e.target.value })}
                            className='w-full px-2 py-1 rounded bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                          />
                        </td>
                        <td className='py-2 px-2'>
                          <input
                            type='date'
                            value={playForm.date}
                            onChange={(e) => setPlayForm({ ...playForm, date: e.target.value })}
                            className='px-2 py-1 rounded bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                          />
                        </td>
                        <td className='py-2 px-2'>
                          <input
                            type='time'
                            value={playForm.time}
                            onChange={(e) => setPlayForm({ ...playForm, time: e.target.value })}
                            className='px-2 py-1 rounded bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                          />
                        </td>
                        <td className='py-2 px-2 text-sm text-site-400'>
                          {playForm.date && playForm.time ? formatDisplayDate(playForm.date, playForm.time) : '—'}
                        </td>
                        <td className='py-2 px-2'>
                          <input
                            type='number'
                            value={playForm.total_seats}
                            onChange={(e) => setPlayForm({ ...playForm, total_seats: parseInt(e.target.value) || 68 })}
                            className='w-20 px-2 py-1 rounded bg-site-800 border border-site-700 text-site-50 text-sm focus:outline-none focus:ring-2 focus:ring-kolping-400'
                          />
                        </td>
                        <td className='py-2 px-2 text-sm text-site-100'>{play.booking_count}</td>
                        <td className='py-2 px-2'>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleUpdatePlay(play.id)}
                              disabled={playFormLoading || !playForm.title || !playForm.date || !playForm.time}
                              className='px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors disabled:opacity-50'
                            >
                              {playFormLoading ? '...' : 'Speichern'}
                            </button>
                            <button
                              onClick={cancelEditPlay}
                              className='px-2 py-1 rounded border border-site-700 hover:bg-site-700/30 text-xs transition-colors'
                            >
                              Abbrechen
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={play.id} className='border-b border-site-800 hover:bg-site-800/30'>
                        <td className='py-3 px-2 text-sm font-medium'>{play.title}</td>
                        <td className='py-3 px-2 text-sm text-site-100'>{play.date}</td>
                        <td className='py-3 px-2 text-sm text-site-100'>{play.time}</td>
                        <td className='py-3 px-2 text-sm text-site-100'>{play.display_date}</td>
                        <td className='py-3 px-2 text-sm text-site-100'>{play.total_seats}</td>
                        <td className='py-3 px-2 text-sm'>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            play.booking_count > 0
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                              : 'bg-site-700 text-site-300'
                          }`}>
                            {play.booking_count}
                          </span>
                        </td>
                        <td className='py-3 px-2 text-sm'>
                          <div className='flex gap-2'>
                            {play.booking_count > 0 ? (
                              <>
                                <span
                                  className='px-2 py-1 rounded text-xs text-site-500 cursor-not-allowed'
                                  title={`${play.booking_count} Buchung(en) vorhanden — Bearbeiten nicht möglich`}
                                >
                                  Bearbeiten
                                </span>
                                <span
                                  className='px-2 py-1 rounded text-xs text-site-500 cursor-not-allowed'
                                  title={`${play.booking_count} Buchung(en) vorhanden — Löschen nicht möglich`}
                                >
                                  Löschen
                                </span>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditPlay(play)}
                                  className='px-2 py-1 rounded border border-kolping-400 text-kolping-400 hover:bg-kolping-500/10 text-xs font-semibold transition-colors'
                                >
                                  Bearbeiten
                                </button>
                                {deleteConfirmId === play.id ? (
                                  <div className='flex gap-1'>
                                    <button
                                      onClick={() => handleDeletePlay(play.id)}
                                      className='px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors'
                                    >
                                      Ja, löschen
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className='px-2 py-1 rounded border border-site-700 hover:bg-site-700/30 text-xs transition-colors'
                                    >
                                      Nein
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(play.id)}
                                    className='px-2 py-1 rounded border border-red-700 text-red-400 hover:bg-red-900/30 text-xs font-semibold transition-colors'
                                  >
                                    Löschen
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                  {adminPlays.length === 0 && (
                    <tr>
                      <td colSpan={7} className='py-8 text-center text-site-400 text-sm'>
                        Keine Vorstellungen vorhanden
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Seats Available per Show Chart */}
      {plays.length > 0 && (
        <div className='glass rounded-xl p-6 mb-8'>
          <h2 className='text-xl font-display font-bold mb-6'>Verfügbare Plätze pro Vorstellung</h2>
          <div className='space-y-4'>
            {plays.map((play) => {
              const availablePercent = (play.available_seats / play.total_seats) * 100
              const bookedPercent = 100 - availablePercent
              
              return (
                <div key={play.id} className='group'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm font-medium truncate mr-4'>{play.display_date}</span>
                    <span className='text-sm text-site-100 whitespace-nowrap'>
                      {play.available_seats} / {play.total_seats} verfügbar
                    </span>
                  </div>
                  <div className='relative h-8 bg-site-800 rounded-lg overflow-hidden border border-site-700'>
                    {/* Booked seats (background) */}
                    <div
                      className='absolute inset-y-0 left-0 bg-gradient-to-r from-kolping-600 to-kolping-500 transition-all duration-500 ease-out'
                      style={{ width: `${bookedPercent}%` }}
                    />
                    {/* Available seats indicator */}
                    <div
                      className='absolute inset-y-0 right-0 bg-gradient-to-r from-green-600/80 to-green-500/80 transition-all duration-500 ease-out'
                      style={{ width: `${availablePercent}%` }}
                    />
                    {/* Labels inside bar */}
                    <div className='absolute inset-0 flex items-center justify-between px-3 text-xs font-semibold'>
                      <span className={`${bookedPercent > 15 ? 'text-white' : 'text-transparent'}`}>
                        {play.booked_seats} gebucht
                      </span>
                      <span className={`${availablePercent > 15 ? 'text-white' : 'text-transparent'}`}>
                        {play.available_seats} frei
                      </span>
                    </div>
                  </div>
                  {/* Sold out indicator */}
                  {play.is_sold_out && (
                    <p className='text-xs text-red-400 mt-1 font-semibold'>⚠️ Ausgebucht</p>
                  )}
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className='flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t border-site-700'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-gradient-to-r from-kolping-600 to-kolping-500' />
              <span className='text-sm text-site-100'>Gebucht</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-gradient-to-r from-green-600/80 to-green-500/80' />
              <span className='text-sm text-site-100'>Verfügbar</span>
            </div>
          </div>
        </div>
      )}

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
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='w-full lg:w-1/2'>
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
                  {play.display_date} ({play.available_seats} Plätze verfügbar)
                </option>
              ))}
            </select>
          </div>
          <div className='w-full lg:w-1/2'>
            <label htmlFor='booking-search' className='block text-sm font-medium mb-2'>
              Nach Buchung suchen
            </label>
            <div className='relative mb-4'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-site-400'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z' />
                </svg>
              </span>
              <input
                type='search'
                id='booking-search'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Name oder E-Mail'
                className='w-full pl-10 pr-10 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 focus:outline-none focus:ring-2 focus:ring-kolping-400'
              />
              {searchTerm && (
                <button
                  type='button'
                  onClick={() => setSearchTerm('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-site-400 hover:text-site-200'
                  aria-label='Suche zurücksetzen'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              )}
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                id='not-checked-in'
                checked={showOnlyNotCheckedIn}
                onChange={(e) => setShowOnlyNotCheckedIn(e.target.checked)}
                className='w-4 h-4 rounded border-site-600 bg-site-700 text-kolping-500 focus:ring-kolping-500 focus:ring-offset-site-900'
              />
              <label htmlFor='not-checked-in' className='ml-2 text-sm text-site-100 select-none cursor-pointer'>
                Nur nicht eingecheckte Buchungen anzeigen
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className='glass rounded-xl p-6'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4'>
          <h2 className='text-xl font-display font-bold'>
            Buchungen {selectedPlayId !== 'all' && `für ${plays.find(p => p.id === selectedPlayId)?.display_date}`}
          </h2>
          <div className='flex gap-3 flex-wrap'>
            <button
              type='button'
              onClick={() => fetchBookings()}
              disabled={isLoading}
              className='inline-flex items-center justify-center gap-2 rounded-lg border border-site-700 px-4 py-2 text-sm font-semibold hover:bg-site-700/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              <span>Aktualisieren</span>
            </button>
            <button
              type='button'
              onClick={() => setShowEmails(!showEmails)}
              className='inline-flex items-center justify-center gap-2 rounded-lg border border-site-700 px-4 py-2 text-sm font-semibold hover:bg-site-700/30 transition-colors'
            >
              {showEmails ? (
                <>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.405 3.214 1.122 4.588M6.29 6.29L3 3m3.29 3.29l3.29 3.29m7.532 7.532l3.29 3.29M21 21l-3.29-3.29m0 0A9.97 9.97 0 0019 12a9.97 9.97 0 00-1.122-4.588M17.71 17.71L21 21m-3.29-3.29l-3.29-3.29' />
                  </svg>
                  <span>E-Mails verbergen</span>
                </>
              ) : (
                <>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <span>E-Mails anzeigen</span>
                </>
              )}
            </button>
            <button
              type='button'
              onClick={handleExportCsv}
              disabled={isLoading}
              className='inline-flex items-center justify-center gap-2 rounded-lg border border-kolping-400 px-4 py-2 text-sm font-semibold text-kolping-100 hover:bg-kolping-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                <path d='M12 5v11m0 0l-4-4m4 4l4-4' />
                <rect x='4' y='18' width='16' height='2' rx='1' />
              </svg>
              <span>Als CSV exportieren</span>
            </button>
          </div>
        </div>

        {error && (
          <div className='p-4 mb-4 rounded-lg bg-red-900/20 border border-red-700'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner text='Lade Buchungen...' size='lg' />
        ) : filteredBookings.length === 0 ? (
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className='border-b border-site-800 hover:bg-site-800/30'>
                    <td className='py-3 px-2 text-sm'>{booking.name}</td>
                    <td className='py-3 px-2 text-sm text-site-100'>
                      {showEmails ? booking.email : maskEmail(booking.email)}
                    </td>
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
      </>)}

      {plays.length === 0 && !isLoading && (
        <div className='glass rounded-xl p-12 text-center'>
          <p className='text-site-100 text-lg'>Keine Stücke angelegt.</p>
          <p className='text-site-200 text-sm mt-2'>Erstelle über &quot;Stücke verwalten&quot; oben eine neue Vorstellung.</p>
        </div>
      )}

      {/* Purge Confirmation Dialog */}
      {purgeConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div className='glass rounded-xl p-6 max-w-md mx-4 border border-red-700'>
            <h3 className='text-xl font-display font-bold text-red-400 mb-3'>
              ⚠️ Alte Buchungen löschen
            </h3>
            <p className='text-site-100 mb-2'>
              Alle Buchungen für Vorstellungen, die <strong>älter als 2 Wochen</strong> sind, werden unwiderruflich gelöscht.
            </p>
            <p className='text-site-100 mb-6 text-sm'>
              Dies betrifft Namen, E-Mail-Adressen und Sitzplatzdaten (Datenschutz). Es werden keine E-Mails versendet.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setPurgeConfirm(false)}
                className='px-4 py-2 rounded-lg border border-site-700 hover:bg-site-700/30 transition-colors'
              >
                Abbrechen
              </button>
              <button
                onClick={handlePurgeOldBookings}
                disabled={isPurging}
                className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2'
              >
                {isPurging ? (
                  <>
                    <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                    </svg>
                    Lösche...
                  </>
                ) : (
                  'Endgültig löschen'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {messageModal && (
        <MessageModal
          message={messageModal.message}
          type={messageModal.type}
          onClose={() => setMessageModal(null)}
        />
      )}
    </div>
  )
}

