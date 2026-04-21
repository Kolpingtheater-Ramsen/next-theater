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
  year?: number
  play?: string
  gallery?: boolean
  slug?: string
}

type TeamData = {
  current: { id: string }[]
  plays: Play[]
}

export const dynamic = 'force-static'

const MONTH_ORDER: Record<string, number> = {
  januar: 1, februar: 2, märz: 3, maerz: 3, april: 4, mai: 5, juni: 6,
  juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12,
}

function parseDateParts(date: string) {
  const parts = date.trim().split(' ').filter(Boolean)
  const year = parts[parts.length - 1] ?? date
  const month = parts.slice(0, -1).join(' ') || date
  return { month, year }
}

function SectionHead({
  eyebrow,
  title,
  accent,
  body,
  align = 'left',
}: {
  eyebrow: string
  title: string
  accent?: string
  body?: string
  align?: 'left' | 'center'
}) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start'
  return (
    <div className={`flex flex-col ${alignCls} gap-4`}>
      <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400'>
        {eyebrow}
      </div>
      <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
        {title}
        {accent && (
          <>
            {' '}
            <span className='italic text-kolping-400'>{accent}</span>
          </>
        )}
      </h2>
      <div className='hairline-gold w-24' />
      {body && (
        <p className='max-w-2xl text-site-100/80 text-sm sm:text-base leading-relaxed'>
          {body}
        </p>
      )}
    </div>
  )
}

function ProductionCard({ entry }: { entry: TimelineItem }) {
  const hasGallery = !!entry.galleryHash
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    hasGallery ? (
      <Link href={`/gallery/${entry.galleryHash}`} className='block group/card'>
        {children}
      </Link>
    ) : (
      <div className='block group/card'>{children}</div>
    )

  return (
    <Wrapper>
      <article className='relative grid sm:grid-cols-[200px_1fr] gap-5 sm:gap-7'>
        {/* Poster */}
        <div
          className='relative aspect-[2/3] overflow-hidden rounded-xl border-epic bg-site-900 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover/card:-translate-y-1'
          style={{ backgroundColor: entry.dominantColor }}
        >
          <Image
            src={`/img/${entry.image}`}
            alt={entry.header}
            fill
            sizes='(min-width: 640px) 200px, 100vw'
            className='object-cover object-center transition-all duration-[900ms] ease-out group-hover/card:scale-[1.06]'
          />
          <div className='sweep' aria-hidden />
          <div className='absolute inset-0 scanlines opacity-20' aria-hidden />
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' aria-hidden />

          {/* corner tick marks */}
          <span className='absolute top-2 left-2 w-3 h-3 border-l border-t border-kolping-400/60' aria-hidden />
          <span className='absolute top-2 right-2 w-3 h-3 border-r border-t border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-kolping-400/60' aria-hidden />

          <div className='absolute inset-x-0 bottom-0 p-3 z-10'>
            <div className='text-[9px] font-mono uppercase tracking-[0.3em] text-kolping-300/90'>
              {entry.month}
            </div>
          </div>
        </div>

        {/* Text block */}
        <div className='flex flex-col justify-center space-y-3'>
          <div className='flex items-center gap-3 flex-wrap'>
            <span className='font-mono text-[10px] uppercase tracking-[0.3em] text-site-300'>
              {entry.month} {entry.year}
            </span>
            {hasGallery && (
              <span className='inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-kolping-400 px-2 py-0.5 rounded-sm bg-kolping-500/10 border border-kolping-500/30'>
                <span className='w-1 h-1 rounded-full bg-kolping-400 animate-pulse' />
                Galerie
              </span>
            )}
          </div>
          <h3 className='font-display text-2xl sm:text-3xl uppercase tracking-tight text-site-50 group-hover/card:text-kolping-400 transition-colors leading-tight'>
            {entry.header}
          </h3>
          <div className='hairline-gold w-10 group-hover/card:w-24 transition-all duration-500' />
          <p className='text-sm sm:text-base text-site-100 leading-relaxed max-w-prose'>
            {entry.text}
          </p>
          {hasGallery && (
            <div className='inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400 group-hover/card:text-kolping-500 transition-colors'>
              Galerie ansehen
              <span className='transition-transform duration-300 group-hover/card:translate-x-1'>→</span>
            </div>
          )}
        </div>
      </article>
    </Wrapper>
  )
}

function EventChip({ entry }: { entry: TimelineItem }) {
  return (
    <div className='group/chip relative pl-8 py-3'>
      <div className='absolute left-0 top-4 w-4 h-4 rounded-full bg-site-900 border border-site-500/60 flex items-center justify-center'>
        <span className='w-1.5 h-1.5 rounded-full bg-site-300 group-hover/chip:bg-kolping-400 transition-colors' />
      </div>
      <div className='flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4'>
        <time className='font-mono text-[10px] uppercase tracking-[0.3em] text-site-300 whitespace-nowrap'>
          {entry.month} {entry.year}
        </time>
        <div>
          <h4 className='font-display text-base sm:text-lg text-site-50 group-hover/chip:text-kolping-400 transition-colors'>
            {entry.header}
          </h4>
          <p className='text-xs sm:text-sm text-site-100/80 leading-relaxed mt-1'>
            {entry.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const rawEntries = timeline as TimelineEntry[]
  const entries: TimelineItem[] = rawEntries.map((entry, index) => {
    const { month, year } = parseDateParts(entry.date)
    return { ...entry, month, year, order: index + 1 }
  })

  // Group entries by year (newest year first, entries within sorted newest → oldest)
  const byYear = new Map<string, TimelineItem[]>()
  for (const e of entries) {
    const list = byYear.get(e.year) ?? []
    list.push(e)
    byYear.set(e.year, list)
  }
  const yearsDesc = Array.from(byYear.keys()).sort(
    (a, b) => Number(b) - Number(a),
  )
  for (const y of yearsDesc) {
    const list = byYear.get(y)!
    list.sort((a, b) => {
      const am = MONTH_ORDER[a.month.toLowerCase()] ?? 0
      const bm = MONTH_ORDER[b.month.toLowerCase()] ?? 0
      return bm - am
    })
  }

  const theaterData = teamData as TeamData
  const yearsActive = new Date().getFullYear() - 2014
  const productionCount = theaterData.plays.length
  const ensembleCount = theaterData.current.length
  const stageFormats = new Set(
    theaterData.plays
      .map((p) => p.location)
      .filter((l): l is string => !!l),
  ).size

  // Pick the most recent summer (Open-Air) and winter (Kreativbühne) productions
  const openAirPlays = theaterData.plays.filter(
    (p) => p.location === 'Open-Air-Bühne',
  )
  const kreativPlays = theaterData.plays.filter(
    (p) => p.location === 'Kreativbühne',
  )
  const latestOpenAir = openAirPlays[openAirPlays.length - 1]
  const latestKreativ = kreativPlays[kreativPlays.length - 1]

  // Awards — entries from timeline whose header mentions Preis/Engagement
  const awardEntries = entries.filter(
    (e) =>
      /Preis|preis|Engagement/.test(e.header) ||
      /Preis|preis|Engagement/.test(e.text),
  )

  const firstPremiereYear = 2017 // "Verrat im Kloster" — first Open-Air premiere

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden'>
        <div className='relative w-full h-[78vh] min-h-[520px] max-h-[860px]'>
          <Image
            src='/img/other_images/Gruppenbild.jpg'
            alt='Ensemble des Kolping-Open-Air-Theaters Ramsen'
            fill
            priority
            sizes='100vw'
            className='object-cover animate-kenburns'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/40 via-site-950/20 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/60 via-transparent to-site-950/40' />
          <div className='vignette' />
          <div className='footlight' />

          <div className='absolute inset-0 flex flex-col justify-end pb-14 sm:pb-20 md:pb-24'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-8'>
              <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1 text-[11px] font-mono font-semibold tracking-[0.25em] text-kolping-400 uppercase'>
                  Seit 2014
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  Open-Air &amp; Kreativbühne
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  Eintritt frei
                </span>
              </div>

              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.5em] text-kolping-400 mb-3 animate-fade-in-up'>
                Kolpingtheater Ramsen
              </div>

              <h1 className='animate-curtain-rise font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.88] text-shadow-lg'>
                Geschichten,
                <br />
                <span className='italic text-kolping-400'>selbst geschrieben.</span>
              </h1>

              <p className='animate-fade-in-up mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Aus einer spontanen Idee in der Kolpingjugend wurde eine Bühne
                mit eigenem Repertoire: jedes Jahr eine neue Eigenproduktion —
                groß im Sommer, nahbar im Winter.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up'>
                <a
                  href='#chronik'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Unsere Chronik
                  <span className='transition-transform group-hover:translate-y-0.5'>↓</span>
                </a>
                <Link
                  href='/team'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Ensemble ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MANIFESTO ══════ */}
      <section className='relative bg-site-950'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24'>
          <div className='grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start'>
            <div>
              <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.95]'>
                Wir schreiben
                <br />
                <span className='italic text-kolping-400'>unsere eigenen</span>
                <br />
                Geschichten.
              </h2>
              <div className='hairline-gold w-32 mt-6' />
              <div className='mt-8 space-y-5 text-site-100/90 text-base sm:text-lg leading-relaxed max-w-prose'>
                <p>
                  Historische Stoffe, Fantasie, Gesellschaftskritik oder
                  Komödie — jedes Jahr entsteht aus eigener Feder ein neues
                  Stück. Im Sommer unter freiem Himmel auf der Kolpingwiese,
                  im Winter auf der nahbaren Kreativbühne im Pfarrheim.
                </p>
                <p className='text-site-100/70 text-base leading-relaxed'>
                  Ob auf der Bühne, in der Technik, beim Bau, in Kostüm oder
                  Organisation — bei uns arbeitet eine Gemeinschaft. Theater
                  für alle, gemacht von Freunden, ohne Casting, ohne Eintritt.
                </p>
              </div>

              <div className='mt-8 flex flex-wrap gap-3'>
                <Link
                  href='/team'
                  className='inline-flex items-center gap-2 rounded-sm bg-kolping-400 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500'
                >
                  Ensemble
                </Link>
                <Link
                  href='/gallery'
                  className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-800/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 transition-all hover:border-kolping-400/60 hover:text-kolping-400'
                >
                  Galerie
                </Link>
                <Link
                  href='/contact'
                  className='inline-flex items-center gap-2 rounded-sm border border-site-700 bg-site-800/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 transition-all hover:border-kolping-400/60 hover:text-kolping-400'
                >
                  Kontakt
                </Link>
              </div>
            </div>

            {/* Stat panel — filmstrip style */}
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-br from-kolping-500/10 via-transparent to-transparent rounded-2xl blur-2xl' aria-hidden />
              <div className='relative border border-site-700 bg-site-900/80 rounded-sm p-6 sm:p-8 space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='font-mono text-[10px] uppercase tracking-[0.3em] text-site-300'>
                    Zahlen · Stand heute
                  </div>
                  <div className='flex gap-1'>
                    <span className='w-2 h-2 rounded-full bg-kolping-400 animate-pulse' />
                    <span className='w-2 h-2 rounded-full bg-kolping-400/50' />
                    <span className='w-2 h-2 rounded-full bg-kolping-400/25' />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-6 sm:gap-8 divide-x divide-site-700/60'>
                  {[
                    { value: yearsActive, label: 'Jahre Bühne', sub: `seit ${firstPremiereYear - 3}` },
                    { value: productionCount, label: 'Produktionen', sub: 'aus eigener Feder' },
                    { value: ensembleCount, label: 'Ensemble', sub: 'auf & hinter der Bühne' },
                    { value: stageFormats, label: 'Bühnenformate', sub: 'Open-Air · Kreativ' },
                  ].map((s, i) => (
                    <div key={s.label} className={`${i % 2 === 1 ? 'pl-5 sm:pl-6' : ''} space-y-1`}>
                      <div className='cast-number font-display text-5xl sm:text-6xl italic leading-none'>
                        {String(s.value).padStart(2, '0')}
                      </div>
                      <div className='font-mono text-[10px] uppercase tracking-[0.25em] text-site-100'>
                        {s.label}
                      </div>
                      <div className='text-[10px] text-site-300'>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ BÜHNENFORMATE ══════ */}
      <section className='relative bg-site-900 border-t border-site-700'>
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24'>
          <SectionHead
            eyebrow='Zwei Bühnen'
            title='Sommer &'
            accent='Winter.'
            body='Wir spielen in zwei sehr verschiedenen Welten: Open-Air auf der Kolpingwiese und nahbar auf der Kreativbühne im Pfarrheim. Jedes Stück neu, jedes Jahr.'
          />

          <div className='grid md:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16'>
            {[
              {
                key: 'Open-Air-Bühne',
                kicker: 'Sommer · Freiluft',
                title: 'Open-Air',
                accent: 'auf der Kolpingwiese',
                blurb:
                  'Unser großes Sommerstück. Unter offenem Himmel, mit aufwendiger Kulisse zwischen den historischen Mauern rund um das Kloster Ramosa.',
                latest: latestOpenAir,
                posterOverride: '/img/banners/creepshow.svg',
                posterOverrideUnoptimized: true,
              },
              {
                key: 'Kreativbühne',
                kicker: 'Winter · Saal',
                title: 'Kreativbühne',
                accent: 'im Pfarrheim',
                blurb:
                  'Seit 2023 füllt die Kreativbühne die Winterpause: jüngere Akteure, kleinere Formate, nahbar und experimentell im Saal.',
                latest: latestKreativ,
                posterOverride: undefined as string | undefined,
                posterOverrideUnoptimized: false,
              },
            ].map((f) => {
              const galleryEntry = entries.find(
                (e) => e.galleryHash && e.header.toLowerCase().includes((f.latest?.play ?? '').toLowerCase().slice(0, 6)),
              )
              const posterSrc = f.posterOverride ?? (galleryEntry?.image ? `/img/${galleryEntry.image}` : undefined)
              return (
                <article
                  key={f.key}
                  className='group relative overflow-hidden rounded-xl border-epic bg-site-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]'
                >
                  <div className='relative aspect-[16/10] overflow-hidden bg-site-950'>
                    {posterSrc ? (
                      <Image
                        src={posterSrc}
                        alt={f.title}
                        fill
                        sizes='(min-width: 768px) 50vw, 100vw'
                        className='object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105'
                        unoptimized={f.posterOverrideUnoptimized}
                      />
                    ) : null}
                    <div className='absolute inset-0 bg-gradient-to-t from-site-900 via-site-900/60 to-transparent' />
                    <div className='absolute inset-0 scanlines opacity-15' aria-hidden />
                    <div className='sweep' aria-hidden />

                    <div className='absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400 bg-site-950/70 backdrop-blur-sm border border-kolping-500/30 px-2.5 py-1 rounded-sm'>
                      {f.kicker}
                    </div>
                  </div>

                  <div className='p-6 sm:p-8 space-y-4'>
                    <h3 className='font-display text-3xl sm:text-4xl uppercase tracking-tight leading-tight'>
                      {f.title}
                      <br />
                      <span className='italic text-kolping-400 text-2xl sm:text-3xl'>
                        {f.accent}
                      </span>
                    </h3>
                    <div className='hairline-gold w-16 group-hover:w-32 transition-all duration-500' />
                    <p className='text-sm sm:text-base text-site-100 leading-relaxed'>
                      {f.blurb}
                    </p>
                    {f.latest && (
                      <div className='flex items-center gap-3 pt-3 border-t border-site-700/60'>
                        <div className='flex-1'>
                          <div className='font-mono text-[10px] uppercase tracking-[0.3em] text-site-300'>
                            Zuletzt
                          </div>
                          <div className='font-display text-lg text-site-50'>
                            „{f.latest.play}&#8220; · {f.latest.year}
                          </div>
                        </div>
                        {f.latest.gallery && f.latest.slug && (
                          <Link
                            href={`/gallery/${f.latest.slug}`}
                            className='inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400 hover:text-kolping-500 transition-colors'
                          >
                            Galerie
                            <span>→</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════ AWARDS / AUSZEICHNUNGEN ══════ */}
      {awardEntries.length > 0 && (
        <section className='relative bg-site-950 border-t border-site-700'>
          <div className='mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24'>
            <SectionHead
              eyebrow='Honor Roll'
              title='Ausgezeichnet.'
            />

            <div className='grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-14'>
              {awardEntries.map((a) => (
                <article
                  key={a.date + a.header}
                  className='group relative overflow-hidden rounded-sm border border-kolping-500/30 bg-site-900 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]'
                >
                  <div className='clapper-stripes h-3' aria-hidden />
                  <div className='grid sm:grid-cols-[1fr_auto] gap-0'>
                    <div className='p-6 sm:p-8 space-y-4'>
                      <div className='flex items-center gap-3'>
                        <span className='inline-block font-mono text-[9px] uppercase tracking-[0.35em] text-kolping-400 border border-kolping-500/40 bg-kolping-500/10 px-2 py-0.5 rounded-sm'>
                          {a.month} {a.year}
                        </span>
                        <span className='font-mono text-[9px] uppercase tracking-[0.3em] text-site-300'>
                          Preis
                        </span>
                      </div>
                      <h3 className='font-display text-2xl sm:text-3xl uppercase tracking-tight leading-tight group-hover:text-kolping-400 transition-colors'>
                        {a.header}
                      </h3>
                      <div className='hairline-gold w-12 group-hover:w-28 transition-all duration-500' />
                      <p className='text-sm text-site-100 leading-relaxed'>
                        {a.text}
                      </p>
                    </div>
                    {a.image && (
                      <div className='relative w-full sm:w-44 aspect-[4/3] sm:aspect-auto sm:self-stretch sm:min-h-[220px] overflow-hidden bg-site-950'>
                        <Image
                          src={`/img/${a.image}`}
                          alt={a.header}
                          fill
                          sizes='(min-width: 640px) 176px, 100vw'
                          className='object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                        <div className='absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-site-900/60 hidden sm:block' />
                      </div>
                    )}
                  </div>
                  <div className='clapper-stripes h-3' aria-hidden />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ CHRONIK ══════ */}
      <section
        id='chronik'
        className='relative bg-site-900 border-t border-site-700 scroll-mt-24'
      >
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24'>
          <SectionHead
            eyebrow='Filmrolle'
            title='Die'
            accent='Chronik.'
            body='Vom ersten Impuls in der Kolpingjugend bis zum letzten Vorhang. Jedes Jahr ein Stück, jede Probe ein kleiner Schritt.'
          />

          <div className='mt-14 sm:mt-20 space-y-16 sm:space-y-24'>
            {yearsDesc.map((yr) => {
              const items = byYear.get(yr)!
              const prods = items.filter((i) => !!i.image)
              const events = items.filter((i) => !i.image)
              return (
                <div
                  key={yr}
                  className='relative grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-12'
                >
                  {/* Year marker */}
                  <div className='lg:sticky lg:top-24 h-fit'>
                    <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400'>
                      Jahr
                    </div>
                    <div className='font-display text-6xl sm:text-7xl md:text-8xl font-black italic text-site-50 leading-none mt-1'>
                      {yr}
                    </div>
                    <div className='hairline-gold w-20 mt-3' />
                    <div className='mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-site-300'>
                      {prods.length > 0 && `${prods.length} Produktion${prods.length === 1 ? '' : 'en'}`}
                      {prods.length > 0 && events.length > 0 && ' · '}
                      {events.length > 0 && `${events.length} Ereignis${events.length === 1 ? '' : 'se'}`}
                    </div>
                  </div>

                  {/* Year content */}
                  <div className='relative space-y-8'>
                    {/* Vertical rail for events */}
                    {prods.map((p) => (
                      <ProductionCard key={p.date + p.header} entry={p} />
                    ))}

                    {events.length > 0 && (
                      <div className='relative pl-0 border-l border-site-700/60 ml-2'>
                        <div className='space-y-1'>
                          {events.map((e) => (
                            <EventChip key={e.date + e.header} entry={e} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════ CTA — Clapperboard ══════ */}
      <section className='relative bg-site-950 py-16 sm:py-24 px-4 sm:px-8 border-t border-site-700'>
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />

          <div className='relative p-8 sm:p-12 md:p-16 bg-site-900'>
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none' aria-hidden />

            <div className='relative grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                  Vorhang auf
                </div>
                <h3 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'>
                  Werde Teil
                  <br />
                  der <span className='italic text-kolping-400'>Geschichte.</span>
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  Schauspiel, Technik, Bau, Kostüm, Organisation — bei uns
                  findet jede Stärke ihre Bühne. Komm zur nächsten Probe, wir
                  freuen uns auf dich.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:items-end'>
                <Link
                  href='/contact'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                >
                  Jetzt mitmachen
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </Link>
                <Link
                  href='/team'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  ↺ Team ansehen
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
