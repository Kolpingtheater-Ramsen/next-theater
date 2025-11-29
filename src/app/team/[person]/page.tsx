export const runtime = 'edge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

function getPersonType(id: string): 'current' | 'former' | 'tech' | null {
  const lower = id.toLowerCase()
  const inCurrent = ((data as unknown as { current: Entry[] }).current || [])
    .some((p) => p.id.toLowerCase() === lower)
  const inFormer = ((data as unknown as { former: Entry[] }).former || [])
    .some((p) => p.id.toLowerCase() === lower)
  const inTech = ((data as unknown as { tech: Entry[] }).tech || [])
    .some((p) => p.id.toLowerCase() === lower)
  
  if (inCurrent) return 'current'
  if (inTech) return 'tech'
  if (inFormer) return 'former'
  return null
}

// Job icon component
function JobIcon({ icon }: { icon?: string }) {
  const iconMap: Record<string, string> = {
    settings: '⚙️',
    camera: '📷',
    lightbulb: '💡',
    headphones: '🎧',
    explore: '🧭',
  }
  return <span className='text-4xl'>{iconMap[icon || ''] || '🎭'}</span>
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
  const personType = getPersonType(person.id)

  const rolesData = person.roles
    ? person.roles
        .map((role, index) => ({ role, play: plays[index] }))
        .filter((x) => x.role && x.role.trim().length > 0)
        .map((x) => ({ role: x.role!, play: x.play }))
    : []

  const totalRoles = rolesData.length
  const imageCount = person.images ?? 1

  return (
    <div className='min-h-screen'>
      {/* Cinematic Hero Section */}
      <section className='relative -mt-8 mb-12 sm:mb-16'>

        
        {/* Back navigation */}
        <div className='relative z-20 pt-6 pb-4 px-4 sm:px-6'>
          <Link 
            href='/team'
            className='inline-flex items-center gap-2 text-site-100 hover:text-kolping-400 transition-colors duration-300 group'
          >
            <svg className='w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='text-sm font-medium'>Zurück zum Ensemble</span>
          </Link>
        </div>
        
        {/* Hero content container */}
        <div className='relative px-4 sm:px-6 flex justify-center'>
          <div 
            className='relative w-full max-w-lg lg:max-w-xl'
            style={{ viewTransitionName: `person-${person.id}` }}
          >
            {/* Main poster frame */}
            <div className='relative poster-frame border-epic overflow-hidden'>
              {/* Epic outer glow */}
              <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl blur-2xl pointer-events-none' />
              
              {/* Image container with fixed aspect ratio */}
              <div className='relative aspect-[3/4] w-full'>
                <Slideshow
                  name={person.id}
                  count={imageCount}
                  aspect='hero'
                  placeholder={hasPlaceholder}
                />
                
                {/* Cinematic gradient overlays */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10' />
                <div className='absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10' />
                
                {/* Spotlight effect */}
                <div className='spotlight' />
                
                {/* Film grain overlay */}
                <div className='grain' />
                
                {/* Vignette */}
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] z-10 pointer-events-none' />
              </div>
              
              {/* Info section below image */}
              <div className='relative z-20 p-6 sm:p-8 bg-site-800 border-t border-site-700'>
                {/* Decorative top accent */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                  <div className='w-24 h-1 bg-gradient-to-r from-transparent via-kolping-500 to-transparent rounded-full' />
                </div>
                
                <div className='space-y-5'>
                  {/* Name */}
                  <div>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-12 h-1 bg-gradient-to-r from-kolping-500 via-kolping-400 to-transparent rounded-full' />
                    </div>
                    <h1 
                      className='font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-site-50 uppercase break-words'
                      style={{ viewTransitionName: `person-title-${person.id}` }}
                    >
                      {person.name ?? person.id}
                    </h1>
                  </div>
                  
                  {/* Status badges */}
                  <div className='flex flex-wrap items-center gap-3'>
                    {/* Member type badge */}
                    <div className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
                      ${personType === 'current' 
                        ? 'bg-kolping-500/10 border-kolping-500/30 text-kolping-400' 
                        : personType === 'tech'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : 'bg-site-700/50 border-site-600 text-site-100'
                      }
                    `}>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                      </svg>
                      <span className='text-sm font-semibold'>
                        {personType === 'current' ? 'Schauspieler/in' 
                          : personType === 'tech' ? 'Technik & Crew' 
                          : 'Ehemaliges Mitglied'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 pb-16'>
        
        {/* Roles Section */}
        {rolesData.length > 0 && (
          <section className='space-y-8'>
            {/* Section header */}
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center gap-4'>
                <div className='hidden sm:block w-16 h-px bg-gradient-to-r from-transparent to-kolping-500/80' />
                <div className='relative'>
                  <div className='absolute -inset-3 bg-kolping-500/10 blur-xl rounded-full' />
                  <h2 className='relative font-display text-3xl sm:text-4xl md:text-5xl font-black text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
                    Theater-Reise
                  </h2>
                </div>
                <div className='hidden sm:block w-16 h-px bg-gradient-to-l from-transparent to-kolping-500/80' />
              </div>
              <p className='text-site-100 text-base sm:text-lg max-w-lg mx-auto'>
                Eine Chronik der dargestellten Rollen durch die Jahre
              </p>
            </div>
            
            {/* Roles timeline */}
            <div className='relative'>
              {/* Decorative corner elements */}
              <div className='absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-kolping-500/30 rounded-tl-lg' />
              <div className='absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-kolping-500/30 rounded-tr-lg' />
              <div className='absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-kolping-500/30 rounded-bl-lg' />
              <div className='absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-kolping-500/30 rounded-br-lg' />
              
              <div className='py-6 px-2 sm:px-4'>
                <RolesList roles={rolesData} />
              </div>
            </div>
          </section>
        )}
        
        {/* Tech & Crew Section */}
        {person.jobs && person.jobs.length > 0 && (
          <section className='space-y-8'>
            {/* Section header */}
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center gap-4'>
                <div className='hidden sm:block w-16 h-px bg-gradient-to-r from-transparent to-blue-500/80' />
                <div className='relative'>
                  <div className='absolute -inset-3 bg-blue-500/10 blur-xl rounded-full' />
                  <h2 className='relative font-display text-3xl sm:text-4xl md:text-5xl font-black text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
                    Hinter den Kulissen
                  </h2>
                </div>
                <div className='hidden sm:block w-16 h-px bg-gradient-to-l from-transparent to-blue-500/80' />
              </div>
              <p className='text-site-100 text-base sm:text-lg max-w-lg mx-auto'>
                Aufgaben in Technik & Crew
              </p>
            </div>
            
            {/* Jobs grid */}
            <div className='flex flex-wrap justify-center gap-4 sm:gap-6'>
              {person.jobs.map((job, i) => (
                <div
                  key={i}
                  className='group relative'
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Card glow */}
                  <div className='absolute -inset-2 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl' />
                  
                  <div className='relative poster-frame border-epic bg-site-800 p-6 sm:p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2'>
                    {/* Inner spotlight */}
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl' />
                    
                    <div className='relative flex flex-col items-center gap-4 text-center'>
                      {/* Icon */}
                      <div className='relative'>
                        <div className='absolute -inset-2 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                        <JobIcon icon={job.icon} />
                      </div>
                      
                      {/* Job title */}
                      <span className='font-display font-bold text-lg sm:text-xl text-site-50 group-hover:text-blue-400 transition-colors duration-300'>
                        {job.job}
                      </span>
                    </div>
                    
                    {/* Bottom accent */}
                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500' />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Empty state for new members */}
        {rolesData.length === 0 && (!person.jobs || person.jobs.length === 0) && (
          <section className='text-center py-12'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-site-900 border border-site-700 mb-6'>
              <svg className='w-10 h-10 text-kolping-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
              </svg>
            </div>
            <h3 className='font-display text-2xl font-bold text-site-50 mb-3'>
              Ein neuer Stern am Theaterhimmel
            </h3>
            <p className='text-site-100 max-w-md mx-auto'>
              Die Bühne wartet! Bald werden hier die ersten Rollen und Auftritte zu sehen sein.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
