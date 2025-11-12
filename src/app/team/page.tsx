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
    <div className='space-y-10 sm:space-y-12 md:space-y-16'>
      <div className='text-center space-y-4'>
        <h1 className='font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-kolping-400'>
          Unser Ensemble
        </h1>
        <p className='text-site-100 text-sm sm:text-base max-w-2xl mx-auto'>
          Die talentierten Köpfe hinter unseren unvergesslichen Aufführungen
        </p>
      </div>

      <div>
        <h2 className='font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-center'>
          Aktuelle Mitglieder
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6'>
          {current.map((p: Person) => (
            <Link
              key={p.id}
              href={`/team/${encodeURIComponent(p.id)}`}
              className='group poster-frame border-epic bg-site-800 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1'
              aria-label={`Profil von ${p.name ?? p.id} ansehen`}
              style={{ 
                viewTransitionName: `person-${p.id}`,
              }}
            >
              <div className='relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-site-700 to-site-900'>
                {/* Subtle spotlight on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-kolping-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none' />
                
                <Image
                  src={
                    p.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : avatarPath(p.id)
                  }
                  alt={p.name ?? p.id}
                  fill
                  className='object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110'
                  style={{ 
                    viewTransitionName: `person-image-${p.id}`,
                  }}
                />
                
                {/* Gradient overlay for name */}
                <div className='absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent z-10' />
              </div>
              
              <div className='relative p-4 bg-gradient-to-b from-site-800 to-site-900 border-t border-site-700 group-hover:border-kolping-500/50 transition-colors duration-300'>
                <h3 className='font-display font-bold text-lg text-site-50 group-hover:text-kolping-400 transition-colors duration-300'>
                  {p.name ?? p.id}
                </h3>
                <p className='text-xs text-site-100 mt-1'>Ensemble-Mitglied</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className='font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-center'>
          Technik & Crew
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6'>
          {tech.map((t) => (
            <Link
              key={t.id}
              href={`/team/${encodeURIComponent(t.id)}`}
              className='min-w-84 group poster-frame border-epic bg-site-800 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1'
              aria-label={`Profil von ${t.name ?? t.id} ansehen`}
              style={{ 
                viewTransitionName: `person-${t.id}`,
              }}
            >
              <div className='relative aspect-[3/4] bg-site-800 overflow-hidden bg-gradient-to-b from-site-700 to-site-900'>
                {/* Subtle spotlight on hover */}
                <div className='absolute inset-0 bg-gradient-to-br from-kolping-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none' />
                
                <Image
                  src={
                    t.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : `/img/team/avatar/${t.id}.jpg`
                  }
                  alt={t.name ?? t.id}
                  fill
                  className='object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110'
                  style={{ 
                    viewTransitionName: `person-image-${t.id}`,
                  }}
                />
                
                {/* Gradient overlay */}
                <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10' />
              </div>
              
              <div className='relative p-4 bg-gradient-to-b from-site-800 to-site-900 border-t border-site-700 group-hover:border-kolping-500/50 transition-colors duration-300'>
                <h3 className='font-display font-bold text-lg text-site-50 group-hover:text-kolping-400 transition-colors duration-300'>
                  {t.name ?? t.id}
                </h3>
                <p className='text-xs text-site-100 mt-1'>Crew-Mitglied</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className='font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6 text-center'>
          Ehemalige Mitglieder
        </h2>
        <p className='text-center text-site-100 text-sm mb-6'>
          Mit Dankbarkeit erinnern wir uns an ihre Beiträge zu unseren Produktionen
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {former.map((p: Person) => (
            <Link
              key={p.id}
              href={`/team/${encodeURIComponent(p.id)}`}
              className='group poster-frame border-epic bg-site-800 transition-all duration-500 hover:scale-[1.05]'
              aria-label={`Profil von ${p.name ?? p.id} ansehen (ehemalig)`}
              style={{ 
                viewTransitionName: `person-${p.id}`,
              }}
            >
              <div className='relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-site-700 to-site-900'>
                <Image
                  src={
                    p.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : avatarPath(p.id)
                  }
                  alt={p.name ?? p.id}
                  fill
                  className='object-cover filter sepia-[0.3] grayscale-[0.2] transition-all duration-500 group-hover:scale-110 group-hover:sepia-[0.1] group-hover:grayscale-[0]'
                  style={{ 
                    viewTransitionName: `person-image-${p.id}`,
                  }}
                />
                <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent z-10' />
              </div>
              <div className='relative p-3 bg-gradient-to-b from-site-800 to-site-900 border-t border-site-700'>
                <p className='font-display font-semibold text-sm text-site-50 group-hover:text-kolping-400 transition-colors duration-300 line-clamp-2'>
                  {p.name ?? p.id}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
