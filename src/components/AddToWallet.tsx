"use client"

import { useState, useEffect } from 'react'

type AddToWalletProps = {
  eventTitle: string
  eventDescription: string
  startDate: string // ISO date string
  startTime: string // HH:MM format
  location: string
  seats: string[]
  bookingId: string
  name: string
  email: string
}

export default function AddToWallet({
  startDate,
  startTime,
  seats,
  bookingId,
  name,
  email,
}: AddToWalletProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else if (/android/.test(userAgent)) {
      setPlatform('android')
    } else {
      setPlatform('other')
    }
  }, [])

  const handleAddToAppleWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      // Convert seat labels back to numbers for API
      const seatNumbers = seats.map(label => {
        const row = label.charCodeAt(0) - 65
        const seatInRow = parseInt(label.substring(1)) - 1
        return row * 10 + seatInRow
      })

      const response = await fetch('/api/wallet/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          name,
          email,
          playDate: startDate,
          playTime: startTime,
          seats: seatNumbers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.setupRequired) {
          setError('Apple Wallet ist noch nicht konfiguriert. Bitte kontaktieren Sie den Administrator.')
        } else {
          setError('Fehler beim Erstellen des Wallet-Passes')
        }
        setLoading(false)
        return
      }

      // Download the .pkpass file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `winterstück-${bookingId}.pkpass`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error adding to Apple Wallet:', err)
      setError('Fehler beim Erstellen des Wallet-Passes')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToGoogleWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      // Convert seat labels back to numbers for API
      const seatNumbers = seats.map(label => {
        const row = label.charCodeAt(0) - 65
        const seatInRow = parseInt(label.substring(1)) - 1
        return row * 10 + seatInRow
      })

      const response = await fetch('/api/wallet/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          name,
          email,
          playDate: startDate,
          playTime: startTime,
          seats: seatNumbers,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.setupRequired) {
          setError('Google Wallet ist noch nicht konfiguriert. Bitte kontaktieren Sie den Administrator.')
        } else {
          setError('Fehler beim Erstellen des Wallet-Passes')
        }
        setLoading(false)
        return
      }

      // Redirect to Google Wallet
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (err) {
      console.error('Error adding to Google Wallet:', err)
      setError('Fehler beim Erstellen des Wallet-Passes')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWallet = () => {
    if (platform === 'ios') {
      handleAddToAppleWallet()
    } else if (platform === 'android') {
      handleAddToGoogleWallet()
    } else {
      // On desktop, show both options
      if (confirm('Möchten Sie zu Apple Wallet (OK) oder Google Wallet (Abbrechen) hinzufügen?')) {
        handleAddToAppleWallet()
      } else {
        handleAddToGoogleWallet()
      }
    }
  }

  const getButtonText = () => {
    switch (platform) {
      case 'ios':
        return 'Zu Apple Wallet hinzufügen'
      case 'android':
        return 'Zu Google Wallet hinzufügen'
      default:
        return 'Zu Wallet hinzufügen'
    }
  }

  const getIcon = () => {
    switch (platform) {
      case 'ios':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'/>
          </svg>
        )
      case 'android':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/>
          </svg>
        )
      default:
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/>
          </svg>
        )
    }
  }

  return (
    <div>
      <button
        onClick={handleAddToWallet}
        disabled={loading}
        className='px-6 py-3 rounded-lg border border-site-700 hover:border-kolping-400 bg-site-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span className='flex items-center gap-2'>
          {loading ? (
            <>
              <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
              <span>Wird erstellt...</span>
            </>
          ) : (
            <>
              {getIcon()}
              {getButtonText()}
            </>
          )}
        </span>
      </button>
      {error && (
        <p className='text-red-400 text-sm mt-2'>{error}</p>
      )}
    </div>
  )
}
