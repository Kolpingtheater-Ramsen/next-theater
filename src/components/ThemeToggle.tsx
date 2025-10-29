'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'pink'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'dark' || saved === 'light' || saved === 'pink') {
      setTheme(saved)
    } else {
      const prefersLight = window.matchMedia(
        '(prefers-color-scheme: light)'
      ).matches
      setTheme(prefersLight ? 'light' : 'dark')
    }
    setMounted(true)
  }, [])

  return (
    <button
      type='button'
      aria-label='Theme umschalten'
      className='px-3 py-1 rounded border border-site-700 hover:border-kolping-500 text-sm'
      onClick={() =>
        setTheme((t) => {
          const order: Theme[] = ['dark', 'light', 'pink']
          const i = order.indexOf(t)
          return order[(i + 1) % order.length]
        })
      }
    >
      {mounted ? (theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌸') : '🌓'}
    </button>
  )
}
