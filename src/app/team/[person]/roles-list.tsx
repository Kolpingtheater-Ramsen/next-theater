'use client'

import { useState } from 'react'
import Link from 'next/link'

type Play = {
  play: string
  slug: string | null
  year: number
  location: string | null
  gallery: boolean
}

type RoleWithPlay = {
  role: string
  playData: Play
}

export default function RolesList({ roles }: { roles: RoleWithPlay[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const sorted = [...roles].reverse()

  return (
    <ol className='relative border-t border-site-700/80'>
      {sorted.map(({ role, playData }, i) => {
        const { play: title, year, location, slug, gallery } = playData
        const effectiveSlug = slug === 'malleus' ? 'maleficarum' : slug
        const hasGallery = Boolean(gallery && effectiveSlug)
        const isHovered = hovered === i

        const rowInner = (
          <div
            className={[
              'grid grid-cols-[auto_1fr_auto] items-baseline gap-4 sm:gap-8 py-5 sm:py-6 px-2 sm:px-4 border-b border-site-700/80 transition-colors duration-300',
              isHovered ? 'bg-site-900/60' : '',
            ].join(' ')}
          >
            {/* Year — large italic display */}
            <div className='font-display italic text-2xl sm:text-4xl text-kolping-400/80 leading-none tabular-nums w-16 sm:w-24 shrink-0'>
              {year}
            </div>

            {/* Play + role */}
            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-site-300'>
                <span className={isHovered ? 'text-kolping-400' : ''}>{title}</span>
                {location && (
                  <>
                    <span className='text-site-300/40' aria-hidden>·</span>
                    <span>{location}</span>
                  </>
                )}
              </div>
              <div className='mt-2'>
                <span className='font-mono text-[10px] uppercase tracking-[0.3em] text-site-300 mr-3'>
                  als
                </span>
                <span className='font-display italic text-xl sm:text-2xl text-site-50 leading-snug'>
                  {role}
                </span>
              </div>
            </div>

            {/* Affordance */}
            <div
              className={[
                'hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors',
                hasGallery
                  ? isHovered
                    ? 'text-kolping-400'
                    : 'text-site-300'
                  : 'text-transparent',
              ].join(' ')}
              aria-hidden={!hasGallery}
            >
              {hasGallery ? (
                <>
                  Galerie
                  <span
                    className={[
                      'transition-transform',
                      isHovered ? 'translate-x-1' : '',
                    ].join(' ')}
                  >
                    ↗
                  </span>
                </>
              ) : (
                <span>·</span>
              )}
            </div>
          </div>
        )

        return (
          <li
            key={`${title}-${year}-${i}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ animationDelay: `${i * 50}ms` }}
            className='animate-fade-in-up'
          >
            {hasGallery ? (
              <Link href={`/gallery/${effectiveSlug}`} className='block group'>
                {rowInner}
              </Link>
            ) : (
              rowInner
            )}
          </li>
        )
      })}
    </ol>
  )
}
