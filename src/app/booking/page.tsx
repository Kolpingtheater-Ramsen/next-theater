"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SeatSelection from '@/components/booking/SeatSelection'
import BookingForm from '@/components/booking/BookingForm'
import CountdownTimer from '@/components/CountdownTimer'

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

const PLAYS: Play[] = [
  { id: 'play-1', date: '2025-12-27', time: '17:00', displayDate: 'Sa, 27.12.2025 - 17:00 Uhr' },
  { id: 'play-2', date: '2025-12-27', time: '20:00', displayDate: 'Sa, 27.12.2025 - 20:00 Uhr' },
  { id: 'play-3', date: '2025-12-28', time: '14:30', displayDate: 'So, 28.12.2025 - 14:30 Uhr' },
  { id: 'play-4', date: '2025-12-28', time: '17:30', displayDate: 'So, 28.12.2025 - 17:30 Uhr' },
]

export default function BookingPage() {
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookingStep, setBookingStep] = useState<'play-selection' | 'seat-selection' | 'form' | 'confirmation'>('play-selection')
  const [bookingData, setBookingData] = useState<{ name: string; email: string } | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePlaySelect = (play: Play) => {
    setSelectedPlay(play)
    setSelectedSeats([])
    setBookingStep('seat-selection')
  }

  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats)
    if (seats.length > 0) {
      setBookingStep('form')
    }
  }

  const handleFormSubmit = (name: string, email: string) => {
    // Check if user already has a booking for this play
    const existingBookings = getBookings()
    const hasExistingBooking = existingBookings.some(
      (b) => b.playId === selectedPlay?.id && b.email.toLowerCase() === email.toLowerCase()
    )

    if (hasExistingBooking) {
      alert('Sie haben bereits eine Buchung für diese Vorstellung mit dieser E-Mail-Adresse.')
      return
    }

    // Create booking
    const booking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playId: selectedPlay!.id,
      email,
      name,
      seats: selectedSeats,
      timestamp: Date.now(),
    }

    // Save to localStorage
    const bookings = getBookings()
    bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(bookings))

    setBookingData({ name, email })
    setConfirmedBooking(booking)
    setBookingStep('confirmation')
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

  const getBookings = (): Booking[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('bookings')
    return stored ? JSON.parse(stored) : []
  }

  const getBookedSeatsForPlay = (playId: string): number[] => {
    const bookings = getBookings()
    return bookings
      .filter((b) => b.playId === playId)
      .flatMap((b) => b.seats)
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
        <p className='text-xl text-site-100 mb-1'>Schicksalfäden</p>
        <p className='text-site-100'>
          Kostenfrei • Maximal 5 Sitzplätze pro Buchung
        </p>
      </div>

      {bookingStep === 'play-selection' && (
        <div>
          <h2 className='text-2xl font-display font-bold mb-4'>Vorstellung wählen</h2>
          <div className='grid gap-4 md:grid-cols-2'>
            {PLAYS.map((play) => {
              const bookedSeats = getBookedSeatsForPlay(play.id)
              const availableSeats = 68 - bookedSeats.length
              const isSoldOut = availableSeats === 0

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
                  <div className='text-lg font-semibold mb-2'>{play.displayDate}</div>
                  <div className='text-site-100'>
                    {isMounted && isSoldOut ? (
                      <span className='text-red-400'>Ausverkauft</span>
                    ) : (
                      <span>
                        {isMounted ? `${availableSeats} von 68 Plätzen verfügbar` : '68 von 68 Plätzen verfügbar'}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
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
              <p className='text-site-100'>{selectedPlay.displayDate}</p>
            </div>
          </div>
          <SeatSelection
            playId={selectedPlay.id}
            bookedSeats={getBookedSeatsForPlay(selectedPlay.id)}
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
              <p className='text-site-100'>{selectedPlay.displayDate} • {selectedSeats.length} Plätze</p>
            </div>
          </div>
          <BookingForm onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  )
}
