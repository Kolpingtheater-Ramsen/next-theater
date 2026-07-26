import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import PremiereCountdown from '@/components/PremiereCountdown'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'
import timeline from '@/data/timeline.json'

export const metadata: Metadata = {
  title: 'Creepshow 2026 | Kolpingtheater Ramsen',
  description:
    'Creepshow feiert am 21. August 2026 Open-Air-Premiere auf der Kolpingwiese in Ramsen.',
  openGraph: {
    title: 'Creepshow 2026 | Kolpingtheater Ramsen',
    description:
      'Vier Sommerabende, eine neue Eigenproduktion. Open-Air-Premiere am 21. August 2026.',
    images: ['/img/creepshow-banner.webp'],
  },
}

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
    .map((p) => {
      const entry = timeline.find(
        (t) => 'galleryHash' in t && t.galleryHash === p.slug,
      )
      return {
        title: p.play,
        image: `/img/banners/${p.slug}.jpg`,
        href: `/gallery/${p.slug}`,
        year: p.year,
        location: p.location,
        dominantColor:
          entry && 'dominantColor' in entry ? entry.dominantColor : '#0a0a0a',
      }
    })

  const currentPlay = teamData.plays.find((play) => play.slug === 'creepshow')

  if (!currentPlay) return null

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO · CREEPSHOW PREMIERE ══════ */}
      <section id='creepshow' className='force-dark relative overflow-hidden bg-site-950'>
        <div className='relative h-[88svh] min-h-[620px] max-h-[940px] w-full'>
          <Image
            src='/img/creepshow-banner.webp'
            alt='Creepshow – Theaterproduktion 2026'
            fill
            priority
            sizes='100vw'
            className='animate-kenburns object-cover object-center'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/10 via-site-950/20 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/90 via-site-950/45 to-site-950/5' />
          <div className='vignette' />
          <div className='footlight' />

          {/* corner film-frame ticks */}
          <span className='absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-kolping-400/70' aria-hidden />

          <div className='absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-8'>
              <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/50 bg-site-950/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-kolping-400 uppercase'>
                  <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
                  Premiere · 21. August 2026
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  4 Vorstellungen · Eintritt frei
                </span>
              </div>

              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.5em] text-kolping-400 mb-3 animate-fade-in-up'>
                Kolpingtheater Ramsen · präsentiert
              </div>

              <h1 className='animate-curtain-rise max-w-4xl font-display text-4xl font-black leading-[0.92] tracking-tight text-shadow-lg sm:text-6xl md:text-7xl'>
                <span className='mb-2 block text-3xl italic text-kolping-400 sm:sr-only'>
                  {currentPlay.play}
                </span>
                Die Premiere <span className='italic text-kolping-400'>naht.</span>
              </h1>

              <p className='animate-fade-in-up mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Ein schaurig-skurriles Theaterereignis aus eigener Feder –
                Open Air auf der Kolpingwiese in Ramsen, an vier Abenden im
                August 2026.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up'>
                <a
                  href='#termine'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Alle 4 Termine
                  <span className='transition-transform group-hover:translate-y-0.5'>↓</span>
                </a>
                <a
                  href='https://www.youtube.com/watch?v=FyqtNxaxHBc'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-3 rounded-sm border border-kolping-400/60 bg-site-950/55 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-kolping-400 backdrop-blur-sm transition-all hover:border-kolping-400 hover:bg-kolping-400 hover:text-black'
                >
                  <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                  Trailer ansehen
                </a>
                <a
                  href='https://www.instagram.com/kolpingjugend_ramsen/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-sm border border-white/20 bg-site-950/45 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 backdrop-blur-sm transition-colors hover:border-kolping-400/60 hover:text-kolping-400'
                >
                  Proben verfolgen →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TERMINE ══════ */}
      <section
        id='termine'
        className='relative bg-site-950 border-y border-site-700 overflow-hidden scroll-mt-24'
      >
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16'>
          <div className='grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center'>
            <div>
              <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                4 Vorstellungen · August 2026
              </div>
              <h2 className='font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]'>
                Vier Abende
                <br />
                unter <span className='italic text-kolping-400'>offenem Himmel.</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
              <p className='mt-5 text-site-100/80 text-sm sm:text-base max-w-xl leading-relaxed'>
                Alle vier Vorstellungen beginnen um 20:00 Uhr und finden an
                den beiden Augustwochenenden statt.
              </p>
              <div className='mt-6'>
                <PremiereCountdown targetISO='2026-08-21T20:00:00+02:00' />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:w-[420px] lg:grid-cols-2'>
              {[
                {
                  num: 'Termin 01',
                  date: '21.',
                  month: 'August',
                  sub: 'Freitag · Premiere · 20:00 Uhr',
                  premiere: true,
                },
                {
                  num: 'Termin 02',
                  date: '22.',
                  month: 'August',
                  sub: 'Samstag · Vorstellung · 20:00 Uhr',
                  premiere: false,
                },
                {
                  num: 'Termin 03',
                  date: '28.',
                  month: 'August',
                  sub: 'Freitag · Vorstellung · 20:00 Uhr',
                  premiere: false,
                },
                {
                  num: 'Termin 04',
                  date: '29.',
                  month: 'August',
                  sub: 'Samstag · Vorstellung · 20:00 Uhr',
                  premiere: false,
                },
              ].map((d) => (
                <div
                  key={d.num}
                  className={`relative min-w-0 overflow-hidden rounded-sm border p-4 sm:p-5 ${
                    d.premiere
                      ? 'border-kolping-400/55 bg-kolping-500/10 shadow-[0_0_35px_rgba(255,122,0,0.08)]'
                      : 'border-site-700 bg-site-900/80'
                  }`}
                >
                  <div className='clapper-stripes h-1.5 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-4 opacity-60' aria-hidden />
                  <div className='font-mono text-[9px] uppercase tracking-[0.35em] text-kolping-400 mb-2'>
                    {d.num}
                  </div>
                  <div className='cast-number font-display text-3xl sm:text-4xl italic leading-none'>
                    {d.date}
                  </div>
                  <div className='font-mono text-[10px] uppercase tracking-[0.25em] text-site-100 mt-2'>
                    {d.month}
                  </div>
                  <div className='text-[10px] text-site-300 mt-1'>{d.sub}</div>
                </div>
              ))}
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
                title: 'Eigene Geschichten',
                body: 'Jedes Stück entsteht aus eigener Feder — historisch, fantastisch, düster oder komisch. Kein Kanon, keine Abziehbilder.',
              },
              {
                num: '02',
                title: 'Open-Air-Atmosphäre',
                body: 'Sommerabende auf der Kolpingwiese unter freiem Himmel, im Winter auf der Kreativbühne im Pfarrheim.',
              },
              {
                num: '03',
                title: 'Eintritt frei',
                body: 'Theater für alle, ohne Eintrittskarten, ohne Hürden. Getragen von Ehrenamt, Gemeinschaft und eurer Begeisterung.',
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
                  Wir sehen uns im August
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
                  Vom Probenraum bis zur Creepshow-Premiere: Auf Instagram und
                  YouTube bleibst du hinter den Kulissen dabei. Fragen zur
                  Anfahrt oder zum Platz? Schreib uns.
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
