export const runtime = 'edge'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ClientGrid from './ClientGrid'
import pics from '@/data/pics.json'
import imagesMeta from '@/data/images.json'
import timeline from '@/data/timeline.json'
import team from '@/data/team.json'

type PhotoMeta = { width: number; height: number; alt: string; index: number }

type Play = {
  play: string
  slug: string | null
  year: number
  location: string | null
  gallery: boolean
}

type TimelineEntry = {
  galleryHash?: string
  header?: string
  date?: string
  image?: string
  dominantColor?: string
}

const plays: Play[] = (team as { plays: Play[] }).plays

function parseDateParts(date: string) {
  const parts = date.trim().split(' ').filter(Boolean)
  const year = parts[parts.length - 1] ?? date
  const month = parts.slice(0, -1).join(' ') || date
  return { month, year }
}

export default async function PlayGalleryPage({
  params,
}: {
  params: Promise<{ play: string }>
}) {
  const { play } = await params
  const key = play as keyof typeof pics
  const captions = (pics as Record<string, string[]>)[key]
  const metas = (imagesMeta as Record<string, PhotoMeta[]>)[key]
  const hasImages = Boolean(captions && metas && metas.length > 0)

  const timelineEntry = (timeline as TimelineEntry[]).find(
    (entry) => entry.galleryHash === play,
  )
  const playData = plays.find((entry) => entry.slug === play)
  const isValidPlay = Boolean(playData || timelineEntry)
  if (!isValidPlay) return notFound()

  const title = timelineEntry?.header || playData?.play || play
  const dateRaw = timelineEntry?.date || (playData?.year ? String(playData.year) : '')
  const { month, year } = parseDateParts(dateRaw)
  const location = playData?.location || null
  const locationLabel =
    location === 'Open-Air-Bühne'
      ? 'Open-Air'
      : location === 'Kreativbühne'
        ? 'Kreativbühne'
        : null
  const heroImage = timelineEntry?.image ? `/img/${timelineEntry.image}` : '/img/home_team.jpg'

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden'>
        <div className='relative w-full h-[72vh] min-h-[460px] max-h-[820px]'>
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes='100vw'
            className='absolute inset-0 h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/35 via-site-950/30 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/60 via-transparent to-site-950/35' />
          <div className='vignette' />

          <div className='absolute inset-0'>
            <div className='mx-auto max-w-6xl px-4 pt-8'>
              <Link
                href='/gallery'
                className='group inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-site-100 hover:text-kolping-400 transition-colors'
              >
                <span className='transition-transform group-hover:-translate-x-1'>←</span>
                Zurück zur Galerie
              </Link>
            </div>

            <div className='absolute inset-x-0 bottom-0 pb-10 sm:pb-14 md:pb-16'>
              <div className='mx-auto max-w-6xl px-4'>
                <div className='mb-5 flex flex-wrap items-center gap-2.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em]'>
                  {dateRaw && (
                    <span className='inline-flex items-center rounded-md border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1.5 text-kolping-400'>
                      {month} {year}
                    </span>
                  )}
                  {locationLabel && (
                    <span className='inline-flex items-center rounded-md border border-white/20 bg-black/55 backdrop-blur-sm px-3 py-1.5 text-white'>
                      {locationLabel}
                    </span>
                  )}
                  {hasImages && (
                    <span className='inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/55 backdrop-blur-sm px-3 py-1.5 text-white'>
                      <span className='text-kolping-400'>{metas!.length}</span>
                      Fotos
                    </span>
                  )}
                </div>

                <h1
                  className='font-display font-black leading-[0.88] tracking-tight text-shadow-lg'
                  style={{ viewTransitionName: `gallery-title-${play}` }}
                >
                  <span className='block text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic text-kolping-400 drop-shadow-[0_6px_28px_rgba(255,122,0,0.35)]'>
                    {title}
                  </span>
                </h1>

                <div className='hairline-gold w-32 mt-6' />

                <p className='mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                  {hasImages
                    ? 'Alle verfügbaren Szenen dieser Produktion in einer zusammenhängenden Galerie.'
                    : 'Für diese Produktion sind aktuell noch keine Bilder veröffentlicht.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PHOTO GRID ══════ */}
      {hasImages ? (
        <section className='relative bg-site-950 border-t border-site-700'>
          <div className='mx-auto max-w-7xl px-4 sm:px-8 pt-14 sm:pt-20 pb-8 sm:pb-12'>
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                  Foto-Archiv
                </div>
                <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                  Die <span className='italic text-kolping-400'>Szenen</span>
                </h2>
                <div className='hairline-gold w-24 mt-5' />
              </div>
              <p className='max-w-sm text-site-100/80 text-sm sm:text-base leading-relaxed font-mono text-[11px] uppercase tracking-[0.25em]'>
                Klick auf ein Bild öffnet die Lightbox
              </p>
            </div>

            <ClientGrid
              play={play}
              metas={metas!}
              captions={captions!}
              title={title}
            />
          </div>
        </section>
      ) : (
        <section className='relative bg-site-950 border-t border-site-700'>
          <div className='relative mx-auto max-w-4xl px-4 sm:px-8 py-20 sm:py-28 text-center'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-5'>
              Vorhang noch nicht offen
            </div>
            <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
              Noch keine <span className='italic text-kolping-400'>Bilder.</span>
            </h2>
            <div className='hairline-gold w-24 mt-6 mx-auto' />
            <p className='mt-6 text-site-100/80 max-w-md mx-auto text-sm sm:text-base leading-relaxed'>
              Sobald Bilder zu dieser Produktion veröffentlicht sind, erscheinen
              sie hier.
            </p>
            <div className='mt-8 flex justify-center gap-3'>
              <Link
                href='/gallery'
                className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
              >
                Alle Produktionen
                <span className='transition-transform group-hover:translate-x-1'>→</span>
              </Link>
              <Link
                href='/about'
                className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-800/60 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 hover:border-kolping-400/40 transition-all'
              >
                Zur Chronik
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════ CTA — Clapperboard ══════ */}
      <section className='relative bg-site-950 py-14 sm:py-20 px-4 sm:px-8'>
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          <div className='clapper-stripes h-5 sm:h-7' aria-hidden />
          <div className='relative p-6 sm:p-10 md:p-14 bg-site-900'>
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none' aria-hidden />
            <div className='relative grid sm:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                  Weiter stöbern
                </div>
                <h3 className='font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]'>
                  Noch mehr <span className='italic text-kolping-400'>Szenen?</span>
                </h3>
                <p className='mt-4 text-site-100/80 text-sm sm:text-base max-w-lg leading-relaxed'>
                  Weitere Produktionen oder das Team hinter dem Stück entdecken.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                <Link
                  href='/gallery'
                  className='inline-flex items-center justify-center gap-2 border border-site-700 bg-site-800/60 px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:border-kolping-400/50 hover:text-kolping-400 transition-all'
                >
                  Zur Galerie
                </Link>
                <Link
                  href='/team'
                  className='group inline-flex items-center justify-center gap-2 bg-kolping-400 hover:bg-kolping-500 px-6 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Zum Team
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className='clapper-stripes h-5 sm:h-7' aria-hidden />
        </div>
      </section>
    </div>
  )
}
