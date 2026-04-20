import Link from 'next/link'
import Image from 'next/image'
import timeline from '@/data/timeline.json'
import teamData from '@/data/team.json'

type TimelineEntry = {
  date: string
  header: string
  text: string
  image?: string
  galleryHash?: string
  dominantColor?: string
}

type TimelineShow = TimelineEntry & {
  year: string
  month: string
  location?: string | null
}

type Play = {
  slug: string | null
  location: string | null
}

function parseDateParts(date: string) {
  const parts = date.trim().split(' ').filter(Boolean)
  const year = parts[parts.length - 1] ?? date
  const month = parts.slice(0, -1).join(' ') || date
  return { month, year }
}

function ProductionPoster({
  show,
  index,
  size = 'default',
}: {
  show: TimelineShow
  index: number
  size?: 'default' | 'hero'
}) {
  const locationLabel =
    show.location === 'Open-Air-Bühne'
      ? 'Open-Air'
      : show.location === 'Kreativbühne'
        ? 'Kreativbühne'
        : null

  const isHero = size === 'hero'

  return (
    <Link
      href={`/gallery/${show.galleryHash}`}
      aria-label={`Galerie ansehen: ${show.header}`}
      className='group relative block animate-fade-in-up'
      style={{
        viewTransitionName: `gallery-${show.galleryHash}`,
        animationDelay: `${Math.min(index, 24) * 40}ms`,
      }}
    >
      <article className='relative'>
        <div
          className={[
            'relative overflow-hidden border-epic rounded-xl bg-site-950 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:-translate-y-1',
            isHero
              ? 'aspect-[21/9] sm:aspect-[16/7]'
              : 'aspect-[4/5] sm:aspect-[3/4]',
          ].join(' ')}
          style={{ backgroundColor: show.dominantColor }}
        >
          <Image
            src={`/img/${show.image}`}
            alt={show.header}
            fill
            sizes={
              isHero
                ? '100vw'
                : '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'
            }
            priority={isHero}
            className='object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.05]'
            style={{ viewTransitionName: `gallery-image-${show.galleryHash}` }}
          />

          <div className='sweep' aria-hidden />
          <div className='absolute inset-0 scanlines opacity-15' aria-hidden />

          {/* Tonal overlays — subtle all-over tint + heavy bottom scrim for title */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20' aria-hidden />
          <div className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 via-40% to-transparent' aria-hidden />
          <div className='absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent' aria-hidden />

          {/* Corner ticks */}
          <span className='absolute top-2 left-2 w-3 h-3 border-l border-t border-kolping-400/60' aria-hidden />
          <span className='absolute top-2 right-2 w-3 h-3 border-r border-t border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-kolping-400/60' aria-hidden />

          {/* Top meta row */}
          <div className='absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-3'>
            <div className='flex flex-wrap gap-2'>
              {locationLabel && (
                <span className='inline-flex items-center font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white bg-black/55 backdrop-blur-sm border border-white/15 rounded-sm px-2 py-1'>
                  {locationLabel}
                </span>
              )}
            </div>
            <div
              className={[
                'font-display italic text-kolping-300 tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-none',
                isHero
                  ? 'text-3xl sm:text-5xl md:text-6xl'
                  : 'text-xl sm:text-2xl',
              ].join(' ')}
            >
              {show.year}
            </div>
          </div>

          {/* Bottom content */}
          <div className='absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10'>
            {isHero && (
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                Jüngste Produktion · {show.month}
              </div>
            )}
            <h3
              className={[
                'font-display font-black uppercase tracking-tight leading-[0.95] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] group-hover:text-kolping-400 transition-colors',
                isHero
                  ? 'text-3xl sm:text-5xl md:text-6xl'
                  : 'text-xl sm:text-2xl',
              ].join(' ')}
            >
              {show.header}
            </h3>
            <div className='mt-3 flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/85 group-hover:text-kolping-400 transition-colors'>
              <span className='h-px w-6 sm:w-10 bg-kolping-400 transition-all group-hover:w-16' aria-hidden />
              Galerie öffnen
              <span className='transition-transform group-hover:translate-x-1' aria-hidden>
                →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function GalleryPage() {
  const plays = (teamData as { plays: Play[] }).plays
  const locationBySlug = new Map<string, string | null>(
    plays
      .filter((play): play is Play & { slug: string } => !!play.slug)
      .map((play) => [play.slug, play.location]),
  )

  const shows: TimelineShow[] = (timeline as TimelineEntry[])
    .filter(
      (entry): entry is TimelineEntry & Required<Pick<TimelineEntry, 'image' | 'galleryHash'>> =>
        !!entry.image && !!entry.galleryHash,
    )
    .reverse()
    .map((entry) => {
      const { month, year } = parseDateParts(entry.date)
      return {
        ...entry,
        month,
        year,
        location: locationBySlug.get(entry.galleryHash) ?? null,
      }
    })

  const latestShow = shows[0]
  const [featuredShow, ...restShows] = shows

  // Founding year — the earliest year in the full timeline (not just the ones
  // with galleries). First timeline entry is the "Gründung".
  const foundingYear = (() => {
    const ys = (timeline as TimelineEntry[])
      .map((e) => (e.date ?? '').trim().match(/(\d{4})$/)?.[1])
      .filter((y): y is string => Boolean(y))
      .map((y) => parseInt(y, 10))
    return ys.length ? Math.min(...ys) : null
  })()

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden force-dark'>
        <div className='relative w-full h-[72vh] min-h-[460px] max-h-[820px]'>
          <Image
            src={latestShow?.galleryHash ? `/img/banners/${latestShow.galleryHash}.jpg` : '/img/home_team.jpg'}
            alt={latestShow ? `Aktuelle Produktion: ${latestShow.header}` : 'Galerie des Kolpingtheaters Ramsen'}
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/35 via-site-950/30 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/60 via-transparent to-site-950/35' />
          <div className='vignette' />

          <div className='absolute inset-0 flex flex-col justify-end pb-10 sm:pb-14 md:pb-16'>
            <div className='mx-auto w-full max-w-6xl px-4'>
              <div className='animate-fade-in-up mb-4 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-kolping-400 uppercase'>
                  Fotoarchive
                </span>
              </div>

              <h1 className='animate-fade-in-up font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-shadow-lg'>
                Unsere Galerie
                <br />
                <span className='text-kolping-400'>Produktionen im Rückblick</span>
              </h1>

              <p className='animate-fade-in-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Entdecke die wichtigsten Momente unserer Stücke von den ersten
                Open-Air-Abenden bis zu den neuesten Winterproduktionen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STAT STRIP ══════ */}
      <section className='bg-site-950 border-b border-site-700'>
        <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10 grid grid-cols-2 gap-2 sm:gap-8 divide-x divide-site-700/80 text-center'>
          {[
            { value: String(shows.length).padStart(2, '0'), label: 'Produktionen' },
            { value: `${foundingYear}`, label: 'seit' },
          ].map(({ value, label }) => (
            <div key={label} className='px-2'>
              <div className='font-display italic text-4xl sm:text-6xl text-kolping-400/90 leading-none tabular-nums'>
                {value}
              </div>
              <div className='mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-site-300'>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURED — latest production as marquee ══════ */}
      {featuredShow && (
        <section className='relative bg-site-950 scroll-mt-24'>
          <div className='mx-auto max-w-7xl px-4 sm:px-8 pt-16 sm:pt-24 pb-8 sm:pb-12'>
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                  Zuletzt auf der Bühne
                </div>
                <h2 className='font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                  Aktuelles <span className='italic text-kolping-400'>Werk</span>
                </h2>
                <div className='hairline-gold w-24 mt-5' />
              </div>
            </div>

            <ProductionPoster show={featuredShow} index={0} size='hero' />
          </div>
        </section>
      )}

      {/* ══════ ARCHIVE GRID ══════ */}
      {restShows.length > 0 && (
        <section className='relative bg-site-950 border-t border-site-700 scroll-mt-24'>
          <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-14 sm:py-20'>
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                  Archiv
                </div>
                <h2 className='font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                  Das <span className='italic text-kolping-400'>Repertoire</span>
                </h2>
                <div className='hairline-gold w-24 mt-5' />
              </div>
              <p className='max-w-sm text-site-100/80 text-sm sm:text-base leading-relaxed'>
                Sämtliche dokumentierte Produktionen in chronologischer
                Reihenfolge — vom jüngsten Stück zurück zu unseren Anfängen.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10'>
              {restShows.map((show, index) => (
                <ProductionPoster
                  key={show.galleryHash}
                  show={show}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ CTA — Clapperboard ══════ */}
      <section className='relative bg-site-950 py-16 sm:py-24 px-4 sm:px-8 force-dark'>
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />

          <div className='relative p-8 sm:p-12 md:p-16 bg-site-900'>
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none' aria-hidden />

            <div className='relative grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                  Hinter den Bildern
                </div>
                <h3 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'>
                  Triff das <span className='italic text-kolping-400'>Ensemble</span>
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  Die Gesichter hinter und vor der Kamera — Schauspiel, Technik
                  und Organisation auf einen Blick.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:items-end'>
                <Link
                  href='/team'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                >
                  Zum Team
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
                <Link
                  href='/about'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  ↺ Chronik ansehen
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
