'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const pages = [
  { href: '/admin/dashboard', label: 'Buchungen' },
  { href: '/admin/scan', label: 'Einlass' },
  { href: '/admin/history', label: 'Einlassverlauf' },
  { href: '/admin/analytics', label: 'Auswertung' },
]

export default function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (pathname === '/admin') return null

  async function logout() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
      if (!response.ok) throw new Error('logout')
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Abmelden fehlgeschlagen. Bitte erneut versuchen.')
    } finally { setBusy(false) }
  }

  return (
    <div className='admin-navigation'>
      <div className='admin-navigation-top'>
        <Link href='/admin/dashboard' className='admin-brand'><span aria-hidden='true' />Theaterverwaltung</Link>
        <button type='button' onClick={logout} disabled={busy} className='admin-button admin-button-quiet'>
          {busy ? 'Abmelden …' : 'Abmelden'}
        </button>
      </div>
      <nav aria-label='Theaterverwaltung' className='admin-tabs'>
        {pages.map(page => <Link key={page.href} href={page.href} aria-current={pathname === page.href ? 'page' : undefined}>{page.label}</Link>)}
      </nav>
      {error && <p role='alert' className='admin-error'>{error}</p>}
    </div>
  )
}
