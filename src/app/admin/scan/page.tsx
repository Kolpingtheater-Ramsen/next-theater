"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingWithSeats } from '@/types/database'
import { flushSync } from 'react-dom'
import { extractAdminTicketCode } from '@/lib/admin-ticket-code'
import { Html5Qrcode } from 'html5-qrcode'

export default function AdminScanPage() {
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isScannerActive, setIsScannerActive] = useState(false)
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [showEmail, setShowEmail] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const router = useRouter()
  const [manualCode, setManualCode] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (scannerRef.current?.isScanning) void scannerRef.current.stop().catch(() => {})
    }
  }, [])

  const handleCheckIn = async () => {
    if (!booking) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bookingId: booking.id }),
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setSuccessMessage('✅ Ticket erfolgreich eingecheckt!')
        setIsCheckedIn(true)
        setBooking({ ...booking, status: 'checked_in' })
        
        // Clear form after 2 seconds
        setTimeout(() => {
          setBooking(null)
          setSuccessMessage('')
          setIsCheckedIn(false)
        }, 2000)
      } else {
        setError(data.error || 'Check-In fehlgeschlagen')
      }
    } catch (err) {
      console.error('Error checking in:', err)
      setError('Check-In fehlgeschlagen')
    } finally {
      setIsLoading(false)
    }
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

  const fetchBooking = useCallback(async (bookingId: string) => {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setBooking(null)
    setIsCheckedIn(false)
    setShowEmail(false)

    try {
      const response = await fetch(`/api/admin/tickets?code=${encodeURIComponent(bookingId)}`, {
        credentials: 'include'
      })
      
      if (response.status === 401) {
        router.push('/admin')
        return
      }
      
      const data = await response.json() as { success: boolean; booking?: BookingWithSeats; error?: string }
      
      if (data.success && data.booking) {
        setBooking(data.booking)
        setIsCheckedIn(data.booking.status === 'checked_in')
      } else {
        setError(data.error || 'Buchung nicht gefunden')
      }
    } catch (err) {
      console.error('Error fetching booking:', err)
      setError('Fehler beim Laden der Buchung')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop()
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
    scannerRef.current = null
    setIsScannerActive(false)
  }, [])

  const startScanner = useCallback(async () => {
    if (isStarting || isScannerActive) return
    setIsStarting(true)
    setError('')
    setSuccessMessage('')
    setBooking(null)
    setIsCheckedIn(false)
    try {
      let cameraId = selectedCamera
      if (!cameraId) {
        const devices = await Html5Qrcode.getCameras()
        if (!mounted.current) return
        if (!devices.length) throw new Error('NotFoundError')
        setCameras(devices.map((device, index) => ({ id: device.id, label: device.label || `Kamera ${index + 1}` })))
        cameraId = (devices.find(device => /back|rear|rück/i.test(device.label)) || devices[0]).id
        setSelectedCamera(cameraId)
      }
      if (!mounted.current) return
      flushSync(() => setIsScannerActive(true))
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback - QR code detected
          const bookingId = extractAdminTicketCode(decodedText)

          if (!bookingId) {
            // Invalid QR code format - stop scanner and show error
            void stopScanner()
            setError('Ungültiges QR-Code-Format')
            return
          }

          // Stop scanner and fetch booking
          void stopScanner()
          void fetchBooking(bookingId)
        },
        () => {
          // Error callback - no QR code found (this is normal, ignore)
        }
      )
      if (!mounted.current && scanner.isScanning) await scanner.stop()
    } catch (err) {
      if (!mounted.current) return
      
      let errorMessage = 'Kamera konnte nicht gestartet werden.'
      
      if (err instanceof Error) {
        if (err.message.includes('NotAllowedError') || err.message.includes('Permission')) {
          errorMessage = 'Kamerazugriff verweigert. Bitte erlauben Sie den Kamerazugriff in den Browsereinstellungen.'
        } else if (err.message.includes('NotFoundError')) {
          errorMessage = 'Keine Kamera gefunden. Bitte überprüfen Sie, ob eine Kamera angeschlossen ist.'
        } else if (err.message.includes('NotReadableError')) {
          errorMessage = 'Kamera wird bereits verwendet oder ist nicht verfügbar.'
        } else if (err.message.includes('not found')) {
          errorMessage = 'Scanner-Element konnte nicht geladen werden. Bitte laden Sie die Seite neu.'
        }
      }
      
      setError(errorMessage)
      setIsScannerActive(false)
      scannerRef.current = null
    } finally { if (mounted.current) setIsStarting(false) }
  }, [selectedCamera, fetchBooking, stopScanner, isStarting, isScannerActive])


  return (
    <div className='max-w-2xl mx-auto'>
      <header className='admin-heading'>
        <div><h1>Einlass</h1><p>Ticket scannen, Plätze prüfen und den Gast einchecken.</p></div>
      </header>

      {/* Camera Scanner */}
      <div className='glass rounded-xl p-6 mb-6'>
        {!isScannerActive ? (
          <div>
            {cameras.length > 0 && (
              <div className='mb-4'>
                <label htmlFor='camera-select' className='block text-sm font-medium mb-2'>
                  Kamera auswählen
                </label>
                <select
                  id='camera-select'
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className='w-full px-4 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 focus:outline-none focus:ring-2 focus:ring-kolping-400'
                >
                  {cameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={() => void startScanner()}
              disabled={isStarting}
              className='w-full px-6 py-4 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              {isStarting ? 'Kamera wird gestartet …' : 'Kamera starten'}
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            <div id='qr-reader' className='rounded-lg overflow-hidden' />
            <button
              onClick={() => void stopScanner()}
              className='w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors'
            >
              Kamera stoppen
            </button>
          </div>
        )}
      </div>

      <form className='glass rounded-xl p-6 mb-6' onSubmit={async event => {
        event.preventDefault()
        const code = extractAdminTicketCode(manualCode)
        if (!code) { setError('Bitte einen gültigen Ticketlink oder Einlasscode eingeben.'); return }
        await stopScanner()
        await fetchBooking(code)
      }}>
        <label htmlFor='manual-ticket' className='font-semibold'>Ticket ohne Kamera öffnen</label>
        <p className='admin-muted mt-1'>Ticketlink oder Einlasscode einfügen.</p>
        <div className='admin-scan-input'>
          <input id='manual-ticket' value={manualCode} onChange={event => setManualCode(event.target.value)}
            autoComplete='off' autoCapitalize='none' spellCheck={false} placeholder='Ticketlink oder KTR1:…' />
          <button type='submit' className='admin-button' disabled={isLoading || isStarting || !manualCode.trim()}>Ticket öffnen</button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className='glass rounded-xl p-4 mb-6 border border-red-700 bg-red-900/20'>
          <div className='flex items-center gap-3'>
            <svg className='w-6 h-6 text-red-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
            <p role='alert' className='text-red-400'>{error}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className='glass rounded-xl p-4 mb-6 border border-green-700 bg-green-900/20'>
          <div className='flex items-center gap-3'>
            <svg className='w-6 h-6 text-green-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <p role='status' className='text-green-400 font-semibold'>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Restart scanner button after scan */}
      {!isScannerActive && (booking || error) && (
        <div className='mb-6'>
          <button
            onClick={() => void startScanner()}
            className='w-full px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors'
          >
            Kamera für nächsten Scan starten
          </button>
        </div>
      )}

      {/* Booking Details */}
      {booking && (
        <div className='glass rounded-xl overflow-hidden'>
          {/* Cancelled Banner */}
          {booking.status === 'cancelled' && (
            <div className='bg-red-600 text-white py-6 px-6 text-center border-b-4 border-red-700'>
              <div className='flex items-center justify-center gap-3 mb-2'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M6 18L18 6M6 6l12 12' />
                </svg>
                <h3 className='text-3xl md:text-4xl font-bold uppercase tracking-wider'>
                  Storniert
                </h3>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <p className='text-red-100 text-sm font-semibold'>
                Dieses Ticket wurde storniert und ist nicht gültig
              </p>
            </div>
          )}
          
          <div className={`p-6 ${booking.status === 'cancelled' ? 'bg-red-900/30' : isCheckedIn ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-display font-bold'>
                Buchungsdetails
              </h2>
              {booking.status === 'cancelled' ? (
                <span className='px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold'>
                  ✗ Storniert
                </span>
              ) : isCheckedIn ? (
                <span className='px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold'>
                  ✓ Eingecheckt
                </span>
              ) : (
                <span className='px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold'>
                  Ausstehend
                </span>
              )}
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p className='text-xs text-site-300 mb-1'>Name</p>
                <p className='text-lg font-semibold'>{booking.name}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>E-Mail</p>
                <div className='flex items-center gap-2'>
                  <p className='text-sm text-site-100'>
                    {showEmail ? booking.email : maskEmail(booking.email)}
                  </p>
                  <button
                    onClick={() => setShowEmail(!showEmail)}
                    className='text-site-400 hover:text-site-200 transition-colors p-1'
                    title={showEmail ? 'E-Mail verbergen' : 'E-Mail anzeigen'}
                  >
                    {showEmail ? (
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.405 3.214 1.122 4.588M6.29 6.29L3 3m3.29 3.29l3.29 3.29m7.532 7.532l3.29 3.29M21 21l-3.29-3.29m0 0A9.97 9.97 0 0019 12a9.97 9.97 0 00-1.122-4.588M17.71 17.71L21 21m-3.29-3.29l-3.29-3.29' />
                      </svg>
                    ) : (
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Vorstellung</p>
                <p className='text-sm'>{booking.play?.display_date || 'N/A'}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Plätze ({booking.seats.length})</p>
                <div className='flex flex-wrap gap-1'>
                  {[...booking.seats].sort((a, b) => a - b).map((seat) => (
                    <span key={seat} className='px-2 py-1 bg-site-700 rounded text-sm font-semibold'>
                      {getSeatLabel(seat)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className='mt-4 pt-4 border-t border-site-700'>
              <p className='text-xs text-site-300'>
                <strong>Buchungs-ID:</strong> {booking.id}
              </p>
              <p className='text-xs text-site-300'>
                <strong>Gebucht:</strong> {new Date(booking.created_at).toLocaleString('de-DE')}
              </p>
            </div>
          </div>

          {!isCheckedIn && booking.status !== 'cancelled' && (
            <div className='p-6'>
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className='w-full px-6 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-colors disabled:opacity-50'
              >
                {isLoading ? 'Checke ein...' : 'Ticket einchecken'}
              </button>
            </div>
          )}
        </div>
      )}

      <p className='admin-muted mt-6'>Die Kamera wird erst nach deinem Klick aktiviert. Ein Ticket wird erst mit „Ticket einchecken“ als eingelassen markiert.</p>
    </div>
  )
}
