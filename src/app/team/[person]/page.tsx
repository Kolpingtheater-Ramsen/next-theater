export const runtime = 'edge'
import { notFound } from 'next/navigation'
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
}

const plays: string[] = (data as unknown as { plays: string[] }).plays

function findPerson(id: string): Entry | undefined {
  const lower = id.toLowerCase()
  const current = (
    (data as unknown as { current: Entry[] }).current || []
  ).find((p) => p.id.toLowerCase() === lower)
  const former = ((data as unknown as { former: Entry[] }).former || []).find(
    (p) => p.id.toLowerCase() === lower
  )
  const tech = ((data as unknown as { tech: Entry[] }).tech || []).find(
    (p) => p.id.toLowerCase() === lower
  ) as Entry | undefined

  if (!current && !former && !tech) return undefined

  const base = current || former || tech!
  const roles = current?.roles ?? former?.roles
  const jobs = (tech as { jobs?: { job: string; icon?: string }[] } | undefined)
    ?.jobs
  const images = Math.max(
    current?.images ?? 0,
    former?.images ?? 0,
    tech?.images ?? 0
  )
  const placeholderAvatar = Boolean(
    current?.placeholderAvatar ||
      former?.placeholderAvatar ||
      tech?.placeholderAvatar
  )

  return {
    id: base.id,
    name: base.name,
    roles,
    images: images || base.images,
    placeholderAvatar,
    jobs,
  }
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ person: string }>
}) {
  const { person: slug } = await params
  const person = findPerson(decodeURIComponent(slug))
  if (!person) return notFound()

  const hasPlaceholder = Boolean(person.placeholderAvatar)

  const rolesData = person.roles
    ? person.roles
        .map((role, index) => ({ role, play: plays[index] }))
        .filter((x) => x.role && x.role.trim().length > 0)
        .map((x) => ({ role: x.role!, play: x.play }))
    : []

  const totalRoles = rolesData.length
  const imageCount = person.images ?? 1

  return (
    <div className='space-y-0'>
      {/* Hero Section with Photo */}
      <div className='relative mb-8 sm:mb-12 flex justify-center px-4 sm:px-6'>
        <div className='relative w-full max-w-md lg:max-w-lg poster-frame border-epic overflow-hidden'>
          {/* Image Container with fixed aspect ratio */}
          <div className='relative aspect-[3/4] w-full'>
            <Slideshow
              name={person.id}
              count={imageCount}
              aspect='hero'
              placeholder={hasPlaceholder}
            />
            
            {/* Gradient Overlays for Text Readability */}
            <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10' />
            <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10' />
            
            {/* Spotlight Effect */}
            <div className='spotlight' />
          </div>
          
          {/* Content Section - Below Image */}
          <div className='relative z-20 p-6 sm:p-8 bg-gradient-to-b from-site-900 to-site-950 border-t border-site-700'>
            <div className='space-y-4 sm:space-y-5'>
              {/* Theater curtain accent */}
              <div className='w-20 sm:w-24 h-1 bg-gradient-to-r from-kolping-500 via-kolping-400 to-transparent rounded-full' />
              
              <h1 
                className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase break-words'
                style={{ viewTransitionName: `person-title-${person.id}` }}
              >
                {person.name ?? person.id}
              </h1>
              
              <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm'>
                <div className='flex items-center gap-2 text-kolping-400 font-semibold'>
                  <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  <span className='text-white'>Ensemble-Mitglied</span>
                </div>
                
                {totalRoles > 0 && (
                  <div className='flex items-center gap-2 text-white/90'>
                    <svg className='w-4 h-4 sm:w-5 sm:h-5 text-kolping-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                    </svg>
                    <span className='font-semibold'>{totalRoles} {totalRoles === 1 ? 'Rolle' : 'Rollen'}</span>
                  </div>
                )}
                
                {person.jobs && person.jobs.length > 0 && (
                  <div className='flex items-center gap-2 text-white/90'>
                    <svg className='w-4 h-4 sm:w-5 sm:h-5 text-kolping-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                    </svg>
                    <span className='font-semibold'>Crew</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-6xl mx-auto space-y-12 sm:space-y-16'>
        {/* Roles Section */}
        {rolesData.length > 0 && (
          <section className='space-y-6'>
            <div className='text-center space-y-3'>
              <div className='flex items-center justify-center gap-3'>
                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-kolping-500 to-kolping-500 max-w-24' />
                <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-bold text-kolping-400'>
                  Theater-Reise
                </h2>
                <div className='h-px flex-1 bg-gradient-to-l from-transparent via-kolping-500 to-kolping-500 max-w-24' />
              </div>
              <p className='text-site-100 text-sm sm:text-base'>
                Eine Chronik der dargestellten Rollen
              </p>
            </div>
            
            <div className='min-h-[400px] max-h-[800px] overflow-y-auto scrollbar-thin'>
              <RolesList
                roles={rolesData}
              />
            </div>
          </section>
        )}
        
        {/* Tech & Crew Section */}
        {person.jobs && person.jobs.length > 0 && (
          <section className='space-y-6'>
            <div className='text-center space-y-3'>
              <div className='flex items-center justify-center gap-3'>
                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-kolping-500 to-kolping-500 max-w-24' />
                <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-bold text-kolping-400'>
                  Hinter den Kulissen
                </h2>
                <div className='h-px flex-1 bg-gradient-to-l from-transparent via-kolping-500 to-kolping-500 max-w-24' />
              </div>
              <p className='text-site-100 text-sm sm:text-base'>
                Aufgaben in Technik & Crew
              </p>
            </div>
            
            <div className='flex flex-wrap justify-center gap-3'>
              {person.jobs.map((j, i) => (
                <div
                  key={i}
                  className='group relative overflow-hidden poster-frame border-epic bg-gradient-to-br from-site-800 to-site-900 px-6 py-4 transition-all duration-500 hover:scale-105 hover:-translate-y-1'
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-kolping-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  <div className='relative flex flex-col items-center gap-2'>
                    <span className='text-3xl' aria-hidden='true'>
                      {j.icon === 'settings'
                        ? '⚙️'
                        : j.icon === 'camera'
                        ? '📷'
                        : j.icon === 'lightbulb'
                        ? '💡'
                        : j.icon === 'headphones'
                        ? '🎧'
                        : j.icon === 'explore'
                        ? '🧭'
                        : '🎭'}
                    </span>
                    <span className='font-display font-bold text-base text-kolping-400 group-hover:text-kolping-500 transition-colors'>
                      {j.job}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
