"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='glass rounded-xl p-8'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-kolping-500/20 mb-4'>
              <svg className='w-8 h-8 text-kolping-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h1 className='font-display text-3xl font-bold mb-2'>
              Admin-Anmeldung
            </h1>
            <p className='text-site-100'>
              Theater-Buchungssystem
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='password' className='block text-sm font-medium mb-2'>
                Admin-Passwort
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 pr-12 rounded-lg bg-site-800 border border-site-700 text-site-50 placeholder-site-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 transition-colors'
                  placeholder='Admin-Passwort eingeben'
                  required
                  autoFocus
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-site-400 hover:text-site-200 transition-colors focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded p-1'
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.405 3.214 1.122 4.588M6.29 6.29L3 3m3.29 3.29l3.29 3.29m7.532 7.532l3.29 3.29M21 21l-3.29-3.29m0 0A9.97 9.97 0 0019 12a9.97 9.97 0 00-1.122-4.588M17.71 17.71L21 21m-3.29-3.29l-3.29-3.29' />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className='p-3 rounded-lg bg-red-900/20 border border-red-700'>
                <p className='text-sm text-red-400'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <div className='mt-6 pt-6 border-t border-site-700 text-center'>
            <a
              href='/booking'
              className='text-sm text-site-100 hover:text-kolping-400 transition-colors'
            >
              ← Zurück zur Buchung
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

