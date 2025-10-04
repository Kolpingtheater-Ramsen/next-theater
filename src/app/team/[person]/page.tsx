export const runtime = 'edge'
import { notFound } from 'next/navigation'
import data from '@/data/team.json'
import Slideshow from './slideshow'

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

  return (
    <div className='space-y-12'>
      <div className='grid md:grid-cols-[320px_1fr] gap-8 items-start'>
        <div className='space-y-4'>
          <Slideshow
            name={person.id}
            count={person.images ?? 0}
            aspect='portrait'
            placeholder={hasPlaceholder}
          />
        </div>
        <div className='space-y-4'>
          <div>
            <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>{person.name ?? person.id}</h1>
            <p className='text-site-100'>Mitglied des Kolpingtheaters</p>
          </div>
          {person.roles ? (
            <div>
              <div className='text-sm text-site-100'>
                Rollen in unseren Stücken
              </div>
              <ul className='mt-2 grid sm:grid-cols-2 gap-2 text-sm'>
                {person.roles
                  .map((role, index) => ({ role, play: plays[index] }))
                  .filter((x) => x.role && x.role.trim().length > 0)
                  .map((x, i) => (
                    <li
                      key={`${x.play}-${i}`}
                      className='flex items-start gap-2 rounded border border-site-700 bg-site-800 p-2'
                    >
                      <span className='min-w-0'>
                        <span className='text-site-100 block text-xs'>
                          {x.play}
                        </span>
                        <span className='font-medium'>{x.role}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          {person.jobs && person.jobs.length ? (
            <div>
              <div className='text-sm text-site-100'>
                Aufgaben in Technik & Crew
              </div>
              <ul className='mt-2 flex flex-wrap gap-2'>
                {person.jobs.map((j, i) => (
                  <li
                    key={i}
                    className='inline-flex items-center gap-1 rounded border border-site-700 px-2 py-1 bg-site-800 text-xs'
                  >
                    <span aria-hidden='true'>
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
                        : '•'}
                    </span>
                    <span>{j.job}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
