import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import PremiereCountdown from '@/components/PremiereCountdown'
import RomeoJuliaPoster from '@/components/RomeoJuliaPoster'
import WinterReleaseRefresh from '@/components/WinterReleaseRefresh'
import type { Metadata } from 'next'
import Image from '@/components/ProgressiveImage'
import Link from 'next/link'
import teamData from '@/data/team.json'
import timeline from '@/data/timeline.json'
import romeoFaq from '@/data/romeo-faq.json'
import { bookingHref } from '@/lib/winter-release'
import {
  getWinterReleaseState,
  type ReleaseSearchParams,
} from '@/lib/winter-release-server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type HomeProps = { searchParams?: ReleaseSearchParams }

const WINTER_SHOW_DAYS = [
  {
    weekday: 'Sonntag',
    dateLabel: '27. Dezember 2026',
    times: ['17:00 Uhr', '19:30 Uhr'],
  },
  {
    weekday: 'Montag',
    dateLabel: '28. Dezember 2026',
    times: ['17:00 Uhr', '19:30 Uhr'],
  },
] as const

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const { preview } = await getWinterReleaseState(searchParams)

  return {
    title: 'Romeo & Julia – Ein Minidrama | Kolpingtheater Ramsen',
    description:
      'Die Kreativbühne des Kolpingtheaters Ramsen präsentiert „Romeo & Julia – Ein Minidrama“ (verkürzte Bühnenfassung, ca. 50 Minuten) am 27. und 28. Dezember 2026 um 17:00 & 19:30 Uhr im Pfarrheim in Ramsen (Klosterhof 7). Eintritt frei – Reservierung notwendig.',
    openGraph: {
      title: 'Romeo & Julia – Ein Minidrama | Kolpingtheater Ramsen',
      description:
        'Kreativbühne: verkürzte Bühnenfassung (ca. 50 Minuten) am 27. & 28. Dezember 2026 um 17:00 & 19:30 Uhr im Pfarrheim in Ramsen (Klosterhof 7). Eintritt frei – Reservierung notwendig.',
      images: ['/img/romeo-und-julia-2026-poster.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Romeo & Julia – Ein Minidrama | Kolpingtheater Ramsen',
      description:
        'Kreativbühne: verkürzte Bühnenfassung (ca. 50 Minuten) am 27. & 28. Dezember 2026 um 17:00 & 19:30 Uhr im Pfarrheim in Ramsen (Klosterhof 7). Eintritt frei – Reservierung notwendig.',
      images: ['/img/romeo-und-julia-2026-poster.jpg'],
    },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const { live: bookingLive, preview } = await getWinterReleaseState(searchParams)
  const ticketsHref = bookingHref(preview)

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

  const lowerSections = (
    <>
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
                  {bookingLive ? 'Eintritt frei · Sitzplatzreservierung' : 'Eintritt frei · Buchungsstart 1. Dezember'}
                </div>
                <h3
                  id='stay-heading'
                  className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'
                >
                  {bookingLive ? (
                    <>
                      Jetzt Plätze
                      <br />
                      <span className='italic text-kolping-400'>sichern.</span>
                    </>
                  ) : (
                    <>
                      Ab 1. Dezember
                      <br />
                      <span className='italic text-kolping-400'>reservieren.</span>
                    </>
                  )}
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  {bookingLive
                    ? 'Reserviere deine kostenlosen Plätze für Romeo & Julia im Pfarrheim in Ramsen und bleib auf Instagram und YouTube hinter den Kulissen dabei.'
                    : 'Ab Dienstag, 1. Dezember 2026 um 00:00 Uhr kannst du dir deine kostenlosen Sitzplätze für „Romeo & Julia – Ein Minidrama“ im Pfarrheim in Ramsen sichern. Auf Instagram und YouTube bleibst du bis dahin hinter den Kulissen dabei.'}
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:items-end'>
                <Link
                  href={ticketsHref}
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                >
                  {bookingLive ? 'Plätze reservieren' : 'Reservierung ab 1. Dezember'}
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
                <a
                  href='https://www.instagram.com/kolpingtheater_ramsen/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-3 rounded-sm border border-site-700 bg-site-800/70 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-site-100 transition-all hover:border-kolping-400/60 hover:text-kolping-400'
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
    </>
  )

  return (
    <div
      className='-mx-4 -mt-8'
      data-home-state='winter-show'
      data-booking-state={bookingLive ? 'open' : 'upcoming'}
    >
      {!bookingLive && <WinterReleaseRefresh />}
      {/* ══════ CURRENT SHOW · ROMEO & JULIA (ACTIVE FROM 01.12.) ══════ */}
      <section className='force-dark relative isolate overflow-hidden bg-site-950 px-4 py-14 sm:px-8 sm:py-20 lg:py-24'>
        <Image
          src='/img/romeo-und-julia-2026-poster.jpg'
          alt=''
          fill
          priority
          sizes='100vw'
          className='-z-30 object-cover object-center opacity-25 blur-sm scale-105'
          aria-hidden
        />
        <div className='absolute inset-0 -z-20 bg-gradient-to-r from-black/90 via-black/75 to-black/45' />
        <div className='absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/60' />
        <div className='vignette' />
        <div className='footlight' />

        <span
          className='absolute left-6 top-6 h-4 w-4 border-l-2 border-t-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute right-6 top-6 h-4 w-4 border-r-2 border-t-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute bottom-6 left-6 h-4 w-4 border-b-2 border-l-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute bottom-6 right-6 h-4 w-4 border-b-2 border-r-2 border-kolping-400/70'
          aria-hidden
        />

        <div className='relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,440px)] xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] xl:gap-16'>
          <div className='max-w-2xl'>
            <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
              <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/50 bg-site-950/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-[0.22em] text-kolping-400 uppercase'>
                <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
                27. &amp; 28. Dezember 2026 · 17:00 &amp; 19:30 Uhr
              </span>
              <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono font-semibold tracking-[0.22em] text-white uppercase'>
                Dauer: ca. 50 Minuten · 78 Plätze pro Vorstellung
              </span>
            </div>

            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-kolping-400 sm:text-xs sm:tracking-[0.45em]'>
              Das Kolpingtheater Ramsen präsentiert · Kreativbühne
            </p>

            <h1 className='mt-4 animate-curtain-rise font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-site-50 text-shadow-lg sm:text-6xl xl:text-7xl'>
              Romeo &amp;{' '}
              <span className='italic text-kolping-400'>Julia</span>
              <span className='mt-3 block font-mono text-xs font-semibold tracking-[0.28em] text-site-100 sm:text-sm'>
                – Ein Minidrama · ca. 50 Minuten –
              </span>
            </h1>

            <div className='hairline-gold mt-6 w-24' />

            <p className='mt-6 max-w-xl text-base leading-relaxed text-site-100 sm:text-lg'>
              Unsere Kreativbühne zeigt eine eigene, verkürzte Bühnenfassung
              (ca. 50 Minuten, nicht das abendfüllende Original) am 27. und 28.
              Dezember im Pfarrheim in Ramsen (Klosterhof 7).
            </p>

            <div className='mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border-2 border-emerald-400/70 bg-emerald-950/75 px-5 py-3 shadow-[0_0_28px_rgba(52,211,153,0.18)] backdrop-blur-sm'>
              <span className='inline-flex items-center gap-2.5 font-display text-xl font-black uppercase tracking-[0.08em] text-emerald-300 sm:text-2xl'>
                <span className='h-2.5 w-2.5 rounded-full bg-emerald-400' aria-hidden />
                Eintritt frei
              </span>
              <span className='font-mono text-xs font-semibold uppercase tracking-[0.18em] text-site-100'>
                {bookingLive
                  ? 'Kostenlose Sitzplatzreservierung notwendig'
                  : 'Kostenlose Sitzplatzreservierung ab 1. Dezember'}
              </span>
            </div>

            <div className='mt-7 flex flex-wrap items-center gap-3'>
              <Link
                href={ticketsHref}
                className='group inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.45)] focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
              >
                {bookingLive ? 'Plätze reservieren' : 'Reservierung ab 1. Dezember'}
                <span className='transition-transform group-hover:translate-x-1' aria-hidden>
                  →
                </span>
              </Link>
              <a
                href='#termine'
                className='group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/25 bg-black/55 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-site-50 backdrop-blur-sm transition-colors hover:border-kolping-400 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
              >
                Termine &amp; Infos
                <span className='transition-transform group-hover:translate-y-0.5' aria-hidden>
                  ↓
                </span>
              </a>
              <a
                href='#faq'
                className='inline-flex items-center gap-2 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-site-100 transition-colors hover:text-kolping-400'
              >
                FAQ <span aria-hidden>↓</span>
              </a>
            </div>
          </div>

          <RomeoJuliaPoster />
        </div>
      </section>

      {/* ══════ TERMINE & TICKETS ══════ */}
      <section
        id='termine'
        className='relative bg-site-900 border-t border-site-700 scroll-mt-24'
        aria-labelledby='termine-heading'
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-8 py-14 sm:py-20'>
          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-14'>
            <div>
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                Kreativbühne · 4 Vorstellungen · ca. 50 Minuten · Eintritt frei
              </div>
              <h2
                id='termine-heading'
                className='font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.92]'
              >
                Termine &amp;{' '}
                <span className='italic text-kolping-400'>Tickets.</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
              <p className='mt-4 text-site-100/85 text-sm sm:text-base max-w-xl leading-relaxed'>
                {bookingLive
                  ? 'Wähle deinen Wunschtermin und sichere dir kostenlos feste Sitzplätze (78 Plätze pro Vorstellung, Reihen A bis H) im Pfarrheim. Dauer ca. 50 Minuten ohne Pause. Dein digitales Ticket erhältst du direkt per E-Mail und auf Wunsch für Google Wallet.'
                  : 'Die kostenlose Online-Sitzplatzreservierung startet am 1. Dezember 2026 um 00:00 Uhr (78 feste Plätze pro Vorstellung, Reihen A bis H im Pfarrheim). Dauer ca. 50 Minuten ohne Pause – dein digitales Ticket erhältst du direkt per E-Mail und auf Wunsch für Google Wallet.'}
              </p>
            </div>

            <PremiereCountdown
              targetISO='2026-12-27T17:00:00+01:00'
              label='Bis zur ersten Vorstellung'
            />
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            {WINTER_SHOW_DAYS.map((day) => (
              <article
                key={day.dateLabel}
                className='flex flex-col justify-between gap-6 rounded-sm border border-site-700 bg-site-950 p-6 sm:p-8'
              >
                <div>
                  <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                    {day.weekday}
                  </div>
                  <h3 className='mt-2 font-display text-2xl sm:text-3xl uppercase tracking-tight text-site-50'>
                    {day.dateLabel}
                  </h3>
                  <div className='hairline-gold w-12 mt-4' />

                  <div className='mt-5 grid grid-cols-2 gap-3'>
                    {day.times.map((time) => (
                      <div
                        key={time}
                        className='rounded-sm border border-site-700 bg-site-900 px-4 py-3'
                      >
                        <div className='font-mono text-[10px] uppercase tracking-[0.25em] text-site-300'>
                          Vorstellung · ca. 50 Min.
                        </div>
                        <div className='mt-1 font-display text-xl text-site-50'>
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={ticketsHref}
                  className='group inline-flex min-h-11 items-center justify-center gap-3 rounded-sm bg-kolping-400 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-all hover:bg-kolping-500'
                >
                  {bookingLive ? 'Plätze reservieren' : 'Reservierung ab 1. Dezember'}
                  <span className='transition-transform group-hover:translate-x-1' aria-hidden>
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>

          <div className='mt-6 grid md:grid-cols-3 gap-4 sm:gap-6'>
            <div className='rounded-sm border border-site-700 bg-site-950 p-5 sm:p-6'>
              <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                Spielort
              </div>
              <div className='mt-2 font-display text-xl uppercase text-site-50'>
                Pfarrheim in Ramsen
              </div>
              <p className='mt-2 text-sm text-site-100/85 leading-relaxed'>
                Klosterhof 7, 67305 Ramsen
              </p>
              <a
                href='https://maps.google.com/?q=Klosterhof+7,+67305+Ramsen'
                target='_blank'
                rel='noopener noreferrer'
                className='mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-kolping-400 hover:text-kolping-500'
              >
                In Google Maps öffnen <span aria-hidden>↗</span>
              </a>
            </div>

            <div className='rounded-sm border-2 border-kolping-400/50 bg-site-950 p-5 sm:p-6'>
              <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                Eintritt &amp; Plätze
              </div>
              <div className='mt-2 font-display text-2xl sm:text-3xl font-black uppercase text-kolping-400'>
                Eintritt frei
              </div>
              <p className='mt-2 text-sm text-site-100/85 leading-relaxed'>
                {bookingLive
                  ? 'Reservierung notwendig – 78 feste Plätze (Reihen A–H), bis zu 5 Plätze pro Buchung online wählbar.'
                  : 'Reservierung ab 1. Dezember (00:00 Uhr) – 78 feste Plätze (Reihen A–H), bis zu 5 Plätze pro Buchung online wählbar.'}
              </p>
            </div>

            <div className='rounded-sm border border-site-700 bg-site-950 p-5 sm:p-6'>
              <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                Dauer &amp; Digitales Ticket
              </div>
              <div className='mt-2 font-display text-xl uppercase text-site-50'>
                ca. 50 Minuten
              </div>
              <p className='mt-2 text-sm text-site-100/85 leading-relaxed'>
                Minidrama ohne Pause. QR-Code-Ticket per E-Mail &amp; Google
                Wallet – jederzeit änder- oder stornierbar.
              </p>
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-4 rounded-sm border border-site-700 bg-site-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
            <div>
              <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                Support &amp; Kontakt
              </div>
              <p className='mt-1.5 text-sm text-site-100/90 leading-relaxed'>
                Fragen zur Reservierung, Umbuchung oder zum Besuch? Schreib uns
                jederzeit per E-Mail oder Instagram.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <a
                href='mailto:kolpingtheaterramsen@gmail.com?subject=Support%20Romeo%20%26%20Julia'
                className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-900 px-4 py-2 font-mono text-[11px] font-semibold text-kolping-400 transition-colors hover:border-kolping-400'
              >
                kolpingtheaterramsen@gmail.com
              </a>
              <a
                href='https://www.instagram.com/kolpingtheater_ramsen/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-900 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-site-100 transition-colors hover:border-kolping-400 hover:text-kolping-400'
              >
                Instagram ↗
              </a>
              <Link
                href='/contact'
                className='inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-100 hover:text-kolping-400'
              >
                Kontakt &amp; Anfahrt →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FAQ · Gut zu wissen ══════ */}
      <section
        id='faq'
        className='relative bg-site-950 border-t border-site-700 scroll-mt-24'
        aria-labelledby='faq-heading'
      >
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-14 sm:py-20'>
          <div className='mb-10 sm:mb-14'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
              Gut zu wissen
            </div>
            <h2
              id='faq-heading'
              className='font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.92]'
            >
              Häufige <span className='italic text-kolping-400'>Fragen.</span>
            </h2>
            <div className='hairline-gold w-24 mt-5' />
            <p className='mt-4 text-site-100/85 text-sm sm:text-base max-w-2xl leading-relaxed'>
              Alles Wichtige rund um „Romeo &amp; Julia – Ein Minidrama“ – von
              Dauer und freiem Eintritt bis zu Sitzplätzen, Anfahrt und Support.
            </p>
          </div>

          <div className='grid gap-3'>
            {romeoFaq.map((item) => (
              <details
                key={item.q}
                className='group rounded-sm border border-site-700 bg-site-800/60 open:border-kolping-400/50'
              >
                <summary className='flex cursor-pointer list-none items-center justify-between gap-5 p-5 font-display text-lg font-bold tracking-tight text-site-50 marker:content-none sm:p-6 sm:text-xl'>
                  {item.q}
                  <span
                    className='text-2xl font-light text-kolping-400 transition-transform group-open:rotate-45'
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className='px-5 pb-5 sm:px-6 sm:pb-6'>
                  <div className='hairline-gold mb-4 w-10' />
                  <p className='text-sm leading-relaxed text-site-100 sm:text-base'>
                    {item.a}
                  </p>
                  {item.link ? (
                    item.link.startsWith('/') ? (
                      <Link
                        href={item.link === '/booking' ? ticketsHref : item.link}
                        className='mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-kolping-400 transition-colors hover:text-kolping-500'
                      >
                        {item.link === '/booking' && !bookingLive
                          ? 'Reservierung ab 1. Dezember'
                          : (item.button ?? 'Mehr erfahren')}{' '}
                        →
                      </Link>
                    ) : (
                      <a
                        href={item.link}
                        target={item.link.startsWith('mailto:') ? undefined : '_blank'}
                        rel={item.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                        className='mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-kolping-400 transition-colors hover:text-kolping-500'
                      >
                        {item.button ?? 'Mehr erfahren'} →
                      </a>
                    )
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {lowerSections}
    </div>
  )
}
