"use client"

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import LoadingSpinner from '@/components/LoadingSpinner'
import MessageModal from '@/components/MessageModal'
import type { BookingWithSeats } from '@/types/database'
import AddToCalendar from '@/components/AddToCalendar'

export const runtime = 'edge'

export default function BookingViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = params.bookingId as string
  const isNewBooking = searchParams.get('new') === 'true'
  
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [loading, setLoading] = useState(true)
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

  const handlePrint = () => {
    window.print()
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / 10)
    const seatInRow = seatNumber % 10
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto'>
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

  const play = booking.play
  if (!play) {
    return (
      <div className='max-w-2xl mx-auto text-center py-12'>
        <p className='text-site-100'>Vorstellung nicht gefunden.</p>
      </div>
    )
  }

  const qrUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-6 text-center print:mb-4'>
        {isNewBooking && (
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 mb-4 print:hidden'>
            <svg className='w-8 h-8 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
        )}
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2 print:text-2xl'>
          {isNewBooking ? 'Buchung bestätigt!' : 'Ihre Buchung'}
        </h1>
        <p className='text-site-100 print:text-sm'>
          {isNewBooking ? (
            `Eine Bestätigung wurde an ${booking?.email} gesendet.`
          ) : (
            `Winterstück 2025: Schicksalsfäden`
          )}
        </p>
      </div>

      {/* Ticket */}
      <div className='glass rounded-xl overflow-hidden mb-6 print:shadow-none print:mb-0'>
        {/* Cancelled Banner */}
        {booking.status === 'cancelled' && (
          <div className='bg-red-600 text-white py-6 px-6 text-center border-b-4 border-red-700 print:py-3 print:px-3'>
            <div className='flex items-center justify-center gap-3 mb-2 print:gap-2 print:mb-1'>
              <svg className='w-8 h-8 print:w-6 print:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M6 18L18 6M6 6l12 12' />
              </svg>
              <h3 className='text-3xl md:text-4xl font-bold uppercase tracking-wider print:text-2xl'>
                Storniert
              </h3>
              <svg className='w-8 h-8 print:w-6 print:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </div>
            <p className='text-red-100 text-sm font-semibold print:text-xs'>
              Dieses Ticket wurde storniert und ist nicht gültig
            </p>
          </div>
        )}
        
        <div className={`text-white p-4 md:p-6 print:p-3 ${booking.status === 'cancelled' ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-kolping-500 to-kolping-600'}`}>
          <h2 className='font-display text-xl md:text-2xl font-bold mb-1 print:text-lg'>
            Winterstück 2025
          </h2>
          <p className='text-base md:text-lg print:text-sm'>Schicksalsfäden</p>
        </div>

        <div className={`p-4 md:p-6 space-y-4 print:p-3 print:space-y-2 ${booking.status === 'cancelled' ? 'bg-red-900/20' : ''}`}>
          <div className='grid md:grid-cols-2 gap-4 print:gap-2'>
            <div>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>Vorstellung</h3>
              <p className='text-base font-medium print:text-sm'>{play.display_date}</p>
            </div>

            <div>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>Name</h3>
              <p className='text-base font-medium print:text-sm'>{booking.name}</p>
            </div>

            <div className='md:col-span-2'>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>
                Sitzplätze ({booking.seats.length})
              </h3>
              <div className='flex flex-wrap gap-2'>
                {booking.seats.sort((a, b) => a - b).map((seatNumber) => (
                  <span
                    key={seatNumber}
                    className='px-3 py-1 bg-site-800 rounded-lg font-semibold text-sm print:px-2 print:py-0.5 print:text-xs seat-label-print'
                  >
                    {getSeatLabel(seatNumber)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='border-t border-site-700 pt-4 print:pt-2'>
            <div className='flex flex-col md:flex-row items-center gap-4 print:flex-row print:gap-3'>
              <div className='flex-shrink-0'>
                <div className='bg-white p-3 rounded-lg print:p-2'>
                  <QRCodeSVG 
                    value={qrUrl} 
                    size={140}
                    level='H'
                    includeMargin={false}
                    className='print:w-24 print:h-24'
                  />
                </div>
              </div>
              <div className='flex-1 text-center md:text-left print:text-left'>
                <h3 className='text-sm font-semibold mb-2 print:text-xs print:mb-1'>
                  Ihr Ticket-Code
                </h3>
                <p className='text-xs text-site-300 print:text-[10px] print:leading-tight'>
                  Bitte zeigen Sie diesen QR-Code am Eingang vor.
                </p>
              </div>
            </div>
          </div>

          <div className='border-t border-site-700 pt-4 print:pt-2'>
            <div className='text-xs text-site-300 space-y-1 print:text-[10px] print:space-y-0'>
              <p><strong>Buchungs-ID:</strong> {booking.id}</p>
              <p><strong>E-Mail:</strong> {booking.email}</p>
              <p><strong>Buchungsdatum:</strong> {new Date(booking.created_at).toLocaleString('de-DE')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-wrap gap-3 justify-center print:hidden'>
        <AddToCalendar
          eventTitle='Winterstück 2025: Schicksalsfäden'
          eventDescription='Kolping Jugend Winterstück 2025 - Schicksalsfäden'
          startDate={play.date}
          startTime={play.time}
          location='Klosterhof 7, 67305 Ramsen'
          seats={booking.seats.map(getSeatLabel)}
          bookingId={booking.id}
          name={booking.name}
          email={booking.email}
        />
        
        <button
          onClick={handlePrint}
          className='px-6 py-3 rounded-lg border border-site-700 hover:border-kolping-400 bg-site-800 transition-colors font-medium'
        >
          <span className='flex items-center gap-2'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' />
            </svg>
            Ticket drucken
          </span>
        </button>
        
        {isNewBooking && (
          <button
            onClick={() => router.push('/booking')}
            className='px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
          >
            Weitere Buchung
          </button>
        )}
        
        {!isNewBooking && booking.status !== 'cancelled' && (
          <>
            <a
              href={`/booking/view/${bookingId}/edit`}
              className='px-6 py-3 rounded-lg border border-site-700 hover:border-kolping-400 bg-site-800 transition-colors font-medium'
            >
              <span className='flex items-center gap-2'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                </svg>
                Buchung bearbeiten
              </span>
            </a>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className='px-6 py-3 rounded-lg border border-red-700 hover:bg-red-900/30 text-red-400 transition-colors font-medium'
            >
              <span className='flex items-center gap-2'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
                Buchung stornieren
              </span>
            </button>
          </>
        )}
      </div>

      {/* Important info */}
      <div className='mt-6 p-4 bg-site-800 rounded-lg text-sm text-site-100 print:mt-3 print:p-2 print:text-[10px] print:leading-tight'>
        <h3 className='font-semibold mb-2 print:mb-1 print:text-xs'>Wichtige Informationen:</h3>
        <ul className='space-y-1 list-disc list-inside print:space-y-0'>
          <li>Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn</li>
          <li>Die Platzreservierung ist verbindlich</li>
        </ul>
      </div>

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
              router.push('/booking')
            }
          }}
        />
      )}
    </div>
  )
}
