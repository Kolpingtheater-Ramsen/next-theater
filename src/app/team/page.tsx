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
    <div className='space-y-10'>
      <div>
        <h1 className='text-3xl font-bold mb-4'>Ensemble</h1>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {current.map((p: Person) => (
            <Link
              key={p.id}
              href={`/team/${encodeURIComponent(p.id)}`}
              className='group rounded-lg overflow-hidden border border-site-700 hover:border-kolping-500 transition-colors'
            >
              <div className='relative aspect-[3/4]'>
                <Image
                  src={
                    p.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : avatarPath(p.id)
                  }
                  alt={p.name ?? p.id}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-4 bg-site-800'>
                <div className='font-medium text-lg'>{p.name ?? p.id}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>Technik & Crew</h2>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {tech.map((t) => (
            <Link
              key={t.id}
              href={`/team/${encodeURIComponent(t.id)}`}
              className='rounded-lg overflow-hidden border border-site-700 hover:border-kolping-500 transition-colors'
            >
              <div className='relative aspect-[3/4] bg-site-800'>
                <Image
                  src={
                    t.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : `/img/team/avatar/${t.id}.jpg`
                  }
                  alt={t.name ?? t.id}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-4 bg-site-800'>
                <div className='font-medium text-lg'>{t.name ?? t.id}</div>
                {t.jobs && t.jobs.length ? (
                  <ul className='mt-1 flex flex-wrap gap-2 text-xs text-site-100'>
                    {t.jobs.map((j, i) => (
                      <li
                        key={i}
                        className='inline-flex items-center gap-1 rounded border border-site-700 px-2 py-0.5 bg-site-900'
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
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>Ehemalige</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {former.map((p: Person) => (
            <Link
              key={p.id}
              href={`/team/${encodeURIComponent(p.id)}`}
              className='group rounded-lg overflow-hidden border border-site-700 hover:border-kolping-500 transition-colors'
            >
              <div className='relative aspect-[3/4]'>
                <Image
                  src={
                    p.placeholderAvatar
                      ? '/img/team/avatar/placeholder.svg'
                      : avatarPath(p.id)
                  }
                  alt={p.name ?? p.id}
                  fill
                  className='object-cover filter sepia'
                />
              </div>
              <div className='p-3 bg-site-800'>
                <div className='font-medium text-sm'>{p.name ?? p.id}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
