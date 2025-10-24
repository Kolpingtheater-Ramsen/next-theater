'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

export default function Slideshow({
  name,
  count,
  aspect = 'hero',
  placeholder = false,
}: {
  name: string
  count: number
  aspect?: 'portrait' | 'landscape' | 'hero'
  placeholder?: boolean
}) {
  const images = useMemo(() => {
    const list: string[] = []
    if (placeholder) {
      list.push(`/img/team/avatar/placeholder.svg`)
    } else if (count && count > 0) {
      for (let i = 1; i <= count; i++) {
        const suffix = i === 1 ? '' : String(i)
        list.push(`/img/team/avatar/${name}${suffix}.jpg`)
      }
    } else {
      list.push(`/img/team/avatar/${name}.jpg`)
    }
    return list
  }, [name, count, placeholder])

  const [index, setIndex] = useState(0)
  if (!images.length) return null
  
  // Hero layout (full-screen background)
  if (aspect === 'hero') {
    return (
      <>
        <div className='absolute inset-0 bg-site-900'>
          <Image
            src={images[index]}
            alt={`${name} ${index + 1}`}
            fill
            className='object-cover object-center'
            priority
            sizes='100vw'
          />
        </div>
        
        {/* Navigation controls for hero */}
        {images.length > 1 && (
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-[25] flex items-center gap-2 sm:gap-3'>
            <button
              className='group p-2 sm:p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/30 hover:bg-black/90 hover:border-kolping-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500'
              onClick={() =>
                setIndex((i) => (i - 1 + images.length) % images.length)
              }
              aria-label='Vorheriges Bild'
            >
              <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            
            <div className='px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/20'>
              <span className='text-xs sm:text-sm font-mono text-white font-medium'>
                {index + 1} / {images.length}
              </span>
            </div>
            
            <button
              className='group p-2 sm:p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/30 hover:bg-black/90 hover:border-kolping-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500'
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label='Nächstes Bild'
            >
              <svg className='w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        )}
      </>
    )
  }
  
  // Standard portrait/landscape layout
  return (
    <div className='poster-frame border-epic bg-site-800 overflow-hidden'>
      <div
        className={`relative w-full ${
          aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
        } overflow-hidden bg-gradient-to-b from-site-700 to-site-900`}
      >
        {/* Subtle spotlight effect */}
        <div className='absolute inset-0 bg-gradient-to-br from-kolping-500/5 via-transparent to-transparent pointer-events-none z-10' />
        
        <Image
          src={images[index]}
          alt={`${name} ${index + 1}`}
          fill
          className='object-cover transition-transform duration-700'
        />
        
        {/* Gradient overlay at bottom */}
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10' />
        
        {/* Image counter overlay */}
        {images.length > 1 && (
          <div className='absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10'>
            <span className='text-xs font-mono text-white font-medium'>
              {index + 1} / {images.length}
            </span>
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <div className='flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-site-900 via-site-800 to-site-900 border-t border-site-700'>
          <button
            className='group flex items-center gap-2 px-4 py-2 rounded-lg bg-site-800 border border-site-700 hover:border-kolping-500 hover:bg-site-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
            onClick={() =>
              setIndex((i) => (i - 1 + images.length) % images.length)
            }
            aria-label='Vorheriges Bild'
          >
            <svg className='w-4 h-4 text-site-100 group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='text-sm font-medium text-site-100 group-hover:text-kolping-400 transition-colors'>Zurück</span>
          </button>
          
          <button
            className='group flex items-center gap-2 px-4 py-2 rounded-lg bg-site-800 border border-site-700 hover:border-kolping-500 hover:bg-site-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label='Nächstes Bild'
          >
            <span className='text-sm font-medium text-site-100 group-hover:text-kolping-400 transition-colors'>Weiter</span>
            <svg className='w-4 h-4 text-site-100 group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
