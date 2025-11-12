"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SeatSelection from '@/components/booking/SeatSelection'
import BookingForm from '@/components/booking/BookingForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import MessageModal from '@/components/MessageModal'
// import CountdownTimer from '@/components/CountdownTimer'
import type { PlayWithAvailability } from '@/types/database'

export type Play = {
  id: string
  date: string
  time: string
  displayDate: string
}

export type Booking = {
  id: string
  playId: string
  email: string
  name: string
  seats: number[]
  timestamp: number
}

export default function BookingPage() {
  const [plays, setPlays] = useState<PlayWithAvailability[]>([])
  const [selectedPlay, setSelectedPlay] = useState<PlayWithAvailability | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookedSeats, setBookedSeats] = useState<number[]>([])
  const [bookingStep, setBookingStep] = useState<'play-selection' | 'seat-selection' | 'form' | 'confirmation'>('play-selection')
  const [bookingData, setBookingData] = useState<{ name: string; email: string } | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSeats, setIsLoadingSeats] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageModal, setMessageModal] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null)
  const router = useRouter()

  // Fetch plays on mount
  useEffect(() => {
    setIsMounted(true)
    fetchPlays()
  }, [])

  const fetchPlays = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/plays')
      const data = await response.json() as { success: boolean; plays: PlayWithAvailability[] }
      
      if (data.success) {
        setPlays(data.plays)
      } else {
        setError('Failed to load plays')
      }
    } catch (err) {
      console.error('Error fetching plays:', err)
      setError('Failed to load plays')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookedSeats = async (playId: string) => {
    try {
      setIsLoadingSeats(true)
      const response = await fetch(`/api/plays/${playId}/seats`)
      const data = await response.json() as { success: boolean; bookedSeats: number[] }
      
      if (data.success) {
        setBookedSeats(data.bookedSeats)
      } else {
        console.error('Failed to load booked seats')
      }
    } catch (err) {
      console.error('Error fetching booked seats:', err)
    } finally {
      setIsLoadingSeats(false)
    }
  }

  const handlePlaySelect = async (play: PlayWithAvailability) => {
    setSelectedPlay(play)
    setSelectedSeats([])
    setBookingStep('seat-selection')
    await fetchBookedSeats(play.id)
  }

  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats)
    if (seats.length > 0) {
      setBookingStep('form')
    }
  }

  const handleFormSubmit = async (name: string, email: string) => {
    if (!selectedPlay) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playId: selectedPlay.id,
          name,
          email,
          seats: selectedSeats,
        }),
      })

      const data = await response.json() as { success: boolean; bookingId: string; error?: string }

      if (!response.ok || !data.success) {
        setMessageModal({ message: data.error || 'Fehler beim Erstellen der Buchung', type: 'error' })
        return
      }

      // Create booking object for confirmation
      const booking: Booking = {
        id: data.bookingId,
        playId: selectedPlay.id,
        email,
        name,
        seats: selectedSeats,
        timestamp: Date.now(),
      }

      setBookingData({ name, email })
      setConfirmedBooking(booking)
      setBookingStep('confirmation')
    } catch (err) {
      console.error('Error creating booking:', err)
      setMessageModal({ message: 'Fehler beim Erstellen der Buchung. Bitte versuchen Sie es erneut.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPlaySelection = () => {
    setSelectedPlay(null)
    setSelectedSeats([])
    setBookingStep('play-selection')
  }

  const handleBackToSeatSelection = () => {
    setSelectedSeats([])
    setBookingStep('seat-selection')
  }

  useEffect(() => {
    if (bookingStep === 'confirmation' && confirmedBooking && selectedPlay && bookingData) {
      router.push(`/booking/view/${confirmedBooking.id}?new=true`)
    }
  }, [bookingStep, confirmedBooking, selectedPlay, bookingData, router])

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-8'>
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
          Winterstück 2025
        </h1>
        <p className='text-xl text-site-100 mb-1'>Schicksalsfäden</p>
        <p className='text-site-100'>
          Kostenfrei • Maximal 5 Sitzplätze pro Buchung
        </p>
      </div>

      {bookingStep === 'play-selection' && (
        <div>
          <h2 className='text-2xl font-display font-bold mb-4'>Vorstellung wählen</h2>
          
          {error && (
            <div className='glass rounded-xl p-4 mb-4 border border-red-700 bg-red-900/20'>
              <p className='text-red-400'>{error}</p>
            </div>
          )}
          
          {isLoading ? (
            <LoadingSpinner text='Lade Vorstellungen...' size='lg' />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {plays.map((play) => {
                const isSoldOut = play.is_sold_out

                return (
                  <button
                    key={play.id}
                    onClick={() => !isSoldOut && handlePlaySelect(play)}
                    disabled={isSoldOut}
                    className={`glass rounded-xl p-6 text-left transition-all ${
                      isSoldOut
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-kolping-400 cursor-pointer'
                    }`}
                  >
                    <div className='text-lg font-semibold mb-2'>{play.display_date}</div>
                    <div className='text-site-100'>
                      {isMounted && isSoldOut ? (
                        <span className='text-red-400'>Ausverkauft</span>
                      ) : (
                        <span>
                          {isMounted ? `${play.available_seats} von ${play.total_seats} Plätzen verfügbar` : `${play.total_seats} von ${play.total_seats} Plätzen verfügbar`}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Additional Information Section */}
          <div className='mt-12 space-y-6'>
            <div className='glass rounded-xl p-6'>
              <h3 className='text-xl font-display font-bold mb-4'>Über die Vorstellung</h3>
              <p className='text-site-100 mb-4'>
                Erleben Sie "Schicksalsfäden" - ein selbst geschriebenes Stück der Kolping Kreativbühne, inspiriert von den griechischen 
                Schicksalsgöttinnen, den Moiren. Das Stück erzählt von den Fäden des Schicksals, die unser Leben durchweben, und stellt die 
                Frage: Wer bestimmt unseren Weg? Können wir unser Schicksal selbst in die Hand nehmen?
              </p>
            </div>

            <div className='glass rounded-xl p-6'>
              <h3 className='text-xl font-display font-bold mb-4'>Wichtige Informationen</h3>
              <ul className='space-y-3 text-site-100'>
                <li className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-kolping-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>Die Buchung ist kostenfrei und unverbindlich. Falls Sie nicht kommen können, bitten wir um Stornierung, damit andere den Platz nutzen können.</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-kolping-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>Sie können maximal 5 Sitzplätze pro Buchung reservieren</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-kolping-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>Sie erhalten eine Bestätigungs-E-Mail mit allen Details</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-kolping-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <span>Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn</span>
                </li>
              </ul>
            </div>

            <div className='glass rounded-xl p-6'>
              <h3 className='text-xl font-display font-bold mb-4'>Kontakt & Fragen</h3>
              <p className='text-site-100 mb-4'>
                Haben Sie Fragen zur Buchung oder zur Vorstellung? Wir helfen Ihnen gerne weiter.
              </p>
              <p className='text-site-100'>
                Besuchen Sie unsere <a href='/contact' className='text-kolping-400 hover:text-kolping-300 underline transition-colors'>Kontaktseite</a> oder 
                wenden Sie sich direkt an uns. Wir freuen uns auf Ihren Besuch!
              </p>
            </div>
          </div>
        </div>
      )}

      {bookingStep === 'seat-selection' && selectedPlay && (
        <div>
          <div className='flex items-center gap-4 mb-6'>
            <button
              onClick={handleBackToPlaySelection}
              className='text-site-100 hover:text-kolping-400 transition-colors'
            >
              ← Zurück
            </button>
            <div>
              <h2 className='text-xl font-display font-bold'>Sitzplätze wählen</h2>
              <p className='text-site-100'>{selectedPlay.display_date}</p>
            </div>
          </div>
          {isLoadingSeats ? (
            <div className='glass rounded-xl p-8'>
              <LoadingSpinner text='Lade Sitzplätze...' size='lg' />
            </div>
          ) : (
            <SeatSelection
              playId={selectedPlay.id}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              onSeatSelection={handleSeatSelection}
              maxSeats={5}
              onShowMessage={(message, type) => setMessageModal({ message, type })}
            />
          )}
        </div>
      )}

      {bookingStep === 'form' && selectedPlay && (
        <div>
          <div className='flex items-center gap-4 mb-6'>
            <button
              onClick={handleBackToSeatSelection}
              className='text-site-100 hover:text-kolping-400 transition-colors'
              disabled={isLoading}
            >
              ← Zurück
            </button>
            <div>
              <h2 className='text-xl font-display font-bold'>Ihre Daten</h2>
              <p className='text-site-100'>{selectedPlay.display_date} • {selectedSeats.length} Plätze</p>
            </div>
          </div>
          {isLoading ? (
            <div className='glass rounded-xl p-8'>
              <LoadingSpinner text='Erstelle Buchung...' size='lg' />
            </div>
          ) : (
            <BookingForm onSubmit={handleFormSubmit} />
          )}
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
