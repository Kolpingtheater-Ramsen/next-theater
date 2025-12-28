"use client"

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import MessageModal from '@/components/MessageModal'
import type { BookingWithSeats } from '@/types/database'

export const runtime = 'edge'

const ROWS = 7
const SEATS_PER_SIDE = 5
const TOTAL_SEATS_PER_ROW = SEATS_PER_SIDE * 2
const MAX_SEATS = 5

export default function EditBookingPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string
  
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookedSeats, setBookedSeats] = useState<number[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [originalSeats, setOriginalSeats] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [messageModal, setMessageModal] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/${bookingId}`)
      const data = await response.json() as { success: boolean; booking?: BookingWithSeats }
      
      if (data.success && data.booking) {
        setBooking(data.booking)
        setSelectedSeats([...data.booking.seats])
        setOriginalSeats([...data.booking.seats])
        
        // Fetch booked seats for this play
        if (data.booking.play) {
          const seatsResponse = await fetch(`/api/plays/${data.booking.play_id}/seats`)
          const seatsData = await seatsResponse.json() as { success: boolean; bookedSeats: number[] }
          if (seatsData.success) {
            setBookedSeats(seatsData.bookedSeats)
          }
        }
      } else {
        setBooking(null)
      }
    } catch (err) {
      console.error('Error fetching booking:', err)
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

  const getSeatNumber = (row: number, seat: number): number => {
    return row * TOTAL_SEATS_PER_ROW + seat
  }

  const isSeatBooked = (seatNumber: number): boolean => {
    // Block first and last seat in row A (row 0)
    const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
    const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
    
    if (row === 0 && (seatInRow === 0 || seatInRow === TOTAL_SEATS_PER_ROW - 1)) {
      return true
    }
    
    // If this seat belongs to current booking, it's not "booked" (user can toggle it)
    if (originalSeats.includes(seatNumber)) {
      return false
    }
    
    return bookedSeats.includes(seatNumber)
  }

  const isSeatSelected = (seatNumber: number): boolean => {
    return selectedSeats.includes(seatNumber)
  }

  const handleSeatClick = (seatNumber: number) => {
    if (isSeatBooked(seatNumber)) return

    if (isSeatSelected(seatNumber)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber))
    } else {
      // Select seat (if not exceeding max)
      if (selectedSeats.length >= MAX_SEATS) {
        setMessageModal({ message: `Sie können maximal ${MAX_SEATS} Plätze auswählen.`, type: 'error' })
        return
      }
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
    const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  const hasChanges = (): boolean => {
    if (selectedSeats.length !== originalSeats.length) return true
    const sortedSelected = [...selectedSeats].sort((a, b) => a - b)
    const sortedOriginal = [...originalSeats].sort((a, b) => a - b)
    return sortedSelected.some((s, i) => s !== sortedOriginal[i])
  }

  const handleSaveClick = () => {
    if (selectedSeats.length === 0) {
      setMessageModal({ message: 'Bitte wählen Sie mindestens einen Sitzplatz oder stornieren Sie die Buchung.', type: 'error' })
      return
    }
    if (!hasChanges()) {
      setMessageModal({ message: 'Keine Änderungen vorgenommen.', type: 'info' })
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    if (!booking) return

    try {
      setIsSaving(true)
      setShowConfirmModal(false)
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seats: selectedSeats,
        }),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setMessageModal({ message: 'Ihre Buchung wurde erfolgreich aktualisiert.', type: 'success' })
      } else {
        setMessageModal({ message: data.error || 'Fehler beim Aktualisieren der Buchung', type: 'error' })
      }
    } catch (err) {
      console.error('Error updating booking:', err)
      setMessageModal({ message: 'Fehler beim Aktualisieren der Buchung', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!booking) return

    try {
      setIsCanceling(true)
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: booking.email,
        }),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setMessageModal({ message: 'Ihre Buchung wurde erfolgreich storniert.', type: 'success' })
        setShowCancelConfirm(false)
      } else {
        setMessageModal({ message: data.error || 'Fehler beim Stornieren der Buchung', type: 'error' })
        setShowCancelConfirm(false)
      }
    } catch (err) {
      console.error('Error canceling booking:', err)
      setMessageModal({ message: 'Fehler beim Stornieren der Buchung', type: 'error' })
      setShowCancelConfirm(false)
    } finally {
      setIsCanceling(false)
    }
  }

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto'>
        <LoadingSpinner text='Lade Buchung...' size='lg' />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className='max-w-2xl mx-auto text-center py-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4'>
          <svg className='w-8 h-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
        <h1 className='font-display text-2xl font-bold mb-2'>
          Buchung nicht gefunden
        </h1>
        <p className='text-site-100 mb-6'>
          Die angeforderte Buchung existiert nicht oder wurde bereits storniert.
        </p>
        <a
          href='/booking'
          className='inline-block px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
        >
          Zur Buchungsseite
        </a>
      </div>
    )
  }

  if (booking.status === 'cancelled') {
    return (
      <div className='max-w-2xl mx-auto text-center py-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4'>
          <svg className='w-8 h-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
        <h1 className='font-display text-2xl font-bold mb-2'>
          Buchung bereits storniert
        </h1>
        <p className='text-site-100 mb-6'>
          Diese Buchung wurde bereits storniert und kann nicht mehr bearbeitet werden.
        </p>
        <a
          href='/booking'
          className='inline-block px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
        >
          Neue Buchung erstellen
        </a>
      </div>
    )
  }

  const play = booking.play

  return (
    <div className='max-w-5xl mx-auto'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-4 mb-4'>
          <a
            href={`/booking/view/${bookingId}`}
            className='text-site-100 hover:text-kolping-400 transition-colors'
          >
            ← Zurück zur Buchung
          </a>
        </div>
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
          Buchung bearbeiten
        </h1>
        <p className='text-site-100'>
          {play?.display_date} • Aktuell: {originalSeats.length} Plätze
        </p>
      </div>

      {/* Seat Selection */}
      <div className='glass rounded-xl p-4 md:p-8 max-w-[calc(100vw-2rem)] mb-6'>
        {/* Mobile scroll hint */}
        <div className='md:hidden text-center mb-3 text-sm text-site-300 flex items-center justify-center gap-2'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
          </svg>
          <span>Nach links/rechts wischen zum Scrollen</span>
        </div>

        {/* Seating area */}
        <div className='mb-6 overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-site-700 scrollbar-track-site-900 -mx-4 px-4 md:mx-0 md:px-0'>
          <div className='min-w-[420px] max-w-2xl mx-auto'>
            {/* Stage */}
            <div className='mb-8'>
              <div className='flex items-center justify-center gap-2'>
                <div className='w-8' />
                <div className='flex-1 bg-gradient-to-b from-kolping-500 to-kolping-600 text-white text-center py-3 rounded-lg font-semibold shadow-lg'>
                  BÜHNE
                </div>
              </div>
            </div>
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <div key={rowIndex} className='flex items-center justify-center gap-2 mb-3'>
                {/* Row label */}
                <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                  {String.fromCharCode(65 + rowIndex)}
                </div>

                {/* Left side seats */}
                <div className='flex gap-1.5'>
                  {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                    const seatNumber = getSeatNumber(rowIndex, seatIndex)
                    const booked = isSeatBooked(seatNumber)
                    const selected = isSeatSelected(seatNumber)
                    const isOriginal = originalSeats.includes(seatNumber)

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={booked}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium transition-all
                          ${booked 
                            ? 'seat-booked' 
                            : selected
                            ? isOriginal
                              ? 'bg-kolping-500 text-white ring-2 ring-kolping-300'
                              : 'seat-selected'
                            : 'seat-available'
                          }
                        `}
                        aria-label={`Platz ${getSeatLabel(seatNumber)} ${booked ? 'belegt' : selected ? 'ausgewählt' : 'verfügbar'}`}
                        title={getSeatLabel(seatNumber)}
                      >
                        {seatIndex + 1}
                      </button>
                    )
                  })}
                </div>

                {/* Middle pathway */}
                <div className='w-6 md:w-8' />

                {/* Right side seats */}
                <div className='flex gap-1.5'>
                  {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                    const seatNumber = getSeatNumber(rowIndex, SEATS_PER_SIDE + seatIndex)
                    const booked = isSeatBooked(seatNumber)
                    const selected = isSeatSelected(seatNumber)
                    const isOriginal = originalSeats.includes(seatNumber)

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={booked}
                        className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium transition-all
                          ${booked 
                            ? 'seat-booked' 
                            : selected
                            ? isOriginal
                              ? 'bg-kolping-500 text-white ring-2 ring-kolping-300'
                              : 'seat-selected'
                            : 'seat-available'
                          }
                        `}
                        aria-label={`Platz ${getSeatLabel(seatNumber)} ${booked ? 'belegt' : selected ? 'ausgewählt' : 'verfügbar'}`}
                        title={getSeatLabel(seatNumber)}
                      >
                        {SEATS_PER_SIDE + seatIndex + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 seat-available rounded-md' />
            <span className='text-site-100'>Verfügbar</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 seat-selected rounded-md' />
            <span className='text-site-100'>Neu ausgewählt</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-kolping-500 ring-2 ring-kolping-300 rounded-md' />
            <span className='text-site-100'>Aktuell gebucht</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 seat-booked rounded-md' />
            <span className='text-site-100'>Belegt</span>
          </div>
        </div>

        {/* Selection summary */}
        <div className='mb-4 p-4 bg-site-800 rounded-lg'>
          <div className='text-sm text-site-100 mb-2'>
            Ausgewählte Plätze ({selectedSeats.length}/{MAX_SEATS}):
          </div>
          <div className='flex flex-wrap gap-2'>
            {selectedSeats.length === 0 ? (
              <span className='text-site-300 italic'>Keine Plätze ausgewählt</span>
            ) : (
              selectedSeats.sort((a, b) => a - b).map((seatNumber) => {
                const isOriginal = originalSeats.includes(seatNumber)
                return (
                  <span
                    key={seatNumber}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      isOriginal 
                        ? 'bg-kolping-500 text-white ring-2 ring-kolping-300' 
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {getSeatLabel(seatNumber)}
                    {!isOriginal && <span className='ml-1 text-xs'>+</span>}
                  </span>
                )
              })
            )}
          </div>
          {/* Show removed seats */}
          {originalSeats.filter(s => !selectedSeats.includes(s)).length > 0 && (
            <div className='mt-3 pt-3 border-t border-site-700'>
              <div className='text-sm text-red-400 mb-2'>
                Entfernte Plätze:
              </div>
              <div className='flex flex-wrap gap-2'>
                {originalSeats.filter(s => !selectedSeats.includes(s)).sort((a, b) => a - b).map((seatNumber) => (
                  <span
                    key={seatNumber}
                    className='px-3 py-1 bg-red-900/50 text-red-300 rounded-md text-sm font-medium line-through'
                  >
                    {getSeatLabel(seatNumber)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex flex-wrap gap-3 justify-center mb-6'>
        <button
          onClick={handleSaveClick}
          disabled={isSaving || !hasChanges() || selectedSeats.length === 0}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
            ${isSaving || !hasChanges() || selectedSeats.length === 0
              ? 'bg-site-700 text-site-500 cursor-not-allowed'
              : 'bg-kolping-500 hover:bg-kolping-600 text-white shadow-lg'
            }
          `}
        >
          {isSaving ? (
            <>
              <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              Speichere...
            </>
          ) : (
            <>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
              Änderungen speichern
            </>
          )}
        </button>

        <a
          href={`/booking/view/${bookingId}`}
          className='px-6 py-3 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors font-medium'
        >
          Abbrechen
        </a>

        <button
          onClick={() => setShowCancelConfirm(true)}
          className='px-6 py-3 rounded-lg border border-red-700 hover:bg-red-900/30 text-red-400 transition-colors font-medium flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
          </svg>
          Buchung stornieren
        </button>
      </div>

      {/* Confirm save modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div className='glass rounded-xl max-w-md w-full p-6'>
            <h3 className='font-display text-xl font-bold mb-3'>
              Änderungen speichern?
            </h3>
            <p className='text-site-100 mb-4'>
              Möchten Sie die Änderungen an Ihrer Buchung speichern?
            </p>
            <div className='text-sm mb-6'>
              <p className='mb-2'><strong>Neue Sitzplätze:</strong></p>
              <div className='flex flex-wrap gap-2'>
                {selectedSeats.sort((a, b) => a - b).map((seatNumber) => (
                  <span key={seatNumber} className='px-2 py-1 bg-kolping-500 text-white rounded text-xs'>
                    {getSeatLabel(seatNumber)}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className='flex-1 px-4 py-3 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors font-medium disabled:opacity-50'
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSaving}
                className='flex-1 px-4 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white transition-colors font-medium disabled:opacity-50'
              >
                {isSaving ? 'Speichere...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div className='glass rounded-xl max-w-md w-full p-6'>
            <h3 className='font-display text-xl font-bold mb-3'>
              Buchung stornieren?
            </h3>
            <p className='text-site-100 mb-6'>
              Sind Sie sicher, dass Sie diese Buchung stornieren möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCanceling}
                className='flex-1 px-4 py-3 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors font-medium disabled:opacity-50'
              >
                Abbrechen
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCanceling}
                className='flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium disabled:opacity-50'
              >
                {isCanceling ? 'Storniere...' : 'Stornieren'}
              </button>
            </div>
          </div>
        </div>
      )}

      {messageModal && (
        <MessageModal
          message={messageModal.message}
          type={messageModal.type}
          onClose={() => {
            const wasSuccess = messageModal.type === 'success'
            setMessageModal(null)
            if (wasSuccess) {
              router.push(`/booking/view/${bookingId}`)
            }
          }}
        />
      )}
    </div>
  )
}
