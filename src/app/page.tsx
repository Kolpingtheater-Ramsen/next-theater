import CountdownTimer from '@/components/CountdownTimer'
import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='space-y-8 sm:space-y-10 md:space-y-12'>
      {/* Hero Section - Schicksalsfäden */}
      <section className='mx-auto w-full max-w-6xl space-y-6'>
        <div className='relative overflow-hidden rounded-xl border border-site-700 bg-site-900'>
          <div className='relative w-full flex items-center justify-center bg-site-900'>
            {/* Blurred background cover */}
            <Image
              src='/img/banners/schicksal.jpg'
              alt=''
              width={1200}
              height={675}
              priority
              sizes='(max-width: 768px) 100vw, 1152px'
              className='absolute inset-0 w-full h-full object-cover blur-xl opacity-50'
              aria-hidden='true'
            />
            {/* Sharp foreground contain */}
            <Image
              src='/img/banners/schicksal.jpg'
              alt='Schicksalsfäden - Winterstück 2025'
              width={1200}
              height={675}
              priority
              sizes='(max-width: 768px) 100vw, 1152px'
              className='relative w-full h-auto md:max-h-[600px] lg:max-h-[750px] object-contain z-10'
            />
          </div>
        </div>
        
        {/* Text content container */}
        <div className='glass rounded-xl p-6 md:p-8'>
          <div className='mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-kolping-400 uppercase'>
            2025 - Unsere aktuelle Produktion
          </div>
          <h1 className='font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight'>
            Schicksalsfäden
          </h1>
          <p className='mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-site-100 max-w-2xl'>
            Eine Tragödie, inspiriert von den griechischen Schicksalsgöttinnen, den Moiren. Erlebe die faszinierende Welt der antiken Mythologie auf der Kreativbühne des Kolpingtheaters Ramsen.
          </p>
          <div className='mt-5 sm:mt-6'>
            <CountdownTimer 
              targetDate='2025-12-27T17:00:00+02:00' 
              title='Nächste Premiere startet in'
              containerClassName='relative w-full'
            />
          </div>
          <div className='mt-4 sm:mt-5 text-sm sm:text-base text-site-200'>
            <div className='font-semibold mb-2'>Aufführungen:</div>
            <div className='space-y-1'>
              <div>27.12. 17:00 Uhr & 20:00 Uhr</div>
              <div>28.12. 14:30 Uhr & 17:00 Uhr</div>
            </div>
          </div>
          <div className='mt-6 sm:mt-8'>
            <Link
              href='/booking'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold transition-colors shadow-lg hover:shadow-xl'
            >
              Jetzt buchen
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl'>
        <Marquee
          items={[
            { date: '2017', title: 'Verrat im Kloster' },
            { date: '2018', title: 'Bluttribut' },
            { date: '2019', title: 'Dystopia' },
            { date: '2020', title: 'Der Kristall der Träume' },
            { date: '2021', title: 'Malleus Maleficarum' },
            { date: '2022', title: 'Goldfieber' },
            { date: '2023', title: 'Traum von Freiheit' },
            { date: '2024', title: 'Nexus' },
            { date: '2024', title: 'Eine höllische Herausforderung' },
            { date: '2025', title: 'Anno 1146' },
            { date: '2025', title: 'Schicksalsfäden' },
          ]}
        />
      </section>

      <section className='mx-auto max-w-6xl space-y-4' aria-labelledby='productions-heading'>
        <h2 id='productions-heading' className='font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight'>
          Produktionen
        </h2>
        <FeaturedProductions
          items={[
            { title: 'Anno 1146', image: '/img/banners/anno.jpg', href: '/gallery/anno', tag: 'Neu' },
            { title: 'Nexus', image: '/img/banners/nexus.jpg', href: '/gallery/nexus' },
            { title: 'Traum von Freiheit', image: '/img/banners/freiheit.jpg', href: '/gallery/freiheit' },
            { title: 'Dystopia', image: '/img/banners/dystopia.jpg', href: '/gallery/dystopia' },
            { title: 'Der Kristall der Träume', image: '/img/banners/kristall.jpg', href: '/gallery/kristall' },
            { title: 'Goldfieber', image: '/img/banners/goldfieber.jpg', href: '/gallery/goldfieber' },
          ]}
        />
      </section>

      <section className='mx-auto max-w-6xl' aria-labelledby='join-heading'>
        <div className='glass rounded-xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6'>
          <div className='flex-1 text-center md:text-left'>
            <h3 id='join-heading' className='font-display text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight'>
              Werde Teil der Bühne
            </h3>
            <p className='text-site-100 mt-1 text-sm sm:text-base'>
              Ob Schauspiel, Technik oder Organisation – bei uns ist Platz für alle, die Theater lieben.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <a
              href='https://www.instagram.com/kolpingjugend_ramsen/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800 transition-colors'
              aria-label='Besuche uns auf Instagram'
            >
              Instagram
            </a>
            <a
              href='/about'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800 transition-colors'
            >
              Über uns
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
