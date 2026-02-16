import Image from 'next/image'
import Link from 'next/link'
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

type TimelineItem = TimelineEntry & {
  year: string
  month: string
  order: number
}

type Play = {
  location: string | null
}

type TeamData = {
  current: { id: string }[]
  plays: Play[]
}

export const dynamic = 'force-static'

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
          <p className='text-site-100 text-sm sm:text-base max-w-lg mx-auto'>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

function ProductionCard({
  entry,
  index,
}: {
  entry: TimelineItem
  index: number
}) {
  const hasGallery = !!entry.galleryHash

  const cardContent = (
    <div
      className='group relative'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className='relative poster-frame border-epic bg-site-800 transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up'>
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/15 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />
        <div className='relative flex flex-col sm:flex-row overflow-hidden'>
          <div
            className='relative w-full sm:w-44 md:w-52 lg:w-60 aspect-[2/3] sm:aspect-auto sm:self-stretch overflow-hidden bg-site-900 shrink-0'
            style={{ backgroundColor: entry.dominantColor }}
          >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/20 via-transparent to-transparent' />
            </div>

            <Image
              src={`/img/${entry.image}`}
              alt={entry.header}
              fill
              className='object-contain transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110'
            />

            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-site-800/90 sm:block hidden z-10' />
            <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-site-800 via-site-800/60 to-transparent sm:hidden z-10' />

            <div className='absolute top-3 right-3 z-20 sm:hidden'>
              <div className='px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-kolping-500/40'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-kolping-400 font-mono whitespace-nowrap'>
                  {entry.month} {entry.year}
                </span>
              </div>
            </div>
          </div>

          <div className='relative flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center space-y-4'>
            <div className='hidden sm:flex items-center gap-3'>
              <div className='px-3 py-1 rounded-full bg-kolping-500/20 border border-kolping-500/30'>
                <span className='text-xs font-bold uppercase tracking-wider text-kolping-400 font-mono whitespace-nowrap'>
                  {entry.month} {entry.year}
                </span>
              </div>
              {hasGallery && (
                <div className='px-2.5 py-1 rounded-full bg-site-700/50'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-site-100'>
                    Galerie
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className='font-display font-bold text-xl sm:text-2xl text-site-50 group-hover:text-kolping-400 transition-colors duration-300'>
                {entry.header}
              </h3>
              <div className='w-12 h-0.5 bg-kolping-500 rounded-full mt-2 transition-all duration-500 group-hover:w-20' />
            </div>

            <p className='text-sm sm:text-base text-site-100 leading-relaxed line-clamp-4 sm:line-clamp-3'>
              {entry.text}
            </p>

            {hasGallery && (
              <div className='flex items-center gap-2 pt-2'>
                <span className='text-sm font-semibold text-kolping-400 group-hover:text-kolping-500 transition-colors'>
                  Galerie ansehen
                </span>
                <svg
                  className='w-5 h-5 text-kolping-400 transition-transform duration-300 group-hover:translate-x-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className='absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </div>
  )

  if (hasGallery) {
    return (
      <Link href={`/gallery/${entry.galleryHash}`} className='block'>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

function EventCard({
  entry,
  index,
}: {
  entry: TimelineItem
  index: number
}) {
  return (
    <div
      className='group relative animate-fade-in-up'
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className='absolute -left-[46px] sm:-left-[56px] top-5 z-10'>
        <div className='relative w-8 h-8 rounded-full border border-kolping-500/35 bg-site-900 flex items-center justify-center'>
          <div className='absolute -inset-1 bg-kolping-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity' />
          <span className='relative text-[10px] font-bold text-kolping-400'>
            {entry.order}
          </span>
        </div>
      </div>

      <div className='glass rounded-xl p-5 sm:p-6 space-y-3 transition-all duration-300 hover:border-kolping-500/30 hover:bg-site-800/80'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
          <div className='px-3 py-1 rounded-full bg-kolping-500/15 border border-kolping-500/25 w-fit'>
            <time className='text-xs font-bold text-kolping-400 uppercase tracking-wider font-mono whitespace-nowrap'>
              {entry.month} {entry.year}
            </time>
          </div>
          <span className='text-[10px] font-semibold uppercase tracking-[0.16em] text-site-100'>
            Ereignis
          </span>
          <h3 className='font-display text-lg sm:text-xl font-bold text-site-50 group-hover:text-kolping-400 transition-colors'>
            {entry.header}
          </h3>
        </div>

        <p className='text-sm sm:text-base text-site-100 leading-relaxed'>
          {entry.text}
        </p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const rawEntries = (timeline as TimelineEntry[]).slice().reverse()
  const entries: TimelineItem[] = rawEntries.map((entry, index) => {
    const { month, year } = parseDateParts(entry.date)
    return {
      ...entry,
      month,
      year,
      order: index + 1,
    }
  })
  const productionsInTimeline = entries.filter((entry) => !!entry.image).length
  const eventsInTimeline = entries.length - productionsInTimeline
  const theaterData = teamData as TeamData
  const yearsActive = new Date().getFullYear() - 2014
  const productionCount = theaterData.plays.length
  const ensembleCount = theaterData.current.length
  const stageFormats = new Set(
    theaterData.plays
      .map((play) => play.location)
      .filter((location): location is string => !!location),
  ).size

  return (
    <div className='space-y-0'>
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        <div className='relative w-full h-[75vh] min-h-[480px] max-h-[860px]'>
          <Image
            src='/img/other_images/Gruppenbild.jpg'
            alt='Ensemble des Kolping-Open-Air-Theaters Ramsen'
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/35 via-site-950/25 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/55 via-transparent to-site-950/35' />
          <div className='vignette' />

          <div className='absolute inset-0 flex flex-col justify-end pb-10 sm:pb-14 md:pb-16'>
            <div className='mx-auto w-full max-w-6xl px-4'>
              <div className='animate-fade-in-up mb-4 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-kolping-400 uppercase'>
                  Seit 2014
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                  Open-Air & Kreativbühne
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                  Eintritt frei
                </span>
              </div>

              <h1 className='animate-fade-in-up font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-shadow-lg'>
                Über uns
                <br />
                <span className='text-kolping-400'>Kolpingtheater Ramsen</span>
              </h1>

              <p className='animate-fade-in-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Wir schreiben unsere eigenen Geschichten und bringen sie als
                Sommer- und Winterproduktionen auf die Bühne. Gemeinschaft,
                Kreativität und Theater für alle stehen dabei im Mittelpunkt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='relative -mx-4 border-y border-site-700 bg-site-900'>
        <div className='mx-auto max-w-6xl px-4 py-6 sm:py-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center'>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {yearsActive}
              </div>
              <div className='mt-1 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-site-100'>
                Jahre Bühne
              </div>
            </div>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {productionCount}
              </div>
              <div className='mt-1 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-site-100'>
                Produktionen
              </div>
            </div>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {ensembleCount}
              </div>
              <div className='mt-1 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-site-100'>
                Ensemble
              </div>
            </div>
            <div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {stageFormats}
              </div>
              <div className='mt-1 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-site-100'>
                Bühnenformate
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-6 sm:space-y-8'>
        <SectionDivider
          title='Wer wir sind'
          subtitle='Theatergruppe, Team und Treffpunkt in Ramsen'
        />

        <div className='grid lg:grid-cols-[1.2fr_1fr] gap-6 sm:gap-8'>
          <div className='glass border-epic relative isolate rounded-xl p-6 sm:p-8 space-y-5'>
            <p className='text-site-50 text-base sm:text-lg leading-relaxed'>
              Das Kolping-Open-Air-Theater Ramsen entwickelt seit 2014 eigene
              Stücke und bringt sie jährlich zur Premiere. Unser großes
              Sommerstück auf der Kolpingwiese und die Kreativbühne im Winter
              verbinden historische Stoffe, Fantasie und aktuelle Themen.
            </p>
            <p className='text-site-100 text-sm sm:text-base leading-relaxed'>
              Ob auf der Bühne, in der Technik, beim Bau, in Kostüm oder
              Organisation: Wir arbeiten als Gemeinschaft und schaffen Theater,
              das für alle offen ist.
            </p>
            <div className='relative z-20 pt-2 flex flex-wrap gap-3'>
              <Link
                href='/team'
                className='relative z-20 inline-flex items-center gap-2 rounded-full bg-kolping-400 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_24px_rgba(255,122,0,0.25)]'
              >
                Unser Team
              </Link>
              <Link
                href='/contact'
                className='relative z-20 inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/70 px-5 py-2.5 text-sm font-medium transition-all hover:border-kolping-400/60 hover:bg-site-800'
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>

          <div className='glass rounded-xl p-6 sm:p-8 space-y-5'>
            <h3 className='font-display text-2xl font-bold tracking-tight'>
              Treffpunkt & Proben
            </h3>
            <div className='space-y-4 text-sm sm:text-base'>
              <div className='rounded-lg bg-site-800/60 border border-site-700 p-4'>
                <div className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold mb-1'>
                  Ort
                </div>
                <p className='text-site-50'>Klosterhof 7, 67305 Ramsen</p>
              </div>
              <div className='rounded-lg bg-site-800/60 border border-site-700 p-4'>
                <div className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold mb-1'>
                  Regelmäßige Probe
                </div>
                <p className='text-site-50'>Jeden Mittwoch, 19:00 Uhr</p>
              </div>
              <div className='rounded-lg bg-site-800/60 border border-site-700 p-4'>
                <div className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold mb-1'>
                  Mitmachen
                </div>
                <p className='text-site-100'>
                  Schauspiel, Technik oder Organisation: neue Gesichter sind
                  immer willkommen.
                </p>
              </div>
            </div>
            <a
              href='https://www.instagram.com/kolpingjugend_ramsen/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 text-sm text-kolping-400 hover:text-kolping-500 transition-colors'
            >
              Instagram ansehen
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-8 sm:pb-12 space-y-4' aria-labelledby='timeline-heading'>
        <SectionDivider
          title='Chronik'
          subtitle='Vom ersten Impuls bis zu den neuesten Produktionen'
        />

        <h2 id='timeline-heading' className='sr-only'>
          Chronik
        </h2>

        <div className='grid gap-3 sm:gap-4 sm:grid-cols-3'>
          <div className='glass rounded-xl border border-site-700 p-4 sm:p-5'>
            <p className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold'>
              Gesamt
            </p>
            <p className='mt-2 font-display text-3xl font-black text-site-50'>
              {entries.length}
            </p>
            <p className='text-sm text-site-100'>Meilensteine seit 2014</p>
          </div>
          <div className='glass rounded-xl border border-site-700 p-4 sm:p-5'>
            <p className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold'>
              Produktionen
            </p>
            <p className='mt-2 font-display text-3xl font-black text-site-50'>
              {productionsInTimeline}
            </p>
            <p className='text-sm text-site-100'>Einträge mit Bühnenbild/Galerie</p>
          </div>
          <div className='glass rounded-xl border border-site-700 p-4 sm:p-5'>
            <p className='text-[11px] tracking-[0.18em] uppercase text-kolping-400 font-semibold'>
              Ereignisse
            </p>
            <p className='mt-2 font-display text-3xl font-black text-site-50'>
              {eventsInTimeline}
            </p>
            <p className='text-sm text-site-100'>Probenstarts, Preise und Wendepunkte</p>
          </div>
        </div>

        <div className='relative pl-8 sm:pl-10'>
          <div className='absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-kolping-500/80 via-site-700 to-site-700' />
          <div className='grid gap-5 sm:gap-6 md:grid-cols-2'>
            {entries.map((entry, index) => {
              const isProduction = !!entry.image
              return (
                <div
                  key={`${entry.date}-${entry.header}`}
                  className={isProduction ? 'md:col-span-2' : ''}
                >
                  {isProduction ? (
                    <ProductionCard entry={entry} index={index} />
                  ) : (
                    <EventCard entry={entry} index={index} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700 force-dark'>
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/10 via-site-900 to-site-900' />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-400/[0.05] to-transparent' />

          <div className='relative p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='flex-1 text-center md:text-left'>
              <span className='block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-kolping-400 font-semibold mb-3'>
                Mitmachen
              </span>
              <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight'>
                Werde Teil
                <br className='hidden sm:block' />
                der Theatergruppe
              </h2>
              <p className='text-site-100 mt-3 sm:mt-4 text-sm sm:text-base max-w-md leading-relaxed'>
                Wenn du Lust auf Schauspiel, Technik oder kreative Arbeit hast,
                melde dich bei uns. Wir freuen uns auf neue Ideen.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <Link
                href='/contact'
                className='group inline-flex items-center gap-2.5 rounded-full bg-kolping-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.3)]'
              >
                Kontakt
                <svg className='w-4 h-4 transition-transform group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </Link>
              <Link
                href='/team'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/50 px-6 py-3 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Team ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
