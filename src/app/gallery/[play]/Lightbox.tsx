'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { decodeHtmlEntities } from '@/lib/html'

type SlideDirection = 'left' | 'right' | null

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
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(null)
  const [imageKey, setImageKey] = useState(src)
  const decodedAlt = decodeHtmlEntities(alt)
  const decodedCaption = caption ? decodeHtmlEntities(caption) : undefined

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  // Handle image change with animation
  useEffect(() => {
    if (src !== imageKey) {
      setLoading(true)
      // Small delay to allow slide animation to start
      const timer = setTimeout(() => {
        setImageKey(src)
        setSlideDirection(null)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [src, imageKey])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose])

  const handlePrev = useCallback(() => {
    setSlideDirection('right')
    onPrev()
  }, [onPrev])

  const handleNext = useCallback(() => {
    setSlideDirection('left')
    onNext()
  }, [onNext])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose, handlePrev, handleNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const getImageAnimationClass = () => {
    if (slideDirection === 'left') {
      return 'animate-slide-in-right'
    }
    if (slideDirection === 'right') {
      return 'animate-slide-in-left'
    }
    return 'animate-scale-fade-in'
  }

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible && !isClosing ? 'bg-black/90 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'}
      `}
      onClick={handleClose}
    >
      {/* Background theatrical elements */}
      <div className={`
        absolute inset-0 pointer-events-none overflow-hidden
        transition-opacity duration-500
        ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/8 to-transparent blur-3xl animate-pulse-slow' />
        <div className='absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/8 to-transparent blur-3xl animate-pulse-slow animation-delay-1000' />
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-gradient-radial from-kolping-500/5 to-transparent blur-3xl' />
      </div>
      
      {/* Main content container */}
      <div
        className={`
          relative max-w-5xl w-full h-[80vh]
          transition-all duration-300 ease-out
          ${isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container with animations */}
        <div className='relative w-full h-full'>
          {/* Low-res placeholder while full image loads */}
          {loading && thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={decodedAlt}
              fill
              className='object-contain blur-md opacity-50'
              sizes='100vw'
              priority
            />
          ) : null}
          
          {/* Loading spinner */}
          {loading && (
            <div className='absolute inset-0 grid place-items-center z-10'>
              <div className='relative'>
                <div className='w-14 h-14 rounded-full border-2 border-kolping-500/20' />
                <div className='absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-kolping-500 animate-spin' />
                <div className='absolute inset-2 w-10 h-10 rounded-full border-2 border-transparent border-b-kolping-400 animate-spin animation-reverse' style={{ animationDuration: '0.8s' }} />
              </div>
            </div>
          )}
          
          {/* Main image with slide animation */}
          <div 
            key={imageKey}
            className={`absolute inset-0 ${getImageAnimationClass()}`}
          >
            <Image
              src={imageKey}
              alt={decodedAlt}
              fill
              className={`
                object-contain transition-all duration-500
                ${loading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}
              `}
              sizes='100vw'
              onLoadingComplete={() => setLoading(false)}
            />
          </div>
          
          {/* Theatrical frame effect */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]' />
          </div>
        </div>

        {/* Navigation controls - slide in from sides */}
        <button
          aria-label='Vorheriges Bild'
          className={`
            absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4
            rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 
            text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 
            hover:scale-110 active:scale-95
            transition-all duration-300 group
            ${isVisible && !isClosing ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
          `}
          style={{ transitionDelay: '150ms' }}
          onClick={handlePrev}
        >
          <svg className='w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        
        <button
          aria-label='Nächstes Bild'
          className={`
            absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4
            rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 
            text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 
            hover:scale-110 active:scale-95
            transition-all duration-300 group
            ${isVisible && !isClosing ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}
          style={{ transitionDelay: '150ms' }}
          onClick={handleNext}
        >
          <svg className='w-6 h-6 transition-transform duration-300 group-hover:translate-x-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
        
        {/* Top controls - slide down */}
        <div className={`
          absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2
          transition-all duration-300
          ${isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}
        style={{ transitionDelay: '100ms' }}
        >
          {downloadHref ? (
            <a
              href={downloadHref}
              download
              target='_blank'
              rel='noreferrer'
              aria-label='Bild herunterladen'
              className='p-2.5 sm:p-3 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-site-700 hover:border-kolping-500/60 hover:text-kolping-400 hover:scale-110 active:scale-95 transition-all duration-300'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
            </a>
          ) : null}
          <button
            aria-label='Schließen'
            className='p-2.5 sm:p-3 rounded-full bg-site-800/80 backdrop-blur-sm border border-kolping-500/30 text-white hover:bg-red-600/80 hover:border-red-500/60 hover:scale-110 active:scale-95 transition-all duration-300'
            onClick={handleClose}
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        
        {/* Caption - slide up */}
        {decodedCaption ? (
          <div className={`
            absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center
            transition-all duration-300
            ${isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '200ms' }}
          >
            <div className='inline-block max-w-2xl'>
              <div className='px-5 py-3 rounded-xl bg-site-800/80 backdrop-blur-sm border border-kolping-500/20 shadow-lg shadow-black/20'>
                <p className='text-sm sm:text-base text-white font-medium leading-relaxed'>
                  {decodedCaption}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Keyboard hints - fade in late */}
        <div className={`
          absolute bottom-4 left-4 hidden sm:flex items-center gap-3
          transition-all duration-500
          ${isVisible && !isClosing ? 'opacity-60' : 'opacity-0'}
        `}
        style={{ transitionDelay: '400ms' }}
        >
          <div className='flex items-center gap-1.5 text-xs text-white/70'>
            <kbd className='px-2 py-1 rounded bg-site-700/60 border border-site-600/50 font-mono text-[10px]'>←</kbd>
            <kbd className='px-2 py-1 rounded bg-site-700/60 border border-site-600/50 font-mono text-[10px]'>→</kbd>
            <span className='ml-1'>Navigation</span>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-white/70'>
            <kbd className='px-2 py-1 rounded bg-site-700/60 border border-site-600/50 font-mono text-[10px]'>ESC</kbd>
            <span className='ml-1'>Schließen</span>
          </div>
        </div>
      </div>

      {/* Inline styles for custom animations */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scale-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
        
        .animate-scale-fade-in {
          animation: scale-fade-in 0.4s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-reverse {
          animation-direction: reverse;
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}
