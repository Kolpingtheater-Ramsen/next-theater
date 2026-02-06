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
    <div className='space-y-0'>
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        <div className='relative w-full h-[72vh] min-h-[460px] max-h-[820px]'>
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes='100vw'
            className='absolute inset-0 h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/30 via-site-950/35 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/60 via-transparent to-site-950/40' />
          <div className='vignette' />

          <div className='absolute inset-0'>
            <div className='mx-auto max-w-6xl px-4 pt-8'>
              <Link
                href='/gallery'
                className='inline-flex items-center gap-2 text-site-100 hover:text-kolping-400 transition-colors group'
              >
                <svg className='w-5 h-5 transition-transform group-hover:-translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                <span className='text-sm font-medium'>Zurück zur Galerie</span>
              </Link>
            </div>

            <div className='absolute inset-x-0 bottom-0 pb-10 sm:pb-14 md:pb-16'>
              <div className='mx-auto max-w-6xl px-4'>
                <div className='mb-4 flex flex-wrap items-center gap-2.5'>
                  {dateRaw && (
                    <span className='inline-flex items-center rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-kolping-400 uppercase'>
                      {month} {year}
                    </span>
                  )}
                  {locationLabel && (
                    <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                      {locationLabel}
                    </span>
                  )}
                  {hasImages && (
                    <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                      {metas!.length} Fotos
                    </span>
                  )}
                </div>

                <h1
                  className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.94] text-shadow-lg'
                  style={{ viewTransitionName: `gallery-title-${play}` }}
                >
                  <span className='text-site-50'>{title}</span>
                </h1>

                <p className='mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                  {hasImages
                    ? 'Alle verfügbaren Szenen dieser Produktion in einer zusammenhängenden Galerie.'
                    : 'Für diese Produktion sind aktuell noch keine Bilder veröffentlicht.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!hasImages ? (
        <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16'>
          <div className='glass rounded-2xl border border-site-700 p-8 sm:p-10 text-center'>
            <div className='mx-auto w-16 h-16 rounded-full bg-kolping-500/10 border border-kolping-500/30 flex items-center justify-center mb-5'>
              <svg className='w-8 h-8 text-kolping-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold text-site-50'>
              Noch keine Galerie verfügbar
            </h2>
            <p className='mt-2 text-site-100 max-w-lg mx-auto'>
              Sobald Bilder zu dieser Produktion veröffentlicht sind, erscheinen sie hier.
            </p>
            <div className='mt-6 flex justify-center gap-3'>
              <Link
                href='/gallery'
                className='inline-flex items-center gap-2 rounded-full bg-kolping-400 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-kolping-500'
              >
                Alle Produktionen
              </Link>
              <Link
                href='/about'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/50 px-5 py-2.5 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Zur Chronik
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className='mx-auto max-w-6xl px-4 py-8 sm:py-10'>
          <div className='rounded-xl border border-site-700 bg-site-800/50 p-4 sm:p-5 text-sm text-site-100'>
            Tipp: Klicke auf ein Bild, um es im Lightbox-Modus in voller Größe zu öffnen.
          </div>

          <SectionDivider
            title='Fotogalerie'
            subtitle='Szenen, Details und Momente dieser Aufführung'
          />

          <div className='glass border border-site-700 rounded-2xl p-3 sm:p-4 md:p-6'>
            <ClientGrid play={play} metas={metas!} captions={captions!} />
          </div>
        </section>
      )}

      <section className='mx-auto max-w-6xl px-4 pb-12 sm:pb-16'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700'>
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/10 via-site-900 to-site-900' />
          <div className='relative p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm sm:text-base text-site-100 text-center sm:text-left'>
              Weitere Produktionen oder das Team hinter dem Stück entdecken.
            </p>
            <div className='flex items-center gap-3'>
              <Link
                href='/gallery'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/60 px-5 py-2.5 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Zur Galerie
              </Link>
              <Link
                href='/team'
                className='inline-flex items-center gap-2 rounded-full bg-kolping-400 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-kolping-500'
              >
                Zum Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
