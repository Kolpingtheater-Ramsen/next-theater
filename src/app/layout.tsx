import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import { ViewTransitions } from '@/components/ViewTransitions'
import { Geist, Geist_Mono, Cinzel } from 'next/font/google'
import './globals.css'

// @ts-expect-error - Font loader type issue
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// @ts-expect-error - Font loader type issue
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// @ts-expect-error - Font loader type issue
const display = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Kolpingtheater Ramsen',
  description:
    'Leidenschaft für Theater unter freiem Himmel – Erlebe unsere bewegenden Eigenproduktionen in Ramsen.',
  metadataBase: new URL('https://kolpingtheater-ramsen.de'),
  openGraph: {
    title: 'Kolpingtheater Ramsen',
    description:
      'Leidenschaft für Theater unter freiem Himmel – Erlebe unsere bewegenden Eigenproduktionen in Ramsen.',
    type: 'website',
    images: ['/img/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Kolpingtheater Ramsen',
    description:
      'Leidenschaft für Theater unter freiem Himmel – Erlebe unsere bewegenden Eigenproduktionen in Ramsen.',
    images: ['/img/logo.png'],
  },
  icons: {
    icon: ['/favicon.svg'],
    apple: ['/img/logo.png'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='de' data-theme='dark' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased bg-site-900 text-site-50 min-h-screen overflow-x-hidden flex flex-col`}
      >
        <ViewTransitions />
        <Header />
        <main className='mx-auto max-w-7xl px-4 py-8 flex-1 w-full'>{children}</main>
        <footer className='sticky bottom-0 border-t border-site-700 py-8 text-sm text-site-300 bg-site-900 backdrop-blur supports-[backdrop-filter]:bg-site-900/95'>
          <div className='mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4'>
            <span>
              © {new Date().getFullYear()} Kolping-Open-Air-Theater Ramsen
            </span>
            <div className='flex items-center gap-4'>
              <Link href='/contact' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors hidden md:inline'>
                Kontakt
              </Link>
              <Link href='/impressum' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors hidden md:inline'>
                Impressum
              </Link>
              <Link href='/privacy' className='hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded px-1 transition-colors hidden md:inline'>
                Datenschutz
              </Link>
              <a
                href='https://www.youtube.com/@kolpingtheaterramsen'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors'
                aria-label='YouTube'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='18'
                  height='18'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M23.498 6.186a3 3 0 0 0-2.118-2.118C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.38.568A3 3 0 0 0 .502 6.186C0 7.766 0 12 0 12s0 4.234.502 5.814a3 3 0 0 0 2.118 2.118C4.2 20.5 12 20.5 12 20.5s7.8 0 9.38-.568a3 3 0 0 0 2.118-2.118C24 16.234 24 12 24 12s0-4.234-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z' />
                </svg>
                <span>YouTube</span>
              </a>
              <a
                href='https://www.instagram.com/kolpingjugend_ramsen/'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors'
                aria-label='Instagram'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  width='18'
                  height='18'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
