"use client"

import { useState, useEffect } from 'react'
import SeatSelection from '@/components/booking/SeatSelection'
import BookingForm from '@/components/booking/BookingForm'
import TicketConfirmation from '@/components/booking/TicketConfirmation'
import VIPCodeInput from '@/components/booking/VIPCodeInput'

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
  { id: 'play-1', date: '2025-12-27', time: '14:00', displayDate: 'Sa, 27.12.2025 - 14:00 Uhr' },
  { id: 'play-2', date: '2025-12-27', time: '19:00', displayDate: 'Sa, 27.12.2025 - 19:00 Uhr' },
  { id: 'play-3', date: '2025-12-28', time: '14:00', displayDate: 'So, 28.12.2025 - 14:00 Uhr' },
  { id: 'play-4', date: '2025-12-28', time: '19:00', displayDate: 'So, 28.12.2025 - 19:00 Uhr' },
]

// Mock data: Tickets locked until this date (unless VIP code is used)
const BOOKING_UNLOCK_DATE = new Date('2025-12-01T10:00:00+01:00')
const VIP_CODES = ['VIP2025', 'WINTER2025', 'SCHICKSALFADEN']

export default function BookingPage() {
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookingStep, setBookingStep] = useState<'play-selection' | 'seat-selection' | 'form' | 'confirmation'>('play-selection')
  const [bookingData, setBookingData] = useState<{ name: string; email: string } | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [hasVIPAccess, setHasVIPAccess] = useState(false)
  const [isBookingLocked, setIsBookingLocked] = useState(true)

  // Check if booking is locked
  useEffect(() => {
    const now = new Date()
    setIsBookingLocked(now < BOOKING_UNLOCK_DATE && !hasVIPAccess)
  }, [hasVIPAccess])

  const handleVIPCodeSubmit = (code: string) => {
    if (VIP_CODES.includes(code)) {
      setHasVIPAccess(true)
      return true
    }
    return false
  }

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

  const handleNewBooking = () => {
    setSelectedPlay(null)
    setSelectedSeats([])
    setBookingData(null)
    setConfirmedBooking(null)
    setBookingStep('play-selection')
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

  if (bookingStep === 'confirmation' && confirmedBooking && selectedPlay && bookingData) {
    return (
      <TicketConfirmation
        booking={confirmedBooking}
        play={selectedPlay}
        name={bookingData.name}
        email={bookingData.email}
        onNewBooking={handleNewBooking}
      />
    )
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-8'>
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
          Winterstück 2025
        </h1>
        <p className='text-xl text-site-100 mb-1'>&bdquo;Schicksalfäden&ldquo;</p>
        <p className='text-site-100'>
          Kostenfrei • Maximal 5 Sitzplätze pro Buchung
        </p>
      </div>

      {isBookingLocked && (
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0 text-kolping-400'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold mb-2'>Buchung noch nicht geöffnet</h3>
              <p className='text-site-100 mb-4'>
                Die allgemeine Buchung öffnet am {BOOKING_UNLOCK_DATE.toLocaleDateString('de-DE', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} Uhr.
              </p>
              <VIPCodeInput onSubmit={handleVIPCodeSubmit} />
            </div>
          </div>
        </div>
      )}

      {bookingStep === 'play-selection' && (
        <div>
          <h2 className='text-2xl font-display font-bold mb-4'>Vorstellung wählen</h2>
          <div className='grid gap-4 md:grid-cols-2'>
            {PLAYS.map((play) => {
              const bookedSeats = getBookedSeatsForPlay(play.id)
              const availableSeats = 70 - bookedSeats.length
              const isSoldOut = availableSeats === 0

              return (
                <button
                  key={play.id}
                  onClick={() => !isBookingLocked && !isSoldOut && handlePlaySelect(play)}
                  disabled={isBookingLocked || isSoldOut}
                  className={`glass rounded-xl p-6 text-left transition-all ${
                    isBookingLocked || isSoldOut
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-kolping-400 cursor-pointer'
                  }`}
                >
                  <div className='text-lg font-semibold mb-2'>{play.displayDate}</div>
                  <div className='text-site-100'>
                    {isSoldOut ? (
                      <span className='text-red-400'>Ausverkauft</span>
                    ) : (
                      <span>
                        {availableSeats} von 70 Plätzen verfügbar
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
