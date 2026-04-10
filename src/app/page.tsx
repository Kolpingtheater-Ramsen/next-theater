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
      {/* === HERO === Award feature */}
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        <div className='relative w-full h-[85vh] min-h-[500px] max-h-[900px]'>
          <Image
            src='/img/award-rlp-2026.jpg'
            alt='Jugend-Engagement-Preis RLP 2026'
            fill
            priority
            sizes='100vw'
            className='object-cover object-top'
          />
          {/* Cinematic overlays */}
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/40 via-transparent to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/85 via-site-950/50 to-site-950/10' />
          <div className='vignette' />

          {/* Hero content */}
          <div className='absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20'>
            <div className='mx-auto w-full max-w-6xl px-4'>
              {/* Badge */}
              <div className='animate-fade-in-up mb-4' style={{ animationDelay: '0.1s' }}>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-kolping-400 uppercase'>
                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
                  </svg>
                  Auszeichnung &middot; 27. Februar 2026
                </span>
              </div>

              {/* Title */}
              <h1
                className='animate-fade-in-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] text-shadow-lg'
                style={{ animationDelay: '0.2s' }}
              >
                Jugend-Engagement-
                <br />
                <span className='text-kolping-400'>Preis RLP</span>
              </h1>

              {/* Subtitle */}
              <p
                className='animate-fade-in-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-xl leading-relaxed text-shadow'
                style={{ animationDelay: '0.35s' }}
              >
                Geehrt durch Ministerpräsident Alexander Schweitzer in Mainz.
              </p>

              {/* CTA */}
              <div
                className='animate-fade-in-up mt-6 sm:mt-8 flex flex-wrap items-center gap-3'
                style={{ animationDelay: '0.5s' }}
              >
                <Link
                  href='/about'
                  className='group inline-flex items-center gap-2 rounded-full bg-kolping-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.3)]'
                >
                  Unsere Geschichte
                  <svg className='w-4 h-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </Link>
                <Link
                  href='/gallery'
                  className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:border-white/30'
                >
                  Galerie
                </Link>
              </div>
              <p className='animate-fade-in-up mt-4 text-xs text-site-400 text-shadow' style={{ animationDelay: '0.6s' }}>
                Foto: Staatskanzlei RLP / Schäfer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === DATES TEASER 2026 === */}
      <section className='relative -mx-4 bg-gradient-to-r from-site-900 via-site-800 to-site-900 border-b border-site-700'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:py-8'>
          <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8'>
            <div className='flex items-center gap-3 shrink-0'>
              <div className='w-10 h-10 rounded-full bg-kolping-400/15 border border-kolping-400/30 flex items-center justify-center'>
                <svg className='w-5 h-5 text-kolping-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
              </div>
              <div>
                <p className='text-[10px] tracking-[0.2em] uppercase text-kolping-400 font-semibold'>Saison 2026</p>
                <p className='font-display text-lg sm:text-xl font-bold text-site-50'>
                  <span className='text-kolping-400'>Creepshow</span> &mdash; Open-Air-Premiere
                </p>
              </div>
            </div>
            <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
              <div className='rounded-lg border border-site-700 bg-site-800/60 px-4 py-2 text-center'>
                <p className='text-xs text-site-400 uppercase tracking-wider'>Block 1</p>
                <p className='font-display text-sm sm:text-base font-bold text-site-50'>21. + 22. August</p>
                <p className='text-[10px] text-site-400 mt-0.5'>Premiere</p>
              </div>
              <span className='text-site-600 font-bold'>&bull;</span>
              <div className='rounded-lg border border-site-700 bg-site-800/60 px-4 py-2 text-center'>
                <p className='text-xs text-site-400 uppercase tracking-wider'>Block 2</p>
                <p className='font-display text-sm sm:text-base font-bold text-site-50'>28. + 29. August</p>
                <p className='text-[10px] text-site-400 mt-0.5'>Zusatzvorstellungen</p>
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
        <div className='relative overflow-hidden rounded-2xl border border-site-700 force-dark'>
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
