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
}

type Play = {
  play: string
  slug: string | null
  year: number
  location: string | null
  gallery: boolean
}

const plays: Play[] = (data as { plays: Play[] }).plays

function findPerson(id: string): Entry | undefined {
  const lower = id.toLowerCase()
  const current = ((data as { current: Entry[] }).current || []).find(
    (person) => person.id.toLowerCase() === lower,
  )
  const former = ((data as { former: Entry[] }).former || []).find(
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
    placeholderAvatar: Boolean(current?.placeholderAvatar || former?.placeholderAvatar || tech?.placeholderAvatar),
    jobs: tech?.jobs,
  }
}

function getPersonType(id: string): 'current' | 'former' | 'tech' | null {
  const lower = id.toLowerCase()
  const inCurrent = ((data as { current: Entry[] }).current || []).some(
    (person) => person.id.toLowerCase() === lower,
  )
  const inFormer = ((data as { former: Entry[] }).former || []).some(
    (person) => person.id.toLowerCase() === lower,
  )
  const inTech = ((data as { tech: Entry[] }).tech || []).some(
    (person) => person.id.toLowerCase() === lower,
  )

  if (inCurrent) return 'current'
  if (inTech) return 'tech'
  if (inFormer) return 'former'
  return null
}

function JobIcon({ icon }: { icon?: string }) {
  const iconMap: Record<string, string> = {
    settings: '⚙️',
    camera: '📷',
    lightbulb: '💡',
    headphones: '🎧',
    explore: '🧭',
    scissors: '✂️',
  }
  return <span className='text-4xl'>{iconMap[icon || ''] || '🎭'}</span>
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
      .filter((item) => item.role && item.role.trim().length > 0)
    : []

  const hasRoles = rolesData.length > 0
  const hasJobs = Boolean(person.jobs && person.jobs.length > 0)

  const typeLabel =
    personType === 'current'
      ? 'Aktives Ensemble'
      : personType === 'tech'
        ? 'Technik & Crew'
        : 'Ehemaliges Mitglied'

  const heroImage = hasPlaceholder
    ? null
    : `/img/team/avatar/${person.id}.jpg`

  return (
    <div className='space-y-0'>
      <section className='relative -mx-4 -mt-8 overflow-hidden force-dark'>
        <div className='absolute inset-0 bg-site-950'>
          {heroImage && (
            <Image
              src={heroImage}
              alt={person.name ?? person.id}
              fill
              priority
              sizes='100vw'
              className='object-cover opacity-30 blur-sm scale-105'
            />
          )}
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/30 via-site-950/75 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/70 via-transparent to-site-950/60' />
        </div>

        <div className='relative mx-auto max-w-6xl px-4 pt-8 pb-10 sm:pb-14'>
          <Link
            href='/team'
            className='inline-flex items-center gap-2 text-site-100 hover:text-kolping-400 transition-colors group'
          >
            <svg className='w-5 h-5 transition-transform group-hover:-translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='text-sm font-medium'>Zurück zum Team</span>
          </Link>

          <div
            className={`mt-6 grid gap-6 lg:gap-10 items-end ${hasPlaceholder ? '' : 'lg:grid-cols-[1.1fr_0.9fr]'}`}
          >
            <div>
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='inline-flex items-center rounded-full border border-kolping-400/40 bg-site-950/60 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-kolping-400 uppercase'>
                  Profil
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                  {typeLabel}
                </span>
                {hasRoles && (
                  <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-site-100 uppercase'>
                    Rollenchronik
                  </span>
                )}
              </div>

              <h1 className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.94] text-shadow-lg'>
                <span className='text-site-50'>{person.name ?? person.id}</span>
              </h1>

              <p className='mt-4 sm:mt-6 text-base sm:text-lg text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                {personType === 'tech'
                  ? 'Einblick in Aufgaben hinter den Kulissen und Beiträge zum Gesamtbild jeder Produktion.'
                  : 'Überblick über Rollen, Auftritte und Stationen auf der Bühne des Kolpingtheaters Ramsen.'}
              </p>
            </div>

            {!hasPlaceholder && (
              <div style={{ viewTransitionName: `person-${person.id}` }}>
                <div className='relative poster-frame border-epic overflow-hidden'>
                  <div className='relative aspect-[3/4] w-full'>
                    <Slideshow
                      name={person.id}
                      count={imageCount}
                      aspect='hero'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none' />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-6 sm:pb-10'>
        {hasRoles && (
          <div>
            <SectionDivider
              title='Rollenchronik'
              subtitle='Alle dokumentierten Rollen im zeitlichen Verlauf'
            />
            <div className='glass border border-site-700 rounded-2xl p-4 sm:p-6 md:p-8'>
              <RolesList roles={rolesData} />
            </div>
          </div>
        )}

        {hasJobs && (
          <div>
            <SectionDivider
              title='Aufgaben im Team'
              subtitle='Beiträge in Technik, Organisation und Produktion'
            />
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'>
              {person.jobs!.map((job, index) => (
                <div
                  key={`${job.job}-${index}`}
                  className='group relative glass border border-site-700 rounded-xl p-5 text-center transition-all duration-300 hover:border-kolping-500/40 hover:bg-site-800/80'
                >
                  <div className='absolute -inset-3 bg-kolping-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
                  <div className='relative space-y-3'>
                    <JobIcon icon={job.icon} />
                    <p className='text-sm sm:text-base font-semibold text-site-50 group-hover:text-kolping-400 transition-colors'>
                      {job.job}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasRoles && !hasJobs && (
          <div className='py-14 text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-site-800 border border-site-700 mb-5'>
              <svg className='w-8 h-8 text-kolping-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
              </svg>
            </div>
            <h2 className='font-display text-2xl sm:text-3xl font-bold text-site-50'>
              Neue Stationen folgen
            </h2>
            <p className='mt-2 text-site-100 max-w-md mx-auto'>
              Für dieses Profil sind aktuell noch keine Rollen oder Aufgaben veröffentlicht.
            </p>
          </div>
        )}
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-12 sm:pb-16'>
        <div className='relative overflow-hidden rounded-2xl border border-site-700 force-dark'>
          <div className='absolute inset-0 bg-gradient-to-br from-kolping-400/10 via-site-900 to-site-900' />
          <div className='relative p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm sm:text-base text-site-100 text-center sm:text-left'>
              Mehr vom Ensemble oder direkt in die Galerie wechseln.
            </p>
            <div className='flex items-center gap-3'>
              <Link
                href='/team'
                className='inline-flex items-center gap-2 rounded-full border border-site-700 bg-site-800/60 px-5 py-2.5 text-sm font-medium transition-all hover:border-kolping-400/50 hover:bg-site-800'
              >
                Teamübersicht
              </Link>
              <Link
                href='/gallery'
                className='inline-flex items-center gap-2 rounded-full bg-kolping-400 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-kolping-500'
              >
                Zur Galerie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
