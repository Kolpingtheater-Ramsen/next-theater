import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import TheatergaudiPoster from '@/components/TheatergaudiPoster'
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
      const entry = timeline.find(
        (t) => 'galleryHash' in t && t.galleryHash === p.slug,
      )
      return {
        title: p.play,
        image: `/img/banners/${p.slug}.jpg`,
        href: `/gallery/${p.slug}`,
        tag: idx === 0 ? 'Neu' : undefined,
        year: p.year,
        location: p.location,
        dominantColor:
          entry && 'dominantColor' in entry ? entry.dominantColor : '#0a0a0a',
      }
    })

  const currentPlay = teamData.plays[teamData.plays.length - 1]

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO · THEATERGAUDI ══════ */}
      <section id='theatergaudi' className='relative overflow-hidden'>
        <div className='relative min-h-[760px] w-full py-24 sm:py-28 lg:min-h-[calc(100vh-2rem)] lg:py-20'>
          <Image
            src='/img/theatergaudi-2026-extended.webp'
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover object-center opacity-25 blur-sm scale-105'
            aria-hidden
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/70 via-site-950/55 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/95 via-site-950/70 to-site-950/35' />
          <div className='vignette' />
          <div className='footlight' />

          {/* corner film-frame ticks */}
          <span className='absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-kolping-400/70' aria-hidden />

          <div className='relative mx-auto grid h-full w-full max-w-7xl items-end gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,440px)] lg:items-center xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,520px)] xl:gap-20'>
            <div className='max-w-[680px] pt-32 sm:pt-36 lg:pt-12'>
              <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/50 bg-site-950/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-kolping-400 uppercase'>
                  <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
                  Samstag, 4. Juli · ab 15:00 Uhr
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  Eintritt frei
                </span>
              </div>

              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.5em] text-kolping-400 mb-3 animate-fade-in-up'>
                Kolpingtheater Ramsen · 10 Jahre
              </div>

              <h1 className='animate-curtain-rise font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-shadow-lg'>
                <span className='italic text-kolping-400'>Theatergaudi</span>
                <br />
                10 Jahre Kolping-Theater.
              </h1>

              <p className='animate-fade-in-up mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Samstag, 4. Juli am Kolping-Gelände in Ramsen: ab 15:00 Uhr
                offenes Theaterfest mit Kaffee und Kuchen, Hüpfburg,
                Kinderschminken, Fotobox und Pop-up-Auftritten. Ab 20:00 Uhr
                Live-Musik, Cocktails und Sommerabend.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up'>
                <Link
                  href='/contact'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Anfahrt
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
                <a
                  href='https://www.instagram.com/kolpingjugend_ramsen/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Updates auf Instagram
                </a>
              </div>
            </div>

            <TheatergaudiPoster />
          </div>
        </div>
      </section>

      {/* ══════ NEXT PLAY · Teaser ══════ */}
      <section className='relative bg-site-950 border-y border-site-700'>
        <div className='mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(280px,0.75fr)_1fr] lg:items-center'>
          <div className='relative aspect-[16/9] overflow-hidden rounded-sm border border-site-700 bg-site-900'>
            <Image
              src={`/img/banners/${currentPlay.slug}.svg`}
              alt={`${currentPlay.play} ${currentPlay.year}`}
              fill
              sizes='(min-width: 1024px) 42vw, 100vw'
              className='object-cover object-center'
              unoptimized
            />
            <div className='absolute inset-0 bg-gradient-to-r from-site-950/10 via-transparent to-site-950/35' />
          </div>

          <div className='max-w-2xl'>
            <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 mb-3'>
              Neues Stück · {currentPlay.year}
            </div>
            <h2 className='font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-site-50 leading-[0.95]'>
              <span className='italic text-kolping-400'>{currentPlay.play}</span>
              <br />
              kommt auf die Bühne.
            </h2>
            <div className='hairline-gold w-20 mt-5' />
            <p className='mt-5 text-site-100/80 text-sm sm:text-base leading-relaxed'>
              Nach der Theatergaudi geht der Blick nach vorne: unser neues
              Open-Air-Stück für 2026 entsteht bereits. Weitere Infos zu
              Terminen und Einblicken folgen hier und auf Instagram.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <a
                href='https://www.instagram.com/kolpingjugend_ramsen/'
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 transition-colors hover:text-kolping-400'
              >
                Updates folgen
                <span className='transition-transform group-hover:translate-x-1'>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ WAS SIE ERWARTET ══════ */}
      <section className='relative bg-site-900 border-b border-site-700'>
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-20'>
          <div className='mb-10 sm:mb-14'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
              Für das Publikum
            </div>
            <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
              Was dich <span className='italic text-kolping-400'>erwartet.</span>
            </h2>
            <div className='hairline-gold w-24 mt-5' />
          </div>

          <div className='grid md:grid-cols-3 gap-4 sm:gap-6'>
            {[
              {
                num: '01',
                title: 'Theater zum Anfassen',
                body: 'Kostüme, Requisiten, Technik und kleine Auftritte zeigen, was hinter unseren Stücken steckt.',
              },
              {
                num: '02',
                title: 'Fest für Familien',
                body: 'Kaffee und Kuchen, Hüpfburg, Kinderschminken, Fotobox und Spielestationen für den Nachmittag.',
              },
              {
                num: '03',
                title: 'Sommerabend',
                body: 'Ab 20:00 Uhr wird aus dem Theaterfest ein Abend mit Live-Musik, Cocktails und guter Stimmung.',
              },
            ].map((c) => (
              <article
                key={c.num}
                className='group relative p-6 sm:p-8 border border-site-700 bg-site-900 rounded-sm hover:border-kolping-400/40 transition-colors'
              >
                <div className='flex items-start justify-between mb-5'>
                  <div className='cast-number font-display text-5xl italic leading-none'>
                    {c.num}
                  </div>
                  <div className='flex gap-1 pt-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/80' />
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/40' />
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/20' />
                  </div>
                </div>
                <h3 className='font-display text-2xl uppercase tracking-tight text-site-50 leading-tight'>
                  {c.title}
                </h3>
                <div className='hairline-gold w-10 my-4 group-hover:w-24 transition-all duration-500' />
                <p className='text-sm text-site-100 leading-relaxed'>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MARQUEE · Repertoire ══════ */}
      <section className='border-y border-site-700'>
        <Marquee items={marqueeItems} />
      </section>

      {/* ══════ PRODUCTIONS · Einblicke ══════ */}
      <section
        className='relative bg-site-900'
        aria-labelledby='productions-heading'
      >
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
            <div>
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                Einblicke
              </div>
              <h2
                id='productions-heading'
                className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'
              >
                Vergangene <span className='italic text-kolping-400'>Stücke.</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
              <p className='mt-4 text-site-100/80 text-sm sm:text-base max-w-xl leading-relaxed'>
                Ein Blick zurück: Fotos und Atmosphäre unserer Eigenproduktionen
                der letzten Jahre.
              </p>
            </div>
            <Link
              href='/gallery'
              className='group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
            >
              Alle Galerien
              <span className='transition-transform group-hover:translate-x-1'>→</span>
            </Link>
          </div>

          <FeaturedProductions items={featuredItems} />
        </div>
      </section>

      {/* ══════ AWARD · Trust signal ══════ */}
      <section className='relative bg-site-950 border-t border-site-700'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16'>
          <div className='grid md:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-center'>
            <div className='relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 overflow-hidden rounded-sm border border-kolping-500/30 bg-site-900'>
              <Image
                src='/img/award-rlp-2026.jpg'
                alt='Jugend-Engagement-Preis RLP 2026'
                fill
                sizes='(min-width: 640px) 144px, 112px'
                className='object-cover object-top'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-site-950/40 to-transparent' />
            </div>

            <div className='min-w-0'>
              <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 mb-2 flex items-center gap-2'>
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24' aria-hidden>
                  <path d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
                </svg>
                Ausgezeichnet · Februar 2026
              </div>
              <h3 className='font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-site-50 leading-tight'>
                Jugend-Engagement-Preis <span className='italic text-kolping-400'>Rheinland-Pfalz</span>
              </h3>
              <p className='mt-2 text-sm text-site-100/80 leading-relaxed max-w-xl'>
                Geehrt durch Ministerpräsident Alexander Schweitzer in der
                Staatskanzlei Mainz.
              </p>
            </div>

            <Link
              href='/about'
              className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-900 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:border-kolping-400/60 hover:text-kolping-400 transition-all self-start sm:self-center'
            >
              Mehr lesen →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ CTA · Bleib auf dem Laufenden ══════ */}
      <section
        className='relative bg-site-950 py-16 sm:py-24 px-4 sm:px-8 border-t border-site-700'
        aria-labelledby='stay-heading'
      >
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />

          <div className='relative p-8 sm:p-12 md:p-16 bg-site-900'>
            <div
              className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none'
              aria-hidden
            />

            <div className='relative grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                  Wir sehen uns am 4. Juli
                </div>
                <h3
                  id='stay-heading'
                  className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'
                >
                  Nichts
                  <br />
                  <span className='italic text-kolping-400'>verpassen.</span>
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  Alle Updates zur Theatergaudi, Blicke hinter die Kulissen
                  und Eindrücke aus zehn Jahren Kolping-Theater findest du auf
                  Instagram und YouTube. Fragen zur Anfahrt? Schreib uns.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:items-end'>
                <a
                  href='https://www.instagram.com/kolpingjugend_ramsen/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                >
                  Instagram folgen
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </a>
                <a
                  href='https://www.youtube.com/@kolpingtheaterramsen'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-3 rounded-sm border border-site-700 bg-site-800/70 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-site-100 transition-all hover:border-kolping-400/60 hover:text-kolping-400'
                >
                  <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
                    <path d='M23.498 6.186a3 3 0 0 0-2.118-2.118C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.38.568A3 3 0 0 0 .502 6.186C0 7.766 0 12 0 12s0 4.234.502 5.814a3 3 0 0 0 2.118 2.118C4.2 20.5 12 20.5 12 20.5s7.8 0 9.38-.568a3 3 0 0 0 2.118-2.118C24 16.234 24 12 24 12s0-4.234-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z' />
                  </svg>
                  YouTube
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </a>
                <Link
                  href='/contact'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  ✉ Kontakt &amp; Anfahrt
                </Link>
              </div>
            </div>
          </div>

          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />
        </div>
      </section>
    </div>
  )
}
