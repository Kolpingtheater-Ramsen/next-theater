import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'

type Person = {
  id: string
  name?: string
  images?: number
  placeholderAvatar?: boolean
}

function avatarPath(id: string) {
  const filename = `${id}.jpg`
  return `/img/team/avatar/${filename}`
}

// Section Divider with theatrical curtain effect
function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className='relative py-8 sm:py-12'>
      {/* Curtain drape decoration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-16' />
      </div>

      <div className='relative text-center space-y-3'>
        <div className='flex items-center justify-center gap-4'>
          {/* Left decorative flourish */}
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-8 h-px bg-gradient-to-l from-kolping-500 to-transparent' />
            <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
            <div className='w-16 h-px bg-gradient-to-l from-kolping-500/80 to-transparent' />
          </div>

          <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
            {title}
          </h2>

          {/* Right decorative flourish */}
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

// Theatrical person card
function PersonCard({
  person,
  type,
  index
}: {
  person: Person
  type: 'current' | 'former' | 'tech'
  index: number
}) {
  const isFormer = type === 'former'
  const isTech = type === 'tech'

  return (
    <Link
      href={`/team/${encodeURIComponent(person.id)}`}
      className='group relative block'
      aria-label={`Profil von ${person.name ?? person.id} ansehen${isFormer ? ' (ehemalig)' : ''}`}
      style={{
        viewTransitionName: `person-${person.id}`,
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Card container with epic glow */}
      <div className={`
        relative poster-frame border-epic bg-site-800 
        transition-all duration-500 ease-out
        hover:scale-[1.03] hover:-translate-y-2
        animate-fade-in-up
        ${isFormer ? 'opacity-85 hover:opacity-100' : ''}
      `}>
        {/* Theatrical spotlight glow on hover */}
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />

        {/* Image container */}
        <div className='relative aspect-[3/4] overflow-hidden bg-site-800'>
          {/* Animated spotlight beam */}
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/20 via-transparent to-transparent' />
          </div>

          <Image
            src={
              person.placeholderAvatar
                ? '/img/team/avatar/placeholder.svg'
                : avatarPath(person.id)
            }
            alt={person.name ?? person.id}
            fill
            className={`
              object-cover transition-all duration-700 ease-out
              group-hover:scale-110 group-hover:brightness-110
              ${isFormer ? 'filter sepia-[0.3] grayscale-[0.2] group-hover:sepia-[0.1] group-hover:grayscale-[0]' : ''}
            `}
            style={{
              viewTransitionName: `person-image-${person.id}`,
            }}
          />

          {/* Dramatic gradient overlays */}
          <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10' />

          {/* Type badge */}
          {isTech && (
            <div className='absolute top-3 right-3 z-20'>
              <div className='px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-kolping-500/40'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-kolping-400'>Crew</span>
              </div>
            </div>
          )}

          {/* Name overlay on image */}
          <div className='absolute bottom-0 inset-x-0 p-4 z-20'>
            <h3 className='font-display font-bold text-lg sm:text-xl text-white group-hover:text-kolping-400 transition-colors duration-300 drop-shadow-lg'>
              {person.name ?? person.id}
            </h3>
            <div className='flex items-center gap-2 mt-1'>
              <div className='w-6 h-0.5 bg-kolping-500 rounded-full transition-all duration-500 group-hover:w-12' />
              <span className='text-xs text-white/70 font-medium'>
                {isFormer ? 'Ehemaliges Mitglied' : isTech ? 'Technik & Crew' : 'Schauspieler/in'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className='h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </Link>
  )
}

export default function TeamPage() {
  const current: Person[] = (teamData as unknown as { current: Person[] })
    .current
  const former: Person[] = (teamData as unknown as { former: Person[] }).former
  const tech: {
    id: string
    name?: string
    placeholderAvatar?: boolean
    jobs?: { job: string; icon?: string }[]
    images?: number
  }[] = (
    teamData as unknown as {
      tech: {
        id: string
        name?: string
        placeholderAvatar?: boolean
        jobs?: { job: string; icon?: string }[]
        images?: number
      }[]
    }
  ).tech

  return (
    <div className='space-y-8 sm:space-y-12 md:space-y-16'>
      {/* Epic Hero Section */}
      <section className='relative -mt-8 pt-8 pb-12 sm:pb-16 overflow-hidden'>
        {/* Background theatrical elements */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Stage spotlights */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />
          <div className='absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />

        </div>

        <div className='relative text-center space-y-6'>
          {/* Decorative top element */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-kolping-500/20 blur-2xl rounded-full' />
              <svg className='relative w-12 h-12 text-kolping-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
              </svg>
            </div>
          </div>

          <h1 className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight'>
            <span className='text-kolping-400 drop-shadow-[0_0_30px_rgba(255,122,0,0.4)]'>Unser</span>{' '}
            <span className='text-site-50'>Team</span>
          </h1>

          <p className='text-site-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Die talentierten Köpfe hinter unseren unvergesslichen Aufführungen.
            <span className='text-kolping-400'> Schauspieler, Techniker und Kreative</span> –
            vereint durch die Leidenschaft für das Theater.
          </p>
        </div>
      </section>

      {/* Current Members */}
      <section>
        <SectionDivider
          title="Aktuelle Mitglieder"
          subtitle="Das Herzstück unserer Bühne"
        />
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          {current.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              type="current"
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Tech & Crew */}
      <section>
        <SectionDivider
          title="Technik & Crew"
          subtitle="Die Magie hinter der Bühne"
        />
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          {tech.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              type="tech"
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Former Members */}
      <section className='relative'>
        {/* Subtle vignette for nostalgic feel */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0 bg-gradient-to-t from-site-950/50 via-transparent to-site-950/50' />
        </div>

        <div className='relative'>
          <SectionDivider
            title="Ehemalige Mitglieder"
            subtitle="Mit Dankbarkeit erinnern wir uns an ihre Beiträge"
          />
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
            {former.map((person, index) => (
              <PersonCard
                key={person.id}
                person={person}
                type="former"
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
