export const runtime = 'edge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import data from '@/data/team.json'
import Slideshow from './slideshow'
import RolesList from './roles-list'

type Entry = {
  id: string
  name?: string
  roles?: (string | null)[]
  images?: number
  placeholderAvatar?: boolean
  jobs?: { job: string; icon?: string }[]
  since?: number
}

type Play = {
  play: string
  slug: string | null
  year: number
  location: string | null
  gallery: boolean
}

const plays: Play[] = (data as { plays: Play[] }).plays
const CURRENT_PLAY_INDEX = plays.length - 1

function findPerson(id: string): Entry | undefined {
  const lower = id.toLowerCase()
  const current = ((data as { current: Entry[] }).current || []).find(
    (person) => person.id.toLowerCase() === lower,
  )
  const former = ((data as { former?: Entry[] }).former || []).find(
    (person) => person.id.toLowerCase() === lower,
  )
  const tech = ((data as { tech: Entry[] }).tech || []).find(
    (person) => person.id.toLowerCase() === lower,
  )

  if (!current && !former && !tech) return undefined

  const base = current || former || tech!
  const images = Math.max(current?.images ?? 0, former?.images ?? 0, tech?.images ?? 0)

  return {
    id: base.id,
    name: base.name,
    roles: current?.roles ?? former?.roles,
    images: images || base.images,
    placeholderAvatar: Boolean(
      current?.placeholderAvatar || former?.placeholderAvatar || tech?.placeholderAvatar,
    ),
    jobs: tech?.jobs,
    since: tech?.since,
  }
}

function getPersonType(id: string): 'current' | 'former' | 'tech' | null {
  const lower = id.toLowerCase()
  const inCurrent = ((data as { current: Entry[] }).current || []).some(
    (person) => person.id.toLowerCase() === lower,
  )
  const inTech = ((data as { tech: Entry[] }).tech || []).some(
    (person) => person.id.toLowerCase() === lower,
  )
  if (inCurrent) return 'current'
  if (inTech) return 'tech'
  return null
}

function jobDescription(job: string): string {
  const map: Record<string, string> = {
    Regie: 'Künstlerische Leitung und Inszenierung der Produktion',
    Tontechnik: 'Beschallung und Tonmischung bei Aufführungen',
    Lichttechnik: 'Lichtdesign und Beleuchtung der Bühne',
    Bühnenbau: 'Konstruktion und Aufbau der Bühnenkulisse',
    Bühnentechnik: 'Aufbau, Technik und Ablauf auf der Bühne',
    Videotechnik: 'Kameras, Projektion und Videotechnik',
    Kostüme: 'Entwurf und Anfertigung der Kostüme',
    Maske: 'Make-up und Charaktergestaltung der Darsteller',
    Requisite: 'Besorgung und Pflege der Requisiten',
    Organisation: 'Planung und Koordination hinter den Kulissen',
    Fotografie: 'Dokumentation der Aufführungen in Bildern',
    Video: 'Aufnahme und Schnitt der Aufführungen',
    Website: 'Gestaltung und Pflege des digitalen Auftritts',
  }
  return map[job] ?? `Beitrag als ${job} im Team`
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ person: string }>
}) {
  const { person: slug } = await params
  const person = findPerson(decodeURIComponent(slug))
  if (!person) return notFound()

  const personType = getPersonType(person.id)
  const hasPlaceholder = Boolean(person.placeholderAvatar)
  const imageCount = person.images ?? 1

  const rolesData = person.roles
    ? person.roles
        .map((role, index) => ({ role: role!, playData: plays[index] }))
        .filter((item) => item.role && item.role.trim().length > 0 && item.playData)
    : []

  // Earliest year an actor appeared on stage — first non-null role's play year
  const castSince = person.roles
    ? (() => {
        for (let i = 0; i < person.roles.length; i++) {
          const r = person.roles[i]
          if (r && r.trim()) return plays[i]?.year ?? null
        }
        return null
      })()
    : null

  const sinceYear = personType === 'tech' ? person.since : castSince

  const hasRoles = rolesData.length > 0
  const hasJobs = Boolean(person.jobs && person.jobs.length > 0)

  const typeLabel =
    personType === 'current'
      ? 'Aktives Ensemble'
      : personType === 'tech'
        ? 'Crew · Technik'
        : 'Ehemaliges Mitglied'

  const currentRole = person.roles?.[CURRENT_PLAY_INDEX]
  const currentPlay = plays[CURRENT_PLAY_INDEX]
  const displayName = person.name ?? person.id
  const heroImage = hasPlaceholder ? null : `/img/team/avatar/${person.id}.jpg`

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden'>
        {/* Atmosphere */}
        <div className='absolute inset-0 bg-site-950' aria-hidden>
          {heroImage && (
            <Image
              src={heroImage}
              alt=''
              fill
              priority
              sizes='100vw'
              className='object-cover opacity-25 blur-md scale-110'
            />
          )}
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-site-950/80 to-site-950' aria-hidden />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,transparent,rgba(0,0,0,0.65))]' aria-hidden />
        <div className='spotlight' aria-hidden />
        <div className='absolute inset-0 grain' aria-hidden />
        <div className='vignette' aria-hidden />

        <div className='relative mx-auto max-w-6xl px-4 sm:px-8 pt-6 sm:pt-10 pb-14 sm:pb-20'>
          {/* Back link */}
          <Link
            href='/team'
            className='group inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-site-100 hover:text-kolping-400 transition-colors'
          >
            <span className='transition-transform group-hover:-translate-x-1'>←</span>
            Zurück zum Ensemble
          </Link>

          <div
            className={`mt-10 sm:mt-14 grid gap-8 sm:gap-14 items-end ${
              hasPlaceholder ? '' : 'lg:grid-cols-[1.15fr_0.85fr]'
            }`}
          >
            {/* Left: Identity block */}
            <div>
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-5'>
                <span aria-hidden>— </span>
                {typeLabel}
                <span aria-hidden> —</span>
              </div>

              <h1 className='font-display font-black leading-[0.85] tracking-tight'>
                <span className='block text-5xl sm:text-7xl md:text-8xl italic text-kolping-400 drop-shadow-[0_6px_28px_rgba(255,122,0,0.35)]'>
                  {displayName}
                </span>
              </h1>

              <div className='hairline-gold w-32 mt-6 sm:mt-8' />

              {/* Current role call-out */}
              {currentRole && currentPlay && (
                <div className='mt-8 sm:mt-10'>
                  <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-kolping-300/90 mb-2'>
                    Diese Saison · {currentPlay.year}
                  </div>
                  <div className='font-display italic text-2xl sm:text-3xl md:text-4xl text-white leading-tight'>
                    {currentRole}
                  </div>
                  <div className='mt-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-site-300'>
                    {currentPlay.play}
                    {currentPlay.location ? ` · ${currentPlay.location}` : ''}
                  </div>
                </div>
              )}

              {/* Summary chips */}
              <div className='mt-8 flex flex-wrap gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em]'>
                {hasRoles && (
                  <span className='inline-flex items-center gap-2 border border-site-700 bg-site-900/60 px-3 py-1.5 rounded-md text-site-100'>
                    <span className='text-kolping-400'>{rolesData.length}</span>
                    Produktionen
                  </span>
                )}
                {sinceYear && (
                  <span className='inline-flex items-center gap-2 border border-site-700 bg-site-900/60 px-3 py-1.5 rounded-md text-site-100'>
                    Dabei seit
                    <span className='text-kolping-400'>{sinceYear}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right: Portrait poster */}
            {!hasPlaceholder && (
              <div style={{ viewTransitionName: `person-${person.id}` }}>
                <div className='relative aspect-[3/4] overflow-hidden border-epic rounded-xl bg-site-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]'>
                  <Slideshow name={person.id} count={imageCount} aspect='hero' />

                  {/* Scanlines + subtle grain on top */}
                  <div className='absolute inset-0 scanlines opacity-20 z-[5] pointer-events-none' aria-hidden />

                  {/* Corner tick marks */}
                  <span className='absolute top-2 left-2 w-3 h-3 border-l border-t border-kolping-400/60 z-[6]' aria-hidden />
                  <span className='absolute top-2 right-2 w-3 h-3 border-r border-t border-kolping-400/60 z-[6]' aria-hidden />
                  <span className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-kolping-400/60 z-[6]' aria-hidden />
                  <span className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-kolping-400/60 z-[6]' aria-hidden />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════ CHRONIK ══════ */}
      {hasRoles && (
        <section className='relative bg-site-950 border-t border-site-700'>
          <div className='relative mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20'>
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                  Chronik
                </div>
                <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                  Die <span className='italic text-kolping-400'>Rollen</span>
                </h2>
                <div className='hairline-gold w-24 mt-5' />
              </div>
              <p className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-site-300'>
                Jüngste Produktion zuerst
              </p>
            </div>

            <RolesList roles={rolesData} />
          </div>
        </section>
      )}

      {/* ══════ AUFGABEN ══════ */}
      {hasJobs && (
        <section className='relative bg-site-900 border-t border-site-700'>
          {/* blueprint-style grid */}
          <div
            className='absolute inset-0 opacity-[0.04] pointer-events-none'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
            aria-hidden
          />
          <div className='relative mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20'>
            <div>
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-3'>
                Aufgaben
              </div>
              <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                Hinter den <span className='italic text-kolping-400'>Kulissen</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
            </div>

            <div className='mt-10 sm:mt-14 border-t border-site-700/80'>
              {person.jobs!.map((job, i) => (
                <div
                  key={`${job.job}-${i}`}
                  className='grid grid-cols-[auto_1fr] items-center gap-6 sm:gap-10 py-6 sm:py-7 px-2 sm:px-4 border-b border-site-700/80 hover:bg-site-800/30 transition-colors'
                >
                  <div className='font-display italic text-3xl sm:text-5xl text-kolping-400/80 tabular-nums leading-none w-14 sm:w-20 shrink-0'>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className='min-w-0'>
                    <div className='font-display text-xl sm:text-3xl uppercase tracking-wide text-site-50 leading-tight'>
                      {job.job}
                    </div>
                    <div className='mt-1.5 text-sm sm:text-base text-site-300 leading-relaxed max-w-xl'>
                      {jobDescription(job.job)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ EMPTY STATE ══════ */}
      {!hasRoles && !hasJobs && (
        <section className='relative bg-site-950 border-t border-site-700'>
          <div className='relative mx-auto max-w-4xl px-4 sm:px-8 py-20 sm:py-28 text-center'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-5'>
              Pause zwischen den Akten
            </div>
            <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
              Neue <span className='italic text-kolping-400'>Stationen</span>
              <br />
              folgen.
            </h2>
            <div className='hairline-gold w-24 mt-6 mx-auto' />
            <p className='mt-6 text-site-100/80 max-w-md mx-auto text-sm sm:text-base leading-relaxed'>
              Für dieses Profil sind aktuell noch keine Rollen oder Aufgaben
              veröffentlicht.
            </p>
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
                  Mehr vom Ensemble
                </div>
                <h3 className='font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]'>
                  Zurück zur <span className='italic text-kolping-400'>Besetzung</span>
                </h3>
              </div>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                <Link
                  href='/team'
                  className='inline-flex items-center justify-center gap-2 border border-site-700 bg-site-800/60 px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:border-kolping-400/50 hover:text-kolping-400 transition-all'
                >
                  Teamübersicht
                </Link>
                <Link
                  href='/gallery'
                  className='group inline-flex items-center justify-center gap-2 bg-kolping-400 hover:bg-kolping-500 px-6 py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Galerie
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
