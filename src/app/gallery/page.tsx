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

function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className='relative py-8 sm:py-12'>
      <div className='relative text-center space-y-3'>
        <div className='flex items-center justify-center gap-4'>
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-8 h-px bg-gradient-to-l from-kolping-500 to-transparent' />
            <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
            <div className='w-16 h-px bg-gradient-to-l from-kolping-500/80 to-transparent' />
          </div>

          <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
            {title}
          </h2>

          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-16 h-px bg-gradient-to-r from-kolping-500/80 to-transparent' />
            <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
            <div className='w-8 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
          </div>
        </div>

        {subtitle && (
          <p className='text-site-100 text-sm sm:text-base max-w-xl mx-auto'>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

function GalleryCard({
  show,
  index,
  isHero,
}: {
  show: TimelineShow
  index: number
  isHero?: boolean
}) {
  const locationLabel =
    show.location === 'Open-Air-Bühne'
      ? 'Open-Air'
      : show.location === 'Kreativbühne'
        ? 'Kreativbühne'
        : null

  return (
    <Link
      href={`/gallery/${show.galleryHash}`}
      className='group relative block'
      aria-label={`Galerie ansehen: ${show.header}`}
      style={{ viewTransitionName: `gallery-${show.galleryHash}` }}
    >
      <div
        className='relative poster-frame border-epic bg-site-800 transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up'
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />

        <div
          className={`relative overflow-hidden bg-site-800 ${isHero ? 'aspect-[21/9] sm:aspect-[16/8] md:aspect-[16/6]' : 'aspect-[16/10]'}`}
          style={{ backgroundColor: show.dominantColor }}
        >
          <Image
            src={`/img/${show.image}`}
            alt={show.header}
            fill
            className={`transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 ${isHero ? 'object-cover' : 'object-cover object-center'}`}
            style={{ viewTransitionName: `gallery-image-${show.galleryHash}` }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15 z-10' />

          <div className='absolute top-3 left-3 z-20 flex items-center gap-2'>
            <span className='rounded-full border border-kolping-500/45 bg-black/65 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-kolping-400'>
              {show.month} {show.year}
            </span>
            {locationLabel && (
              <span className='rounded-full border border-site-700 bg-site-900/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-site-100'>
                {locationLabel}
              </span>
            )}
          </div>

          <div className='absolute bottom-0 inset-x-0 p-4 sm:p-5 z-20'>
            <h3 className={`font-display font-black text-white drop-shadow-lg group-hover:text-kolping-400 transition-colors duration-300 ${isHero ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-base sm:text-lg md:text-xl'}`}>
              {show.header}
            </h3>
            <div className='mt-2 flex items-center gap-2 text-sm text-white/80 group-hover:text-kolping-400 transition-colors'>
              Galerie öffnen
              <svg className='w-4 h-4 transition-transform group-hover:translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </div>
          </div>
        </div>

        <div className='h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
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
    .filter((entry): entry is TimelineEntry & Required<Pick<TimelineEntry, 'image' | 'galleryHash'>> => !!entry.image && !!entry.galleryHash)
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

  const yearGroups = shows.reduce<Record<string, TimelineShow[]>>((acc, show) => {
    if (!acc[show.year]) acc[show.year] = []
    acc[show.year].push(show)
    return acc
  }, {})
  const years = Object.keys(yearGroups)
  const latestShow = shows[0]

  return (
    <div className='space-y-0'>
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        <div className='relative w-full h-[72vh] min-h-[460px] max-h-[820px]'>
          <Image
            src='/img/home_team.jpg'
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
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                  Open-Air & Kreativbühne
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

      <section className='relative -mx-4 border-y border-site-700 bg-site-900'>
        <div className='mx-auto max-w-6xl px-4 py-5 sm:py-6'>
          <div className='grid sm:grid-cols-3 gap-3 sm:gap-4'>
            <div className='rounded-lg border border-site-700 bg-site-800/60 px-4 py-3 text-sm text-site-100'>
              Archiv: Alle verfügbaren Produktionen nach Jahr geordnet.
            </div>
            <div className='rounded-lg border border-site-700 bg-site-800/60 px-4 py-3 text-sm text-site-100'>
              Schnellzugriff: Über die Jahresleiste direkt zur gewünschten Saison springen.
            </div>
            <div className='rounded-lg border border-site-700 bg-site-800/60 px-4 py-3 text-sm text-site-100'>
              Detailansicht: In jeder Produktion stehen Fotos im Lightbox-Modus bereit.
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-8 sm:py-10'>
        <SectionDivider
          title='Produktionen nach Jahr'
          subtitle='Schneller Zugriff auf jede Spielzeit'
        />

        <div className='sticky top-[72px] z-20 backdrop-blur supports-[backdrop-filter]:bg-site-900/55 bg-site-900/75 rounded-xl border border-site-700/60 p-3'>
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-thin'>
            {years.map((year) => (
              <a
                key={year}
                href={`#gallery-year-${year}`}
                className='shrink-0 inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/80 px-3 py-1.5 text-xs text-site-100 hover:border-kolping-400/60 hover:text-kolping-400 transition-colors'
              >
                <span className='font-semibold'>{year}</span>
                <span className='inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-site-700 text-[10px] text-site-100'>
                  {yearGroups[year].length}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className='pt-8 sm:pt-10 space-y-12 sm:space-y-14'>
          {years.map((year, yearIndex) => {
            const group = yearGroups[year]
            const [hero, ...rest] = group
            const hasFeatured = yearIndex === 0 && !!hero
            const gridItems = hasFeatured ? rest : group

            return (
              <section
                key={year}
                id={`gallery-year-${year}`}
                className='scroll-mt-32 space-y-4'
              >
                <div className='flex items-center gap-3'>
                  <h2 className='font-display text-3xl sm:text-4xl font-black text-kolping-400 tracking-tight'>
                    {year}
                  </h2>
                  <div className='h-px flex-1 bg-gradient-to-r from-kolping-500/50 to-transparent' />
                  <span className='rounded-full border border-site-700 bg-site-800/70 px-3 py-1 text-xs text-site-100'>
                    {group.length} Produktionen
                  </span>
                </div>

                {hasFeatured && hero && <GalleryCard show={hero} index={yearIndex} isHero />}

                {gridItems.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                    {gridItems.map((show, index) => (
                      <GalleryCard
                        key={show.galleryHash}
                        show={show}
                        index={yearIndex * 10 + index}
                      />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700'>
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/10 via-site-900 to-site-900' />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-400/[0.05] to-transparent' />

          <div className='relative p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='flex-1 text-center md:text-left'>
              <span className='block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-kolping-400 font-semibold mb-3'>
                Mehr entdecken
              </span>
              <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight'>
                Hinter den Bildern
                <br className='hidden sm:block' />
                steckt das Team
              </h2>
              <p className='text-site-100 mt-3 sm:mt-4 text-sm sm:text-base max-w-md leading-relaxed'>
                Schau dir an, wer die Produktionen auf, vor und hinter der
                Bühne möglich macht.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <Link
                href='/team'
                className='group inline-flex items-center gap-2.5 rounded-full bg-kolping-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.3)]'
              >
                Zum Team
                <svg className='w-4 h-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
              <Link
                href='/about'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/50 px-6 py-3 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Chronik ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
