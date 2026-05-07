'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const posterSrc = '/img/theatergaudi-2026-extended.webp'
const posterAlt =
  'Poster zur Theatergaudi am Samstag, 4. Juli, 10 Jahre Kolping-Theater'

export default function TheatergaudiPoster() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='group relative mx-auto block w-full max-w-[300px] rounded-sm text-left sm:max-w-[380px] lg:max-w-[440px] xl:max-w-[520px]'
        aria-label='Theatergaudi-Plakat vergrößern'
      >
        <Image
          src={posterSrc}
          alt={posterAlt}
          width={1600}
          height={2010}
          sizes='(min-width: 1280px) 520px, (min-width: 1024px) 440px, (min-width: 640px) 380px, 300px'
          className='h-auto w-full rounded-sm border border-kolping-400/45 shadow-[0_32px_90px_-28px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-[1.015] group-focus-visible:scale-[1.015]'
          priority
        />
        <span className='absolute bottom-3 right-3 rounded-sm border border-white/20 bg-black/70 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-colors group-hover:text-kolping-400'>
          Vergrößern
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8'
              role='dialog'
              aria-modal='true'
              aria-label='Theatergaudi-Plakat'
              onClick={() => setOpen(false)}
            >
              <div
                className='relative h-[min(88vh,1100px)] w-[min(94vw,880px)]'
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={posterSrc}
                  alt={posterAlt}
                  fill
                  sizes='94vw'
                  className='object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]'
                  priority
                />
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='absolute right-0 top-0 flex h-11 w-11 translate-x-2 -translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white transition-colors hover:border-kolping-400/60 hover:text-kolping-400 focus-visible:border-kolping-400 focus-visible:outline-none sm:translate-x-5 sm:-translate-y-5'
                  aria-label='Lightbox schließen'
                >
                  <svg
                    className='h-5 w-5'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    aria-hidden
                  >
                    <path d='M6 6l12 12M18 6L6 18' />
                  </svg>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
