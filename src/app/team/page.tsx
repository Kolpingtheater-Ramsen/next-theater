import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'

type Person = {
  id: string
  name?: string
  images?: number
  placeholderAvatar?: boolean
  roles?: (string | null)[]
  jobs?: { job: string; icon?: string }[]
}

type Play = {
  play: string
  slug: string
  year: number
  location: string | null
  gallery: boolean
}

type TeamDataShape = {
  plays: Play[]
  current: Person[]
  tech: Person[]
}

const data = teamData as TeamDataShape
const CURRENT_PLAY_INDEX = data.plays.length - 1 // Creepshow 2026
const currentPlay = data.plays[CURRENT_PLAY_INDEX]

function avatarPath(id: string) {
  return `/img/team/avatar/${id}.jpg`
}

function displayName(p: Person) {
  return p.name ?? p.id
}

function currentRole(p: Person): string | null {
  const r = p.roles?.[CURRENT_PLAY_INDEX]
  return r && r.trim() ? r : null
}

function sortCast(people: Person[]): Person[] {
  return [...people].sort((a, b) =>
    displayName(a).localeCompare(displayName(b), 'de')
  )
}

function Poster({
  person,
  index,
  kind,
}: {
  person: Person
  index: number
  kind: 'cast' | 'crew'
}) {
  const role = kind === 'cast' ? currentRole(person) : null
  const jobs = kind === 'crew' ? (person.jobs ?? []) : []
  const caption =
    kind === 'cast'
      ? role
      : jobs.length > 0
        ? jobs.map((j) => j.job).join(' · ')
        : null
  const captionLabel = kind === 'cast' ? 'als' : 'crew'
  const isPlaceholder = Boolean(person.placeholderAvatar)
  const onStage = kind === 'cast' ? Boolean(currentRole(person)) : true

  return (
    <Link
      href={`/team/${encodeURIComponent(person.id)}`}
      aria-label={`Profil von ${displayName(person)}`}
      className='group relative block animate-fade-in-up'
      style={{
        viewTransitionName: `person-${person.id}`,
        animationDelay: `${Math.min(index, 40) * 30}ms`,
      }}
    >
      <article className='relative'>
        {/* POSTER */}
        <div className='relative aspect-[3/4] overflow-hidden bg-site-950 border-epic rounded-xl shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:-translate-y-1'>
          <Image
            src={isPlaceholder ? '/img/team/avatar/placeholder.svg' : avatarPath(person.id)}
            alt={displayName(person)}
            fill
            sizes='(min-width:1024px) 24vw, (min-width:640px) 33vw, 50vw'
            className={[
              'transition-all duration-[900ms] ease-out',
              isPlaceholder
                ? 'object-contain p-10 opacity-80 group-hover:scale-105'
                : 'object-cover object-top will-change-transform group-hover:scale-[1.06]',
              !onStage && !isPlaceholder
                ? 'saturate-50 brightness-75 group-hover:saturate-100 group-hover:brightness-100'
                : '',
            ].join(' ')}
            style={{ viewTransitionName: `person-image-${person.id}` }}
          />

          <div className='sweep' aria-hidden />
          <div className='absolute inset-0 scanlines opacity-20' aria-hidden />
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' aria-hidden />

          {/* corner tick marks like a film frame */}
          <span className='absolute top-2 left-2 w-3 h-3 border-l border-t border-kolping-400/60' aria-hidden />
          <span className='absolute top-2 right-2 w-3 h-3 border-r border-t border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-kolping-400/60' aria-hidden />
          <span className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-kolping-400/60' aria-hidden />

          {caption && (
            <div className='absolute inset-x-0 bottom-0 p-3 sm:p-4 z-10'>
              <div className='text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-kolping-300/90 mb-1'>
                {captionLabel}
              </div>
              <div className='font-display italic text-white/95 text-base sm:text-lg leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'>
                {caption}
              </div>
            </div>
          )}
        </div>

        {/* Caption block below */}
        <div className='mt-3 sm:mt-4 space-y-1'>
          <h3 className='font-display text-xl sm:text-2xl uppercase tracking-[0.06em] text-site-50 group-hover:text-kolping-400 transition-colors'>
            {displayName(person)}
          </h3>
          <div className='hairline-gold w-10 group-hover:w-24 transition-all duration-500' />
        </div>
      </article>
    </Link>
  )
}

export default function TeamPage() {
  const castSorted = sortCast(data.current)
  const tech = data.tech
  const castOnStage = castSorted.filter((p) => Boolean(currentRole(p))).length

  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden'>
        <div className='relative w-full h-[78vh] min-h-[520px] max-h-[860px]'>
          <Image
            src='/img/team/team_header.jpg'
            alt='Team des Kolpingtheaters Ramsen'
            fill
            priority
            sizes='100vw'
            className='object-cover animate-kenburns'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/40 via-site-950/25 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/75 via-site-950/35 to-transparent' />
          <div className='vignette' />
          <div className='footlight' />

          {/* corner film-frame ticks */}
          <span className='absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-kolping-400/70' aria-hidden />

          <div className='absolute inset-0 flex flex-col justify-end pb-14 sm:pb-20 md:pb-24'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-8'>
              <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/50 bg-site-950/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-kolping-400 uppercase'>
                  <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
                  Saison {currentPlay.year}
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  Rollen &amp; Crew
                </span>
              </div>

              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.5em] text-kolping-400 mb-3 animate-fade-in-up'>
                Kolpingtheater Ramsen
              </div>

              <h1 className='animate-curtain-rise font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.88] text-shadow-lg'>
                Vor der
                <br />
                <span className='italic text-kolping-400'>Kulisse.</span>
              </h1>

              <p className='animate-fade-in-up mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Hinter jeder Produktion stehen viele Gesichter. Schauspiel,
                Technik und Organisation — zusammen ein eingespieltes Ensemble.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up'>
                <a
                  href='#team-current'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  Die Besetzung
                  <span className='transition-transform group-hover:translate-y-0.5'>↓</span>
                </a>
                <Link
                  href='/about'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Unsere Geschichte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STAT STRIP ══════ */}
      <section className='bg-site-950 border-b border-site-700'>
        <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10 grid grid-cols-2 gap-2 sm:gap-8 divide-x divide-site-700/80 text-center'>
          {[
            { value: castOnStage, label: 'Rollen' },
            { value: tech.length, label: 'Crew' },
          ].map(({ value, label }) => (
            <div key={label} className='px-2'>
              <div className='cast-number font-display text-4xl sm:text-6xl italic leading-none'>
                {String(value).padStart(2, '0')}
              </div>
              <div className='mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-site-300'>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CAST WALL ══════ */}
      <section id='team-current' className='relative bg-site-950 scroll-mt-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 pt-16 sm:pt-24 pb-8 sm:pb-12'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-16'>
            <div>
              <h2 className='font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                Die <span className='italic text-kolping-400'>Besetzung</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
            </div>
            <p className='max-w-sm text-site-100/80 text-sm sm:text-base leading-relaxed'>
              Alphabetisch sortiert.
            </p>
          </div>

          {/* Poster grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-14'>
            {castSorted.map((person, idx) => (
              <Poster key={person.id} person={person} index={idx} kind='cast' />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CREW / BEHIND THE SCENES ══════ */}
      <section id='team-tech' className='relative bg-site-900 border-t border-site-700 scroll-mt-24'>
        {/* blueprint-style grid background */}
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
        <div className='relative mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14'>
            <div>
              <h2 className='font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                Hinter den
                <br />
                <span className='italic text-kolping-400'>Kulissen</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
            </div>
            <p className='max-w-sm text-site-100/80 text-sm sm:text-base leading-relaxed'>
              Licht, Ton, Bühne, Kostüm, Organisation — ohne dieses Team bliebe
              der Vorhang unten.
            </p>
          </div>

          {/* Poster grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-14'>
            {tech.map((person, idx) => (
              <Poster key={person.id} person={person} index={idx} kind='crew' />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA — Clapperboard ══════ */}
      <section className='relative bg-site-950 py-16 sm:py-24 px-4 sm:px-8'>
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          {/* clapper top stripe */}
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />

          <div className='relative p-8 sm:p-12 md:p-16 bg-site-900'>
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none' aria-hidden />

            <div className='relative grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                  Take · 13
                </div>
                <h3 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'>
                  Deine Rolle <br />
                  <span className='italic text-kolping-400'>wartet.</span>
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  Ob Bühne, Technik oder Organisation — unser Ensemble lebt von
                  neuen Gesichtern. Keine Audition, kein Casting: komm einfach
                  zur nächsten Probe vorbei und werde Teil der Geschichte.
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
                  href='/gallery'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  ↺ Galerie ansehen
                </Link>
              </div>
            </div>
          </div>

          {/* clapper bottom stripe */}
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />
        </div>
      </section>
    </div>
  )
}
