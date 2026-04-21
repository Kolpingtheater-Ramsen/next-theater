'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  index,
  total,
  title,
  morphName,
}: {
  src: string
  alt: string
  thumbSrc?: string
  caption?: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  downloadHref?: string
  index?: number
  total?: number
  title?: string
  morphName?: string
}) {
  const [loading, setLoading] = useState(true)
  // When a view-transition morph is running, the new snapshot is captured
  // right after the parent's state flush — so the stage must be in the DOM
  // and fully visible on the first render. Otherwise the browser has nothing
  // to pair with the grid card's name and falls back to no animation.
  const [isVisible, setIsVisible] = useState(!!morphName)
  const [isClosing, setIsClosing] = useState(false)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(null)
  const [mounted, setMounted] = useState(
    () => typeof document !== 'undefined'
  )
  const decodedAlt = decodeHtmlEntities(alt)
  const decodedCaption = caption ? decodeHtmlEntities(caption) : undefined

  useEffect(() => {
    if (!mounted) setMounted(true)
    if (!isVisible) requestAnimationFrame(() => setIsVisible(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset the loading spinner whenever the source image changes. We no longer
  // delay the swap via a timer — when a view transition is driving the nav,
  // the browser captures old/new snapshots at the exact state-flush boundary
  // and a delayed imageKey would make both snapshots show the same image.
  useEffect(() => {
    setLoading(true)
  }, [src])

  const handleClose = useCallback(() => {
    // When a view-transition morph is driving the close, skip the internal
    // 200ms fade — the browser animates the stage back to the grid thumb.
    if (morphName) {
      onClose()
      return
    }
    setIsClosing(true)
    setTimeout(onClose, 200)
  }, [onClose, morphName])

  const handlePrev = useCallback(() => {
    // When view transitions are driving the nav slide, skip the internal
    // JS-driven animation to avoid doubling up.
    if (!morphName) setSlideDirection('right')
    onPrev()
  }, [onPrev, morphName])

  const handleNext = useCallback(() => {
    if (!morphName) setSlideDirection('left')
    onNext()
  }, [onNext, morphName])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose, handlePrev, handleNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const imgAnimClass = morphName
    ? ''
    : slideDirection === 'left'
      ? 'animate-slide-in-right'
      : slideDirection === 'right'
        ? 'animate-slide-in-left'
        : 'animate-scale-fade-in'

  if (!mounted) return null

  const showCounter = typeof index === 'number' && typeof total === 'number'

  const content = (
    <div
      className={[
        'force-dark fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ease-out',
        isVisible && !isClosing ? 'bg-black/94 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none',
      ].join(' ')}
      onClick={handleClose}
      role='dialog'
      aria-modal='true'
      aria-label={decodedAlt}
    >
      {/* Atmosphere: spotlight + grain + vignette */}
      <div
        className={[
          'absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500',
          isVisible && !isClosing ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        aria-hidden
      >
        <div className='absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_60%_90%_at_50%_0%,rgba(255,180,120,0.06),transparent_70%)]' />
        <div className='absolute inset-x-0 bottom-0 h-[40%] bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(255,122,0,0.05),transparent_75%)]' />
        <div className='absolute inset-0 grain opacity-40' />
        <div className='vignette' />
      </div>

      {/* Letterbox bars */}
      <div
        className={[
          'absolute top-0 inset-x-0 h-3 sm:h-4 bg-black z-20 transition-transform duration-500 ease-out',
          isVisible && !isClosing ? 'translate-y-0' : '-translate-y-full',
        ].join(' ')}
        aria-hidden
      />
      <div
        className={[
          'absolute bottom-0 inset-x-0 h-3 sm:h-4 bg-black z-20 transition-transform duration-500 ease-out',
          isVisible && !isClosing ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        aria-hidden
      />

      {/* Main image stage */}
      <div
        className={[
          'relative w-[min(92vw,1400px)] h-[min(82vh,900px)] mx-4',
          // Skip the scale-in CSS animation when a view-transition morph is
          // driving the open — otherwise the new snapshot captures the stage
          // at scale-0.97/opacity-0 and the morph lands on an invisible box.
          morphName
            ? ''
            : [
                'transition-[opacity,transform] duration-300 ease-out',
                isVisible && !isClosing
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-[0.97]',
              ].join(' '),
        ].join(' ')}
        style={morphName ? { viewTransitionName: morphName } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner ticks framing the image */}
        <span className='absolute -top-1 -left-1 w-4 h-4 border-l border-t border-kolping-400/60 z-30' aria-hidden />
        <span className='absolute -top-1 -right-1 w-4 h-4 border-r border-t border-kolping-400/60 z-30' aria-hidden />
        <span className='absolute -bottom-1 -left-1 w-4 h-4 border-l border-b border-kolping-400/60 z-30' aria-hidden />
        <span className='absolute -bottom-1 -right-1 w-4 h-4 border-r border-b border-kolping-400/60 z-30' aria-hidden />

        {/* Loading state */}
        {loading && thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={decodedAlt}
            fill
            className='object-contain blur-lg opacity-40'
            sizes='100vw'
            priority
          />
        ) : null}

        {loading && (
          <div className='absolute inset-0 grid place-items-center z-10 pointer-events-none'>
            <div className='relative w-10 h-10'>
              <div className='absolute inset-0 rounded-full border border-white/20' />
              <div className='absolute inset-0 rounded-full border border-transparent border-t-kolping-400 animate-spin' />
            </div>
          </div>
        )}

        {/* Full image */}
        <div key={src} className={`absolute inset-0 ${imgAnimClass}`}>
          <Image
            src={src}
            alt={decodedAlt}
            fill
            className={[
              'object-contain transition-opacity duration-500 drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]',
              loading ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
            sizes='100vw'
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      </div>

      {/* ══ TOP BAR ══ */}
      <div
        className={[
          'absolute top-0 inset-x-0 z-30 pt-5 sm:pt-7 px-4 sm:px-8 flex items-start justify-between gap-4 pointer-events-none transition-opacity duration-500 ease-out',
          isVisible && !isClosing ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {/* Counter + production title */}
        <div className='pointer-events-auto flex flex-col gap-2'>
          {showCounter && (
            <div className='flex items-baseline gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/80'>
              <span className='font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400/90 mr-1'>
                Szene
              </span>
              <span className='font-display italic text-kolping-400 text-2xl sm:text-3xl leading-none tabular-nums'>
                {String((index ?? 0) + 1).padStart(2, '0')}
              </span>
              <span className='text-white/40'>/</span>
              <span className='tabular-nums'>{String(total).padStart(2, '0')}</span>
            </div>
          )}
          {title && (
            <div className='font-display italic text-sm sm:text-lg text-white/80 leading-tight max-w-xs sm:max-w-md truncate'>
              {title}
            </div>
          )}
        </div>

        {/* Top-right controls */}
        <div className='pointer-events-auto flex items-center gap-2'>
          {downloadHref && (
            <a
              href={downloadHref}
              download
              target='_blank'
              rel='noreferrer'
              aria-label='Bild herunterladen'
              className='group inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 backdrop-blur-sm text-white/80 hover:text-kolping-400 hover:border-kolping-400/40 hover:bg-black/80 transition-all'
              onClick={(e) => e.stopPropagation()}
            >
              <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
            </a>
          )}
          <button
            aria-label='Schließen'
            className='group inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 backdrop-blur-sm text-white/80 hover:text-kolping-400 hover:border-kolping-400/40 hover:bg-black/80 transition-all'
            onClick={handleClose}
          >
            <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.8}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ SIDE CONTROLS ══ */}
      <button
        aria-label='Vorheriges Bild'
        className={[
          'group absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30',
          'inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full',
          'border border-white/15 bg-black/60 backdrop-blur-sm text-white/80',
          'hover:text-kolping-400 hover:border-kolping-400/40 hover:bg-black/80',
          'active:scale-95 transition-all duration-300',
          isVisible && !isClosing ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
        ].join(' ')}
        style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        onClick={(e) => {
          e.stopPropagation()
          handlePrev()
        }}
      >
        <svg className='w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      <button
        aria-label='Nächstes Bild'
        className={[
          'group absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30',
          'inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full',
          'border border-white/15 bg-black/60 backdrop-blur-sm text-white/80',
          'hover:text-kolping-400 hover:border-kolping-400/40 hover:bg-black/80',
          'active:scale-95 transition-all duration-300',
          isVisible && !isClosing ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
        ].join(' ')}
        style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        onClick={(e) => {
          e.stopPropagation()
          handleNext()
        }}
      >
        <svg className='w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* ══ BOTTOM BAR ══ */}
      <div
        className={[
          'absolute bottom-0 inset-x-0 z-30 pb-5 sm:pb-7 px-4 sm:px-8 flex items-end justify-between gap-4 pointer-events-none transition-opacity duration-500',
          isVisible && !isClosing ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
      >
        {/* Keyboard hints */}
        <div className='hidden sm:flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55'>
          <span className='flex items-center gap-1.5'>
            <kbd className='px-2 py-1 rounded-sm bg-black/60 border border-white/15 text-[10px]'>←</kbd>
            <kbd className='px-2 py-1 rounded-sm bg-black/60 border border-white/15 text-[10px]'>→</kbd>
            Navigation
          </span>
          <span className='flex items-center gap-1.5'>
            <kbd className='px-2 py-1 rounded-sm bg-black/60 border border-white/15 text-[10px]'>Esc</kbd>
            Schließen
          </span>
        </div>

        {/* Caption */}
        {decodedCaption ? (
          <div className='pointer-events-auto flex-1 text-right'>
            <p className='inline-block max-w-2xl font-display italic text-sm sm:text-base text-white/90 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]'>
              „{decodedCaption}&ldquo;
            </p>
          </div>
        ) : (
          <span />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in-left  { animation: slide-in-left  0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-scale-fade-in  { animation: scale-fade-in  0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>
    </div>
  )

  return createPortal(content, document.body)
}
