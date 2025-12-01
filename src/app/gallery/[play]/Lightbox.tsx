'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export function Lightbox({
  src,
  alt,
  thumbSrc,
  caption,
  onClose,
  onPrev,
  onNext,
  downloadHref,
}: {
  src: string
  alt: string
  thumbSrc?: string
  caption?: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  downloadHref?: string
}) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
  }, [src])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className='fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in'
      onClick={onClose}
    >
      {/* Background theatrical elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/5 to-transparent blur-3xl' />
        <div className='absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/5 to-transparent blur-3xl' />
      </div>
      
      <div
        className='relative max-w-5xl w-full h-[80vh] max-w-full'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Low-res placeholder while full image loads */}
        {loading && thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={alt}
            fill
            className='object-contain blur-sm w-full h-full'
            sizes='100vw'
            priority
          />
        ) : null}
        {!loading ? null : (
          <div className='absolute inset-0 grid place-items-center'>
            <div className='w-12 h-12 rounded-full border-2 border-kolping-500/50 border-t-kolping-500 animate-spin' />
          </div>
        )}
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className='object-contain w-full h-full'
          sizes='100vw'
          onLoadingComplete={() => setLoading(false)}
        />

        {/* Navigation controls */}
        <button
          aria-label='Vorheriges Bild'
          className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 transition-all duration-300 group'
          onClick={onPrev}
        >
          <svg className='w-6 h-6 transition-transform duration-300 group-hover:-translate-x-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <button
          aria-label='Nächstes Bild'
          className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 transition-all duration-300 group'
          onClick={onNext}
        >
          <svg className='w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
        
        {/* Top controls */}
        <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2'>
          {downloadHref ? (
            <a
              href={downloadHref}
              download
              target='_blank'
              rel='noreferrer'
              aria-label='Bild herunterladen'
              className='p-2.5 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 transition-all duration-300'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
            </a>
          ) : null}
          <button
            aria-label='Schließen'
            className='p-2.5 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 transition-all duration-300'
            onClick={onClose}
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        
        {/* Caption */}
        {caption ? (
          <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center'>
            <div className='inline-block max-w-2xl'>
              <div className='px-4 py-3 rounded-lg bg-site-800/80 backdrop-blur-sm border border-kolping-500/20'>
                <p className='text-sm sm:text-base text-white font-medium'>
                  {caption}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
