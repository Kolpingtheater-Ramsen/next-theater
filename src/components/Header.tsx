"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from '@/components/ProgressiveImage'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import {
  bookingHref,
  MAX_TIMEOUT_MS,
  shouldShowWinterRelease,
  WINTER_RELEASE_MS,
} from '@/lib/winter-release'

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const [ticketState, setTicketState] = useState({ live: false, preview: false })

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search)
      const next = shouldShowWinterRelease({
        previewValue: params.get('preview'),
        host: window.location.hostname,
      })
      setTicketState((current) =>
        current.live === next.live && current.preview === next.preview
          ? current
          : next,
      )
      return next
    }

    const current = sync()
    window.addEventListener('popstate', sync)

    let timer: number | undefined
    if (!current.live) {
      const delay = WINTER_RELEASE_MS - Date.now()
      if (delay > 0 && delay <= MAX_TIMEOUT_MS) {
        timer = window.setTimeout(() => {
          sync()
        }, delay + 250)
      }
    }

    return () => {
      window.removeEventListener('popstate', sync)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [pathname])

  const ticketsHref = bookingHref(ticketState.preview)

  return (
    <header className='sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-site-900/80 bg-site-900/95 border-b border-site-700'>
      <div className='mx-auto max-w-6xl px-4 py-3 flex items-center gap-4'>
        <Link href='/' className='flex items-center gap-2 font-semibold text-site-50 flex-1 min-w-0'>
          <Image
            src='/img/logo.png'
            alt=''
            aria-hidden='true'
            width={36}
            height={36}
            className='rounded-sm'
          />
          <span className='truncate'>Kolpingtheater Ramsen</span>
        </Link>
        <nav className='ml-auto hidden md:flex items-center gap-6 text-sm'>
          <Link href='/' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'>
            Home
          </Link>
          {ticketState.live && (
            <Link
              href={ticketsHref}
              className='font-semibold text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'
            >
              Tickets
            </Link>
          )}
          <Link href='/about' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'>
            Über uns
          </Link>
          <Link href='/team' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'>
            Team
          </Link>
          <Link href='/gallery' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'>
            Galerie
          </Link>
          <Link href='/contact' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors'>
            Kontakt
          </Link>
        </nav>

        {/* Theme toggle always visible on desktop, also visible on mobile outside the menu */}
        <div className='hidden md:block'>
          <ThemeToggle />
        </div>

        <div className='ml-auto md:hidden flex items-center gap-2'>
          <ThemeToggle />
          <button
            type='button'
            className='inline-flex items-center justify-center p-2 rounded-md border border-site-700 text-site-200 hover:text-kolping-400 hover:border-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400'
            aria-label='Menü umschalten'
            aria-expanded={isMobileOpen}
            aria-controls='mobile-menu'
            onClick={() => setIsMobileOpen((v) => !v)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='20'
              height='20'
              fill='currentColor'
              aria-hidden='true'
            >
              {isMobileOpen ? (
                <path d='M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z' />
              ) : (
                <path d='M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div id='mobile-menu' className='md:hidden border-t border-site-700'>
          <nav className='mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 text-sm'>
            <Link href='/' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Home
            </Link>
            {ticketState.live && (
              <Link
                href={ticketsHref}
                className='font-semibold text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors'
                onClick={() => setIsMobileOpen(false)}
              >
                Tickets
              </Link>
            )}
            <Link href='/about' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Über uns
            </Link>
            <Link href='/team' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Team
            </Link>
            <Link href='/gallery' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Galerie
            </Link>
            <Link href='/contact' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Kontakt
            </Link>
            <Link href='/impressum' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Impressum
            </Link>
            <Link href='/privacy' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded px-1 transition-colors' onClick={() => setIsMobileOpen(false)}>
              Datenschutz
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
