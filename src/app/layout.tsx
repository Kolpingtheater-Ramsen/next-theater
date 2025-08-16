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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='de' data-theme='dark' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-site-900 text-site-50`}
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
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className='mx-auto max-w-6xl px-4 py-8'>{children}</main>
        <footer className='border-t border-site-700 py-8 text-sm text-site-300'>
          <div className='mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4'>
            <span>
              © {new Date().getFullYear()} Kolping-Open-Air-Theater Ramsen
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
