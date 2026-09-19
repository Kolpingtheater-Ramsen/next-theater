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
        router.replace('/admin/dashboard')
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
    <div className='admin-login'>
      <div className='admin-login-card'>
        <div className='admin-login-art' aria-hidden='true' />
        <div className='admin-login-content'>
          <p className='admin-eyebrow'>Kolpingtheater Ramsen</p>
          <h1>Hinter den Kulissen</h1>
          <p className='admin-muted'>Buchungen, Aufführungen und Einlass verwalten.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='password'>Admin-Passwort</label>
            <div className='admin-password'>
              <input id='password' name='password' type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} autoComplete='current-password' required autoFocus
                aria-describedby={error ? 'login-error' : undefined} aria-invalid={!!error} />
              <button type='button' onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'} aria-pressed={showPassword}>
                {showPassword ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>
            {error && <p id='login-error' role='alert' className='admin-error'>{error}</p>}
            <button type='submit' disabled={isLoading} className='admin-button admin-button-primary admin-login-submit'>
              {isLoading ? 'Anmelden …' : 'Zur Verwaltung'}
            </button>
          </form>
          <a href='/booking' className='admin-login-back'>← Zur Ticketseite</a>
        </div>
      </div>
    </div>
  )
}
