'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

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
      className='fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4'
      onClick={onClose}
    >
      <div
        className='relative max-w-5xl w-full h-[80vh]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Low-res placeholder while full image loads */}
        {loading && thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={alt}
            fill
            className='object-contain blur-sm'
            sizes='100vw'
            priority
          />
        ) : null}
        {!loading ? null : (
          <div className='absolute inset-0 grid place-items-center'>
            <div className='w-10 h-10 rounded-full border-2 border-white/50 border-t-transparent animate-spin' />
          </div>
        )}
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className='object-contain'
          sizes='100vw'
          onLoadingComplete={() => setLoading(false)}
        />

        {/* Controls */}
        <button
          aria-label='Vorheriges Bild'
          className='absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80'
          onClick={onPrev}
        >
          ‹
        </button>
        <button
          aria-label='Nächstes Bild'
          className='absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80'
          onClick={onNext}
        >
          ›
        </button>
        <div className='absolute top-2 right-2 flex items-center gap-2'>
          {downloadHref ? (
            <a
              href={downloadHref}
              download
              target='_blank'
              rel='noreferrer'
              aria-label='Bild herunterladen'
              className='px-2 py-1 rounded bg-black/60 text-white text-sm hover:bg-black/80'
            >
              ⤓
            </a>
          ) : null}
          <button
            aria-label='Schließen'
            className='px-2 py-1 rounded bg-black/60 text-white text-sm hover:bg-black/80'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {caption ? (
          <div className='absolute bottom-0 left-0 right-0 p-3 text-center text-sm text-white bg-gradient-to-t from-black/70 to-transparent'>
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  )
}
