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

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/booking/view/${booking.id}`
    : ''

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8 text-center print:mb-4'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 mb-4 print:hidden'>
          <svg className='w-8 h-8 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h1 className='font-display text-3xl md:text-4xl font-bold mb-2 print:text-2xl'>
          Buchung bestätigt!
        </h1>
        <p className='text-site-100 print:text-sm print:hidden'>
          Eine Bestätigung wurde an {email} gesendet.
        </p>
      </div>

      {/* Ticket */}
      <div className='glass rounded-xl overflow-hidden mb-6 print:shadow-none print:mb-0'>
        <div className='bg-gradient-to-r from-kolping-500 to-kolping-600 text-white p-4 md:p-6 print:p-3'>
          <h2 className='font-display text-xl md:text-2xl font-bold mb-1 print:text-lg'>
            Winterstück 2025
          </h2>
          <p className='text-base md:text-lg print:text-sm'>&bdquo;Schicksalfäden&ldquo;</p>
        </div>

        <div className='p-4 md:p-6 space-y-4 print:p-3 print:space-y-2'>
          <div className='grid md:grid-cols-2 gap-4 print:gap-2'>
            <div>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>Vorstellung</h3>
              <p className='text-base font-medium print:text-sm'>{play.displayDate}</p>
            </div>

            <div>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>Name</h3>
              <p className='text-base font-medium print:text-sm'>{name}</p>
            </div>

            <div className='md:col-span-2'>
              <h3 className='text-xs font-semibold text-site-300 mb-1'>
                Sitzplätze ({booking.seats.length})
              </h3>
              <div className='flex flex-wrap gap-2'>
                {booking.seats.sort((a, b) => a - b).map((seatNumber) => (
                  <span
                    key={seatNumber}
                    className='px-3 py-1 bg-site-800 rounded-lg font-semibold text-sm print:px-2 print:py-0.5 print:text-xs'
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
                  Bitte zeigen Sie diesen QR-Code am Eingang vor. Sie können diese Seite ausdrucken oder einen Screenshot machen.
                </p>
              </div>
            </div>
          </div>

          <div className='border-t border-site-700 pt-4 print:pt-2'>
            <div className='text-xs text-site-300 space-y-1 print:text-[10px] print:space-y-0'>
              <p><strong>Buchungs-ID:</strong> {booking.id}</p>
              <p><strong>E-Mail:</strong> {email}</p>
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

      <div className='mt-6 p-4 bg-site-800 rounded-lg text-sm text-site-100 print:mt-3 print:p-2 print:text-[10px] print:leading-tight'>
        <h3 className='font-semibold mb-2 print:mb-1 print:text-xs'>Wichtige Informationen:</h3>
        <ul className='space-y-1 list-disc list-inside print:space-y-0'>
          <li>Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn</li>
          <li>Der Einlass erfolgt nur mit gültigem QR-Code</li>
          <li>Die Platzreservierung ist verbindlich</li>
        </ul>
      </div>
      
      <div className='mt-4 p-3 glass rounded-lg text-xs text-site-200 print:hidden'>
        <p className='mb-2'>
          <strong>Tipp:</strong> Sie können Ihr Ticket jederzeit über den QR-Code aufrufen.
        </p>
        <p className='text-site-300'>
          Scannen Sie den QR-Code oder besuchen Sie:{' '}
          <a href={qrUrl} className='text-kolping-400 hover:underline break-all'>
            {qrUrl}
          </a>
        </p>
      </div>
    </div>
  )
}
