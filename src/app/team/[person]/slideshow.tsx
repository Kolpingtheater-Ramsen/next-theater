'use client'

import Image from 'next/image'
import { useMemo, useState, useCallback, useEffect } from 'react'

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
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIndex((i) => (i + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [images.length, isTransitioning])
  
  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIndex((i) => (i - 1 + images.length) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [images.length, isTransitioning])

  // Auto-advance slideshow for hero with multiple images
  useEffect(() => {
    if (aspect === 'hero' && images.length > 1) {
      const interval = setInterval(goToNext, 6000)
      return () => clearInterval(interval)
    }
  }, [aspect, images.length, goToNext])

  if (!images.length) return null
  
  // Hero layout (fixed aspect ratio container)
  if (aspect === 'hero') {
    return (
      <>
        <div className='absolute inset-0 bg-site-900'>
          {/* Image with cinematic transition */}
          <Image
            src={images[index]}
            alt={`${name} ${index + 1}`}
            fill
            className={`
              object-cover object-top transition-all duration-700 ease-out
              ${isTransitioning ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}
            `}
            priority
            sizes='(max-width: 768px) 100vw, 512px'
          />
          
          {/* Animated spotlight overlay */}
          {images.length > 1 && (
            <div className='absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 animate-spotlight-pulse pointer-events-none' />
          )}
        </div>
        
        {/* Navigation controls for hero */}
        {images.length > 1 && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-[25] flex items-center gap-3 sm:gap-4'>
            {/* Previous button */}
            <button
              className='group relative p-2.5 sm:p-3 rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-black'
              onClick={goToPrev}
              aria-label='Vorheriges Bild'
              disabled={isTransitioning}
            >
              {/* Button background */}
              <div className='absolute inset-0 bg-black/70 backdrop-blur-md border border-white/20 rounded-full group-hover:bg-black/90 group-hover:border-kolping-500/50 transition-all duration-300' />
              <svg className='relative w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            
            {/* Progress dots */}
            <div className='flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10'>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isTransitioning && i !== index) {
                      setIsTransitioning(true)
                      setIndex(i)
                      setTimeout(() => setIsTransitioning(false), 500)
                    }
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${i === index 
                      ? 'bg-kolping-500 w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                    }
                  `}
                  aria-label={`Bild ${i + 1} anzeigen`}
                />
              ))}
            </div>
            
            {/* Next button */}
            <button
              className='group relative p-2.5 sm:p-3 rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-black'
              onClick={goToNext}
              aria-label='Nächstes Bild'
              disabled={isTransitioning}
            >
              {/* Button background */}
              <div className='absolute inset-0 bg-black/70 backdrop-blur-md border border-white/20 rounded-full group-hover:bg-black/90 group-hover:border-kolping-500/50 transition-all duration-300' />
              <svg className='relative w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
          className={`
            object-cover transition-all duration-700
            ${isTransitioning ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}
          `}
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
            onClick={goToPrev}
            aria-label='Vorheriges Bild'
            disabled={isTransitioning}
          >
            <svg className='w-4 h-4 text-site-100 group-hover:text-kolping-400 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
            <span className='text-sm font-medium text-site-100 group-hover:text-kolping-400 transition-colors'>Zurück</span>
          </button>
          
          <button
            className='group flex items-center gap-2 px-4 py-2 rounded-lg bg-site-800 border border-site-700 hover:border-kolping-500 hover:bg-site-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
            onClick={goToNext}
            aria-label='Nächstes Bild'
            disabled={isTransitioning}
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
