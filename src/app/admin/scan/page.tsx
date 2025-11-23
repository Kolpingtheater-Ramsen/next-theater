"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingWithSeats } from '@/types/database'
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
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const router = useRouter()

  // Get available cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        console.log('=== Detected Cameras ===')
        console.log(`Total cameras found: ${devices.length}`)
        devices.forEach((device, index) => {
          console.log(`Camera ${index + 1}:`)
          console.log(`  ID: ${device.id}`)
          console.log(`  Label: ${device.label}`)
          console.log(`  Full device:`, device)
        })
        console.log('=======================')
        
        if (devices && devices.length > 0) {
          const cameraList = devices.map((device, index) => ({
            id: device.id,
            label: device.label || `Kamera ${index + 1} (${device.id.substring(0, 12)}...)`
          }))
          setCameras(cameraList)
          
          // Select back camera by default if available
          const backCamera = devices.find((device) =>
            device.label?.toLowerCase().includes('back') ||
            device.label?.toLowerCase().includes('rear') ||
            device.label?.toLowerCase().includes('rück')
          )
          
          const selectedId = backCamera?.id || devices[0].id
          setSelectedCamera(selectedId)
          console.log(`Selected camera by default: ${backCamera?.label || devices[0].label} (ID: ${selectedId})`)
        } else {
          setError('Keine Kameras gefunden')
        }
      })
      .catch((err) => {
        console.error('Error getting cameras:', err)
        setError('Fehler beim Laden der Kameras')
      })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {
          // Ignore errors during cleanup
        })
      }
    }
  }, [])

  const extractBookingIdFromUrl = (url: string): string | null => {
    try {
      // Handle full URLs like: https://example.com/booking/view/booking-123?new=true
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      const bookingIndex = pathParts.indexOf('view')
      if (bookingIndex !== -1 && pathParts[bookingIndex + 1]) {
        return pathParts[bookingIndex + 1]
      }
      
      // Handle just booking IDs
      if (url.startsWith('booking-')) {
        return url
      }
      
      return null
    } catch {
      // Not a URL, check if it's a booking ID
      if (url.startsWith('booking-')) {
        return url
      }
      return null
    }
  }

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

  const fetchBooking = useCallback(async (bookingId: string) => {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setBooking(null)
    setIsCheckedIn(false)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
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
    if (!selectedCamera) {
      setError('Keine Kamera ausgewählt')
      return
    }

    // Clear all state before starting
    setError('')
    setSuccessMessage('')
    setBooking(null)
    setIsCheckedIn(false)
    setIsScannerActive(true)

    // Wait for DOM to update and element to be available
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      const element = document.getElementById('qr-reader')
      if (!element) {
        throw new Error('Scanner element not found in DOM')
      }

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback - QR code detected
          const bookingId = extractBookingIdFromUrl(decodedText)

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
    } catch (err) {
      console.error('Error starting scanner:', err)
      
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
    }
  }, [selectedCamera, fetchBooking, stopScanner])


  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
            Ticket-Scanner
          </h1>
          <p className='text-site-100'>
            QR-Codes scannen um Tickets zu validieren
          </p>
        </div>
        <a
          href='/admin/dashboard'
          className='px-4 py-2 rounded-lg border border-site-700 hover:border-site-600 bg-site-800 transition-colors text-sm'
        >
          ← Dashboard
        </a>
      </div>

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
              disabled={cameras.length === 0}
              className='w-full px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              {cameras.length === 0 ? 'Keine Kameras gefunden' : 'Kamera starten'}
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

      {/* Error */}
      {error && (
        <div className='glass rounded-xl p-4 mb-6 border border-red-700 bg-red-900/20'>
          <div className='flex items-center gap-3'>
            <svg className='w-6 h-6 text-red-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
            <p className='text-red-400'>{error}</p>
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
            <p className='text-green-400 font-semibold'>{successMessage}</p>
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
          <div className={`p-6 ${isCheckedIn ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-display font-bold'>
                Buchungsdetails
              </h2>
              {isCheckedIn ? (
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
                <p className='text-sm text-site-100'>{booking.email}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Vorstellung</p>
                <p className='text-sm'>{booking.play?.display_date || 'N/A'}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Plätze ({booking.seats.length})</p>
                <div className='flex flex-wrap gap-1'>
                  {booking.seats.sort((a, b) => a - b).map((seat) => (
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

          {!isCheckedIn && (
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

      {/* Instructions */}
      <div className='mt-6 glass rounded-xl p-6'>
        <h3 className='font-semibold mb-3'>So funktioniert&apos;s:</h3>
        <ul className='space-y-2 text-sm text-site-100'>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>1.</span>
            <span>Klicken Sie auf &quot;Kamera starten&quot;, um den Scanner zu aktivieren</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>2.</span>
            <span>Lassen Sie den Gast sein QR-Code-Ticket zeigen</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>3.</span>
            <span>Richten Sie die Kamera auf den QR-Code</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>4.</span>
            <span>Der Scanner erkennt automatisch den Code und lädt die Buchung</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>5.</span>
            <span>Klicken Sie auf &quot;Ticket einchecken&quot; zum Bestätigen</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
