import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'

type Person = {
  id: string
  name?: string
  images?: number
  placeholderAvatar?: boolean
}

type TeamDataShape = {
  current: Person[]
  former: Person[]
  tech: Person[]
}

function avatarPath(id: string) {
  return `/img/team/avatar/${id}.jpg`
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

function TeamCard({
  person,
  type,
  index,
}: {
  person: Person
  type: 'current' | 'tech' | 'former'
  index: number
}) {
  const isFormer = type === 'former'
  const isPlaceholder = !!person.placeholderAvatar
  const label = type === 'tech' ? 'Crew' : type === 'former' ? 'Ehemalig' : 'Ensemble'
  const roleText =
    type === 'tech'
      ? 'Technik & Organisation'
      : type === 'former'
        ? 'Ehemaliges Mitglied'
        : 'Schauspiel & Bühne'

  return (
    <Link
      href={`/team/${encodeURIComponent(person.id)}`}
      className='group relative block'
      aria-label={`Profil von ${person.name ?? person.id} ansehen`}
      style={{ viewTransitionName: `person-${person.id}` }}
    >
      <div
        className={`relative poster-frame border-epic bg-site-800 transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-2 animate-fade-in-up ${isFormer ? 'opacity-85 hover:opacity-100' : ''}`}
        style={{ animationDelay: `${index * 35}ms` }}
      >
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />

        <div className='absolute top-3 left-3 z-30 rounded-full border border-site-700 bg-site-900/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-kolping-400'>
          {label}
        </div>

        <div className='relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-site-800 to-site-900'>
          <Image
            src={person.placeholderAvatar ? '/img/team/avatar/placeholder.svg' : avatarPath(person.id)}
            alt={person.name ?? person.id}
            fill
            className={`${isPlaceholder ? 'object-contain p-8 opacity-90 group-hover:scale-105' : 'object-cover group-hover:scale-110 group-hover:brightness-110'} transition-all duration-700 ease-out ${isFormer ? 'filter sepia-[0.25] grayscale-[0.25] group-hover:sepia-[0.1] group-hover:grayscale-[0]' : ''}`}
            style={{ viewTransitionName: `person-image-${person.id}` }}
          />
          <div className='absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/65 to-transparent z-10' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/20 z-10' />

          <div className='absolute inset-x-0 bottom-0 p-4 z-20'>
            <h3 className='font-display font-bold text-lg sm:text-xl text-white group-hover:text-kolping-400 transition-colors duration-300 drop-shadow-lg'>
              {person.name ?? person.id}
            </h3>
            <div className='mt-1 flex items-center gap-2'>
              <div className='w-6 h-0.5 bg-kolping-500 rounded-full transition-all duration-500 group-hover:w-12' />
              <span className='text-xs text-white/75 font-medium'>{roleText}</span>
            </div>
          </div>
        </div>

        <div className='h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </Link>
  )
}

function TeamSection({
  id,
  title,
  subtitle,
  people,
  type,
}: {
  id: string
  title: string
  subtitle: string
  people: Person[]
  type: 'current' | 'tech' | 'former'
}) {
  return (
    <section id={id} className='scroll-mt-32'>
      <SectionDivider title={title} subtitle={subtitle} />
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
        {people.map((person, index) => (
          <TeamCard
            key={person.id}
            person={person}
            type={type}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

export default function TeamPage() {
  const data = teamData as TeamDataShape
  const current = data.current
  const tech = data.tech
  const former = data.former

  return (
    <div className='space-y-0'>
      <section className='relative -mx-4 -mt-8 overflow-hidden'>
        <div className='relative w-full h-[72vh] min-h-[460px] max-h-[820px]'>
          <Image
            src='/img/team/team_header.jpg'
            alt='Team des Kolpingtheaters Ramsen'
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
                  Team & Crew
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                  Bühne, Technik, Organisation
                </span>
              </div>

              <h1 className='animate-fade-in-up font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] text-shadow-lg'>
                Unser Team
                <br />
                <span className='text-kolping-400'>Kolpingtheater Ramsen</span>
              </h1>

              <p className='animate-fade-in-up mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Hinter jeder Produktion stehen viele Gesichter. Schauspiel,
                Technik und Organisation arbeiten bei uns als eingespieltes
                Ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pt-6 sm:pt-8 pb-4'>
        <div className='sticky top-[72px] z-20 backdrop-blur supports-[backdrop-filter]:bg-site-900/55 bg-site-900/75 rounded-xl border border-site-700/60 p-3'>
          <div className='flex items-center gap-2 overflow-x-auto scrollbar-thin'>
            {[
              { id: 'team-current', label: 'Aktuelle Mitglieder' },
              { id: 'team-tech', label: 'Technik & Crew' },
              { id: 'team-former', label: 'Ehemalige Mitglieder' },
            ].map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className='shrink-0 inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/80 px-3 py-1.5 text-xs text-site-100 hover:border-kolping-400/60 hover:text-kolping-400 transition-colors'
              >
                <span className='font-semibold'>{section.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className='mx-auto max-w-6xl px-4 pb-6 sm:pb-10 space-y-10 sm:space-y-14'>
        <TeamSection
          id='team-current'
          title='Aktuelle Mitglieder'
          subtitle='Das Ensemble, das die aktuellen Produktionen trägt'
          people={current}
          type='current'
        />
        <TeamSection
          id='team-tech'
          title='Technik & Crew'
          subtitle='Die Menschen hinter Licht, Ton, Bühnenbild und Ablauf'
          people={tech}
          type='tech'
        />
        <TeamSection
          id='team-former'
          title='Ehemalige Mitglieder'
          subtitle='Mit Dankbarkeit für viele Jahre gemeinsamer Theaterarbeit'
          people={former}
          type='former'
        />
      </div>

      <section className='mx-auto max-w-6xl px-4 py-12 sm:py-16'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700'>
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/10 via-site-900 to-site-900' />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-400/[0.05] to-transparent' />

          <div className='relative p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='flex-1 text-center md:text-left'>
              <span className='block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-kolping-400 font-semibold mb-3'>
                Mitmachen
              </span>
              <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight'>
                Du willst dabei sein?
              </h2>
              <p className='text-site-100 mt-3 sm:mt-4 text-sm sm:text-base max-w-md leading-relaxed'>
                Wenn du Lust auf Bühne, Technik oder Organisation hast, freuen
                wir uns auf deine Nachricht.
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
                href='/gallery'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/50 px-6 py-3 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Produktionen ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
