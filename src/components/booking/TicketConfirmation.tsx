"use client"

import { QRCodeSVG } from 'qrcode.react'
import type { Booking } from '@/app/booking/page'
import type { Play } from '@/app/booking/page'

type TicketConfirmationProps = {
  booking: Booking
  play: Play
  name: string
  email: string
  onNewBooking: () => void
}

export default function TicketConfirmation({
  booking,
  play,
  name,
  email,
  onNewBooking,
}: TicketConfirmationProps) {
  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / 10)
    const seatInRow = seatNumber % 10
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  const qrData = JSON.stringify({
    bookingId: booking.id,
    playId: booking.playId,
    name,
    email,
    seats: booking.seats,
    timestamp: booking.timestamp,
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 mb-4'>
          <svg className='w-8 h-8 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
          Buchung bestätigt!
        </h1>
        <p className='text-site-100'>
          Eine Bestätigung wurde an {email} gesendet.
        </p>
      </div>

      {/* Ticket */}
      <div className='glass rounded-xl overflow-hidden mb-6 print:shadow-none'>
        <div className='bg-gradient-to-r from-kolping-500 to-kolping-600 text-white p-6'>
          <h2 className='font-display text-2xl font-bold mb-1'>
            Winterstück 2025
          </h2>
          <p className='text-lg'>&bdquo;Schicksalfäden&ldquo;</p>
        </div>

        <div className='p-6 md:p-8 space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-sm font-semibold text-site-300 mb-2'>Vorstellung</h3>
              <p className='text-lg font-medium'>{play.displayDate}</p>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-site-300 mb-2'>Name</h3>
              <p className='text-lg font-medium'>{name}</p>
            </div>

            <div className='md:col-span-2'>
              <h3 className='text-sm font-semibold text-site-300 mb-2'>
                Sitzplätze ({booking.seats.length})
              </h3>
              <div className='flex flex-wrap gap-2'>
                {booking.seats.sort((a, b) => a - b).map((seatNumber) => (
                  <span
                    key={seatNumber}
                    className='px-4 py-2 bg-site-800 rounded-lg font-semibold'
                  >
                    {getSeatLabel(seatNumber)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='border-t border-site-700 pt-6'>
            <div className='flex flex-col items-center'>
              <div className='mb-3'>
                <h3 className='text-sm font-semibold text-site-300 text-center mb-3'>
                  Ihr Ticket-Code
                </h3>
                <div className='bg-white p-4 rounded-lg'>
                  <QRCodeSVG 
                    value={qrData} 
                    size={200}
                    level='H'
                    includeMargin={true}
                  />
                </div>
              </div>
              <p className='text-xs text-site-300 text-center max-w-md'>
                Bitte zeigen Sie diesen QR-Code am Eingang vor. 
                Sie können diese Seite ausdrucken oder einen Screenshot machen.
              </p>
            </div>
          </div>

          <div className='border-t border-site-700 pt-6'>
            <div className='text-xs text-site-300 space-y-2'>
              <p><strong>Buchungs-ID:</strong> {booking.id}</p>
              <p><strong>Buchungsdatum:</strong> {new Date(booking.timestamp).toLocaleString('de-DE')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-wrap gap-3 justify-center print:hidden'>
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
        <button
          onClick={onNewBooking}
          className='px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
        >
          Weitere Buchung
        </button>
      </div>

      <div className='mt-8 p-4 bg-site-800 rounded-lg text-sm text-site-100'>
        <h3 className='font-semibold mb-2'>Wichtige Informationen:</h3>
        <ul className='space-y-1 list-disc list-inside'>
          <li>Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn</li>
          <li>Der Einlass erfolgt nur mit gültigem QR-Code</li>
          <li>Die Platzreservierung ist verbindlich</li>
          <li>Bei Fragen wenden Sie sich bitte an unser Team vor Ort</li>
        </ul>
      </div>
    </div>
  )
}
