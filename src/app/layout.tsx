import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kolpingtheater Ramsen',
  description:
    'Kolping-Open-Air-Theater Ramsen – Produktionen, Ensemble, Timeline und Galerie.',
  metadataBase: new URL('https://theater.kolping-ramsen.de'),
  openGraph: {
    title: 'Kolpingtheater Ramsen',
    description:
      'Kolping-Open-Air-Theater Ramsen – Produktionen, Ensemble, Timeline und Galerie.',
    type: 'website',
    images: ['/img/logo.png'],
  },
  twitter: {
    card: 'summary',
    images: ['/img/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='de' data-theme='dark' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-site-900 text-site-50 min-h-screen flex flex-col`}
      >
        <header className='sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-site-900/80 bg-site-900/95 border-b border-site-700'>
          <div className='mx-auto max-w-6xl px-4 py-3 flex items-center gap-4'>
            <Link
              href='/'
              className='flex items-center gap-2 font-semibold text-site-50'
            >
              <Image
                src='/img/logo.png'
                alt='Kolpingtheater Ramsen'
                width={36}
                height={36}
                className='rounded-sm'
              />
              <span>Kolpingtheater Ramsen</span>
            </Link>
            <nav className='ml-auto flex items-center gap-6 text-sm'>
              <Link href='/' className='hover:text-kolping-400'>
                Home
              </Link>
              <Link href='/about' className='hover:text-kolping-400'>
                Über uns
              </Link>
              <Link href='/team' className='hover:text-kolping-400'>
                Team
              </Link>
              <Link href='/gallery' className='hover:text-kolping-400'>
                Galerie
              </Link>
              <Link href='/impressum' className='hover:text-kolping-400'>
                Impressum
              </Link>
              <Link href='/privacy' className='hover:text-kolping-400'>
                Datenschutz
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className='mx-auto max-w-6xl px-4 py-8 flex-1'>{children}</main>
        <footer className='border-t border-site-700 py-8 text-sm text-site-300'>
          <div className='mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4'>
            <span>
              © {new Date().getFullYear()} Kolping-Open-Air-Theater Ramsen
            </span>
            <div className='flex items-center gap-4'>
              <a
                href='https://www.youtube.com/@kolpingtheaterramsen'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 hover:text-kolping-400'
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
                className='inline-flex items-center gap-2 hover:text-kolping-400'
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
