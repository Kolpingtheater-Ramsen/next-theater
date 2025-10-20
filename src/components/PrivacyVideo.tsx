'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PrivacyVideoProps {
  videoId: string
  posterSrc: string
  title?: string
  subtitle?: string
  tagline?: string
}

export default function PrivacyVideo({ videoId, posterSrc, title, subtitle, tagline }: PrivacyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section className='relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
      {/* Background blur effect */}
      <div className='absolute inset-0 -z-10 w-full h-full'>
        <Image
          src={posterSrc}
          alt=''
          aria-hidden
          fill
          priority
          sizes='(max-width: 768px) 100vw, 1152px'
          className='object-cover opacity-60 blur-2xl scale-110 w-full h-full'
        />
      </div>

      {/* Video container */}
      <div className='relative w-full bg-site-900'>
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          {/* Poster/Loading state */}
          {!isLoaded && (
            <>
              <div className='absolute inset-0 w-full h-full'>
                <Image
                  src={posterSrc}
                  alt={title || 'Video'}
                  fill
                  priority
                  sizes='(max-width: 768px) 100vw, 1152px'
                  className='object-contain w-full h-full'
                />
              </div>

              {/* Play button overlay */}
              <button
                onClick={() => setIsLoaded(true)}
                className='absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/20 hover:bg-black/10 transition-all cursor-pointer group'
                aria-label={`Video laden: ${title || 'Video abspielen'}`}
                type='button'
              >
                <svg
                  className='w-20 h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
                <span className='absolute bottom-6 left-4 right-4 text-sm text-white drop-shadow-lg bg-black/40 px-3 py-2 rounded'>
                  Video laden (youtube-nocookie.com)
                </span>
              </button>
            </>
          )}

          {/* Video iframe */}
          {isLoaded && (
            <iframe
              className='absolute inset-0 w-full h-full border-0'
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              loading='lazy'
            />
          )}
        </div>

        {/* Text overlay (shown on top of poster/video) */}
        {!isLoaded && (title || subtitle || tagline) && (
          <div className='absolute inset-0 flex items-end pointer-events-none'>
            <div className='pointer-events-none w-full p-4 sm:p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent'>
              <div className='max-w-2xl'>
                {tagline ? (
                  <div className='mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-kolping-400 text-shadow uppercase'>
                    {tagline}
                  </div>
                ) : null}
                {title ? (
                  <h1 className='font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-shadow-lg text-white'>
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className='mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-site-50 text-shadow max-w-xl'>
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
