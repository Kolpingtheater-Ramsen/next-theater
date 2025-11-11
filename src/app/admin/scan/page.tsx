"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingWithSeats } from '@/types/database'
import { BrowserQRCodeReader } from '@zxing/browser'

export default function AdminScanPage() {
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null)
  const router = useRouter()

  // Initialize camera list
  useEffect(() => {
    let isMounted = true
    let fallbackDeviceChangeHandler: ((event: Event) => void) | null = null

    const updateCameraList = async (requestPermission = false) => {
      if (!navigator.mediaDevices?.enumerateDevices) {
        if (isMounted) {
          setError('Camera access is not supported on this device')
        }
        return
      }

      let stream: MediaStream | null = null

      try {
        if (requestPermission) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true })
        }

        const devices = await navigator.mediaDevices.enumerateDevices()
        if (!isMounted) return

        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setCameras(videoDevices)

        if (videoDevices.length === 0) {
          setSelectedCamera('')
          setError('No cameras found')
          return
        }

        setError('')
        setSelectedCamera(prevCamera => {
          if (prevCamera && videoDevices.some(device => device.deviceId === prevCamera)) {
            return prevCamera
          }

          const backCamera = videoDevices.find(device =>
            device.label?.toLowerCase().includes('back') || device.label?.toLowerCase().includes('rear')
          )

          return backCamera?.deviceId || videoDevices[0]?.deviceId || ''
        })
      } catch (err) {
        console.error('Error getting cameras:', err)
        if (isMounted) {
          const message = err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access to scan tickets.'
            : 'Unable to access cameras. Please check permissions.'
          setError(message)
        }
      } finally {
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }

    void updateCameraList(true)

    const mediaDevices = navigator.mediaDevices
    const handleDeviceChange = () => {
      void updateCameraList()
    }

    if (mediaDevices?.addEventListener) {
      mediaDevices.addEventListener('devicechange', handleDeviceChange)
    } else if (mediaDevices) {
      // Fallback for older browsers
      const originalHandler = mediaDevices.ondevicechange
      fallbackDeviceChangeHandler = event => {
        if (typeof originalHandler === 'function') {
          originalHandler.call(mediaDevices, event as Event)
        }
        handleDeviceChange()
      }
      mediaDevices.ondevicechange = fallbackDeviceChangeHandler
    }

    return () => {
      isMounted = false
      if (mediaDevices?.removeEventListener) {
        mediaDevices.removeEventListener('devicechange', handleDeviceChange)
      } else if (mediaDevices && mediaDevices.ondevicechange === fallbackDeviceChangeHandler) {
        mediaDevices.ondevicechange = null
      }
    }
  }, [])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
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
        setSuccessMessage('✅ Ticket checked in successfully!')
        setIsCheckedIn(true)
        setBooking({ ...booking, status: 'checked_in' })
        
        // Clear form after 2 seconds
        setTimeout(() => {
          setBooking(null)
          setSuccessMessage('')
          setIsCheckedIn(false)
        }, 2000)
      } else {
        setError(data.error || 'Check-in failed')
      }
    } catch (err) {
      console.error('Error checking in:', err)
      setError('Check-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / 10)
    const seatInRow = seatNumber % 10
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  const startCamera = async () => {
    if (!selectedCamera) {
      setError('No camera selected')
      return
    }

    try {
      setIsCameraActive(true)
      setError('')
      
      const codeReader = new BrowserQRCodeReader()
      codeReaderRef.current = codeReader

      await codeReader.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current!,
        (result, err) => {
          if (result) {
            const text = result.getText()
            stopCamera()
            // Auto-scan after QR code detected
            const extractedId = extractBookingIdFromUrl(text)
            if (extractedId) {
              handleScanWithId(extractedId)
            } else {
              setError('Invalid QR code format')
            }
          }
          if (err && !(err as Error).name?.includes('NotFoundException')) {
            console.error('QR Scan error:', err)
          }
        }
      )
    } catch (err) {
      console.error('Error starting camera:', err)
      setError('Failed to start camera. Please check permissions.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset()
      } catch (err) {
        console.error('Error resetting QR code reader:', err)
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      codeReaderRef.current = null
    }
    setIsCameraActive(false)
  }

  const handleScanWithId = async (extractedId: string) => {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setBooking(null)
    setIsCheckedIn(false)

    try {
      // Fetch booking details
      const response = await fetch(`/api/bookings/${extractedId}`, {
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
        setError(data.error || 'Booking not found')
      }
    } catch (err) {
      console.error('Error fetching booking:', err)
      setError('Failed to fetch booking')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <h1 className='font-display text-3xl md:text-4xl font-bold mb-2'>
            Ticket Scanner
          </h1>
          <p className='text-site-100'>
            Scan QR codes to validate tickets
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
        
        {!isCameraActive ? (
          <div>
            {cameras.length > 0 && (
              <div className='mb-4'>
                <label htmlFor='camera-select' className='block text-sm font-medium mb-2'>
                  Select Camera
                </label>
                <select
                  id='camera-select'
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className='w-full px-4 py-2 rounded-lg bg-site-800 border border-site-700 text-site-50 focus:outline-none focus:ring-2 focus:ring-kolping-400'
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={startCamera}
              disabled={cameras.length === 0}
              className='w-full px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              {cameras.length === 0 ? 'No cameras found' : 'Start Camera'}
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='relative bg-black rounded-lg overflow-hidden'>
              <video
                ref={videoRef}
                className='w-full h-auto max-h-96 object-contain'
                autoPlay
                playsInline
              />
              <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute inset-0 border-2 border-kolping-400 m-12 rounded-lg' />
              </div>
            </div>
            <button
              onClick={stopCamera}
              className='w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors'
            >
              Stop Camera
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

      {/* Booking Details */}
      {booking && (
        <div className='glass rounded-xl overflow-hidden'>
          <div className={`p-6 ${isCheckedIn ? 'bg-green-900/30' : 'bg-blue-900/30'}`}>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-display font-bold'>
                Booking Details
              </h2>
              {isCheckedIn ? (
                <span className='px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold'>
                  ✓ Checked In
                </span>
              ) : (
                <span className='px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold'>
                  Pending
                </span>
              )}
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <p className='text-xs text-site-300 mb-1'>Name</p>
                <p className='text-lg font-semibold'>{booking.name}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Email</p>
                <p className='text-sm text-site-100'>{booking.email}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Show</p>
                <p className='text-sm'>{booking.play?.display_date || 'N/A'}</p>
              </div>
              <div>
                <p className='text-xs text-site-300 mb-1'>Seats ({booking.seats.length})</p>
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
                <strong>Booking ID:</strong> {booking.id}
              </p>
              <p className='text-xs text-site-300'>
                <strong>Booked:</strong> {new Date(booking.created_at).toLocaleString('de-DE')}
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
                {isLoading ? 'Checking in...' : 'Check In Ticket'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 glass rounded-xl p-6'>
        <h3 className='font-semibold mb-3'>How to use:</h3>
        <ul className='space-y-2 text-sm text-site-100'>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>1.</span>
            <span>Click &quot;Start Camera&quot; to activate the scanner</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>2.</span>
            <span>Have the guest show their QR code ticket</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>3.</span>
            <span>Point the camera at the QR code</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>4.</span>
            <span>Scanner will automatically detect and load the booking</span>
          </li>
          <li className='flex gap-2'>
            <span className='text-kolping-400'>5.</span>
            <span>Click &quot;Check In Ticket&quot; to confirm</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

