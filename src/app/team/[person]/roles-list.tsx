'use client'

import { useState } from 'react'

type Role = {
  role: string
  play: string
}

type RolesListProps = {
  roles: Role[]
}

function extractYear(play: string): string {
  const match = play.match(/^(\d{4})/)
  return match ? match[1] : ''
}

function extractTitle(play: string): string {
  // Remove year prefix and clean up
  return play.replace(/^\d{4}\s*/, '').replace(/[""]/g, '"').trim()
}

function isKreativbuehne(play: string): boolean {
  return play.toLowerCase().includes('kreativbühne')
}

export default function RolesList({ roles }: RolesListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Reverse to show latest first
  const sortedRoles = [...roles].reverse()
  
  return (
    <div className='relative'>
      {/* Timeline center line */}
      <div className='absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-kolping-500 via-kolping-500/50 to-transparent' />
      
      <ul className='space-y-4 sm:space-y-6'>
        {sortedRoles.map((role, i) => {
          const year = extractYear(role.play)
          const title = extractTitle(role.play)
          const isKB = isKreativbuehne(role.play)
          const isHovered = hoveredIndex === i
          
          return (
            <li
              key={`${role.play}-${i}`}
              className='group relative pl-14 sm:pl-20'
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Timeline node */}
              <div className={`
                absolute left-4 sm:left-6 top-4 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 
                transition-all duration-300 z-10
                ${isHovered 
                  ? 'bg-kolping-500 border-kolping-400 scale-125 shadow-[0_0_20px_rgba(255,122,0,0.5)]' 
                  : 'bg-site-900 border-kolping-500/60 group-hover:border-kolping-400'
                }
              `}>
                {/* Inner glow */}
                <div className={`
                  absolute inset-1 rounded-full bg-kolping-500/50 
                  transition-opacity duration-300
                  ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                `} />
              </div>
              
              {/* Year badge (positioned on timeline) */}
              {year && (
                <div className={`
                  absolute left-0 top-4 text-[10px] sm:text-xs font-mono font-bold
                  transition-colors duration-300
                  ${isHovered ? 'text-kolping-400' : 'text-site-100'}
                `}
                style={{
                  left: '-10px'
                }}
                >
                  {year}
                </div>
              )}
              
              {/* Content card */}
              <div className={`
                relative overflow-hidden rounded-xl border 
                bg-gradient-to-br from-site-800 to-site-900 
                transition-all duration-500 ease-out
                ${isHovered 
                  ? 'border-kolping-500/60 shadow-[0_8px_30px_rgba(255,122,0,0.15)] -translate-y-1' 
                  : 'border-site-700 hover:border-site-600'
                }
              `}>
                {/* Spotlight effect on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-kolping-500/10 via-transparent to-transparent 
                  transition-opacity duration-500
                  ${isHovered ? 'opacity-100' : 'opacity-0'}
                `} />
                
                {/* Card content */}
                <div className='relative p-4 sm:p-5'>
                  {/* Play title */}
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className={`
                          text-xs font-medium uppercase tracking-wider
                          transition-colors duration-300
                          ${isHovered ? 'text-kolping-400' : 'text-site-100'}
                        `}>
                          {title.replace('(Kreativbühne)', '').trim()}
                        </span>
                        {isKB ? (
                          <span className='px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-kolping-500/20 text-kolping-400 rounded'>
                            Kreativbühne
                          </span>
                        ): 
                        (
                          <span className='px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-kolping-500/20 text-kolping-400 rounded'>
                            Open-Air-Bühne
                          </span>
                        )
                        } 
                      </div>
                    </div>
                  </div>
                  
                  {/* Role */}
                  <div className='flex items-baseline gap-3'>
                    <div className='w-6 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
                    <div>
                      <span className='text-xs text-site-100 mr-2'>als</span>
                      <span className={`
                        font-display font-bold text-lg sm:text-xl
                        transition-colors duration-300
                        ${isHovered ? 'text-kolping-400' : 'text-site-50'}
                      `}>
                        {role.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className={`
                  h-0.5 bg-gradient-to-r from-transparent via-kolping-500 to-transparent
                  transition-opacity duration-500
                  ${isHovered ? 'opacity-60' : 'opacity-0'}
                `} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
