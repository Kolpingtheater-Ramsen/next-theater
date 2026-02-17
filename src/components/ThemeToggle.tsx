'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) {
      setTheme(saved)
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])

  return (
    <button
      type='button'
      aria-label='Theme umschalten'
      className='px-3 py-1 rounded border border-site-700 hover:border-kolping-500 text-sm'
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌓'}
    </button>
  )
}
