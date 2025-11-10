"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SeatSelection from '@/components/booking/SeatSelection'
import BookingForm from '@/components/booking/BookingForm'
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
  const [error, setError] = useState<string | null>(null)
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
      const response = await fetch(`/api/plays/${playId}/seats`)
      const data = await response.json() as { success: boolean; bookedSeats: number[] }
      
      if (data.success) {
        setBookedSeats(data.bookedSeats)
      } else {
        console.error('Failed to load booked seats')
      }
    } catch (err) {
      console.error('Error fetching booked seats:', err)
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
        alert(data.error || 'Fehler beim Erstellen der Buchung')
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
      alert('Fehler beim Erstellen der Buchung. Bitte versuchen Sie es erneut.')
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
            <div className='text-center py-12'>
              <p className='text-site-100'>Lade Vorstellungen...</p>
            </div>
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
          <SeatSelection
            playId={selectedPlay.id}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatSelection={handleSeatSelection}
            maxSeats={5}
          />
        </div>
      )}

      {bookingStep === 'form' && selectedPlay && (
        <div>
          <div className='flex items-center gap-4 mb-6'>
            <button
              onClick={handleBackToSeatSelection}
              className='text-site-100 hover:text-kolping-400 transition-colors'
            >
              ← Zurück
            </button>
            <div>
              <h2 className='text-xl font-display font-bold'>Ihre Daten</h2>
              <p className='text-site-100'>{selectedPlay.display_date} • {selectedSeats.length} Plätze</p>
            </div>
          </div>
          <BookingForm onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  )
}
