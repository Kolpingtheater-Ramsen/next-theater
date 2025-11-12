"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-lg bg-site-800 border border-site-700 text-site-50 placeholder-site-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 transition-colors'
                placeholder='Admin-Passwort eingeben'
                required
                autoFocus
              />
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

