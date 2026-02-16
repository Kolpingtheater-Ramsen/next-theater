import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'
import timeline from '@/data/timeline.json'

export default function Home() {
  const marqueeItems = teamData.plays.map((p) => ({
    date: String(p.year),
    title: p.play,
    marjor: p.location === 'Open-Air-Bühne',
  }))

  const featuredItems = teamData.plays
    .filter((p) => p.gallery)
    .reverse()
    .slice(0, 6)
    .map((p, idx) => {
      const entry = timeline.find((t) => 'galleryHash' in t && t.galleryHash === p.slug)
      return {
        title: p.play,
        image: `/img/banners/${p.slug}.jpg`,
        href: `/gallery/${p.slug}`,
        tag: idx === 0 ? 'Neu' : undefined,
        year: p.year,
        location: p.location,
        dominantColor: entry && 'dominantColor' in entry ? entry.dominantColor : '#0a0a0a',
      }
    })

  const productionCount = teamData.plays.length
  const yearsActive = new Date().getFullYear() - 2014

  return (
    <div className='space-y-0'>
      {/* === HERO === Full-bleed cinematic hero */}
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        {/* Background image with Ken Burns */}
        <div className='relative w-full h-[85vh] min-h-[500px] max-h-[900px]'>
          <Image
            src='/img/home_team.jpg'
            alt='Schicksalsfäden - Winterstück 2025'
            fill
            priority
            sizes='100vw'
            className='object-cover animate-kenburns'
          />
          {/* Cinematic overlays */}
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/40 via-transparent to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/60 via-transparent to-site-950/30' />
          <div className='vignette' />

          {/* Hero content - editorial layout */}
          <div className='absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20'>
            <div className='mx-auto w-full max-w-6xl px-4'>
              {/* Status badge */}
              <div className='animate-fade-in-up mb-4' style={{ animationDelay: '0.1s' }}>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-kolping-400 uppercase'>
                  <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-glow-pulse' />
                  2025 &middot; Kreativbühne
                </span>
              </div>

              {/* Title - massive editorial typography */}
              <h1
                className='animate-fade-in-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] text-shadow-lg'
                style={{ animationDelay: '0.2s' }}
              >
                Schicksals
                <br />
                <span className='text-kolping-400'>fäden</span>
              </h1>

              {/* Subtitle */}
              <p
                className='animate-fade-in-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-xl leading-relaxed text-shadow'
                style={{ animationDelay: '0.35s' }}
              >
                Eine Tragödie, inspiriert von den griechischen
                Schicksalsgöttinnen, den Moiren.
              </p>

              {/* CTA row */}
              <div
                className='animate-fade-in-up mt-6 sm:mt-8 flex flex-wrap items-center gap-3'
                style={{ animationDelay: '0.5s' }}
              >
                <Link
                  href='/gallery/schicksal'
                  className='group inline-flex items-center gap-2 rounded-full bg-kolping-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.3)]'
                >
                  Galerie ansehen
                  <svg className='w-4 h-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </Link>
                <Link
                  href='/about'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:border-white/30'
                >
                  Über uns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === STATS RIBBON === */}
      <section className='relative -mx-4 border-y border-site-700 bg-site-900'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:py-8'>
          <div className='grid grid-cols-3 gap-4 sm:gap-8 text-center'>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {yearsActive}
              </div>
              <div className='mt-1 text-xs sm:text-sm tracking-[0.15em] uppercase text-site-100'>
                Jahre Bühne
              </div>
            </div>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {productionCount}
              </div>
              <div className='mt-1 text-xs sm:text-sm tracking-[0.15em] uppercase text-site-100'>
                Produktionen
              </div>
            </div>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {teamData.current.length}
              </div>
              <div className='mt-1 text-xs sm:text-sm tracking-[0.15em] uppercase text-site-100'>
                Ensemble
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === THANK YOU BANNER === */}
      <section className='relative -mx-4 bg-site-800/50'>
        <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
            <div className='flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-kolping-400/10 border border-kolping-400/30 flex items-center justify-center'>
              <svg className='w-5 h-5 sm:w-6 sm:h-6 text-kolping-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
            </div>
            <div>
              <h3 className='font-display text-lg sm:text-xl font-bold tracking-tight'>
                Vielen Dank!
              </h3>
              <p className='mt-1 text-sm sm:text-base text-site-100 max-w-2xl'>
                Die Aufführungen sind vorüber. Wir bedanken uns herzlich bei allen Besuchern
                für den großen Zuspruch und die tolle Stimmung! Bis zum nächsten Mal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === MARQUEE === */}
      <section className='-mx-4 border-y border-site-700'>
        <Marquee items={marqueeItems} />
      </section>

      {/* === PRODUCTIONS === Editorial grid */}
      <section className='mx-auto max-w-6xl px-4 pt-16 sm:pt-20 pb-4' aria-labelledby='productions-heading'>
        <div className='flex items-end justify-between mb-8 sm:mb-10'>
          <div>
            <span className='block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-kolping-400 font-semibold mb-2'>
              Unsere Stücke
            </span>
            <h2
              id='productions-heading'
              className='font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none'
            >
              Produktionen
            </h2>
          </div>
          <Link
            href='/gallery'
            className='group hidden sm:inline-flex items-center gap-2 text-sm text-site-100 hover:text-kolping-400 transition-colors'
          >
            Alle ansehen
            <svg className='w-4 h-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>

        <FeaturedProductions items={featuredItems} />

        <div className='mt-6 sm:hidden text-center'>
          <Link
            href='/gallery'
            className='inline-flex items-center gap-2 text-sm text-site-100 hover:text-kolping-400 transition-colors'
          >
            Alle Produktionen ansehen
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>
      </section>

      {/* === JOIN CTA === */}
      <section className='mx-auto max-w-6xl px-4 py-16 sm:py-20' aria-labelledby='join-heading'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700'>
          {/* Background atmospheric effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/5 via-site-900 to-site-900' />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-400/[0.03] to-transparent' />

          <div className='relative p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='flex-1 text-center md:text-left'>
              <span className='block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-kolping-400 font-semibold mb-3'>
                Mach mit
              </span>
              <h3
                id='join-heading'
                className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight'
              >
                Werde Teil
                <br className='hidden sm:block' />
                der Bühne
              </h3>
              <p className='text-site-100 mt-3 sm:mt-4 text-sm sm:text-base max-w-md leading-relaxed'>
                Ob Schauspiel, Technik oder Organisation &ndash; bei uns ist
                Platz für alle, die Theater lieben.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <a
                href='https://www.instagram.com/kolpingjugend_ramsen/'
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center gap-2.5 rounded-full bg-kolping-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.3)]'
                aria-label='Besuche uns auf Instagram'
              >
                <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
                </svg>
                Instagram
              </a>
              <Link
                href='/about'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/50 px-6 py-3 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Über uns erfahren
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
