'use client'

import Image from 'next/image'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Lightbox } from './Lightbox'
import { decodeHtmlEntities } from '@/lib/html'

type PhotoMeta = {
  width: number
  height: number
  alt: string
  index: number
  tw?: number
  th?: number
  blurhash?: string
}

// A single shared name — only the card that is currently morphing carries it,
// so at most one element in the DOM holds the name at any given time. That
// avoids both duplicate-name errors AND the z-order issue where every named
// grid card ends up in the view-transition overlay layer (the active morph
// would otherwise render behind later-sourced cards).
const MORPH_NAME = 'gallery-morph'

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => {
    finished?: Promise<unknown>
    updateCallbackDone?: Promise<unknown>
    ready?: Promise<unknown>
  } | void
}

// Theatrical photo card component
function PhotoCard({
  play,
  meta,
  caption,
  index,
  isNamed,
  onClick,
}: {
  play: string
  meta: PhotoMeta
  caption: string
  index: number
  isNamed: boolean
  onClick: () => void
}) {
  const thumb = `/img/gallery_thumbs/${play}/Bild_${meta.index + 1}.jpg`
  const decodedAlt = decodeHtmlEntities(meta.alt)
  const decodedCaption = decodeHtmlEntities(caption ?? meta.alt)

  return (
    <button
      className='group relative inline-block w-full mb-5 md:mb-6 break-inside-avoid text-left focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
      onClick={onClick}
      style={{
        viewTransitionName: isNamed ? MORPH_NAME : undefined,
        animationDelay: `${Math.min(index, 30) * 30}ms`,
      }}
    >
      <div className='relative overflow-hidden rounded-xl border-epic bg-site-950 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out hover:-translate-y-1 animate-fade-in-up'>
        <Image
          src={thumb}
          alt={decodedAlt}
          width={meta.tw ?? meta.width}
          height={meta.th ?? meta.height}
          className='w-full h-auto object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />

        <div className='sweep' aria-hidden />
        <div className='absolute inset-0 scanlines opacity-10 pointer-events-none' aria-hidden />

        {/* Bottom tonal gradient for caption */}
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/65 to-transparent pointer-events-none' aria-hidden />

        {/* Corner ticks */}
        <span className='absolute top-2 left-2 w-3 h-3 border-l border-t border-kolping-400/60' aria-hidden />
        <span className='absolute top-2 right-2 w-3 h-3 border-r border-t border-kolping-400/60' aria-hidden />
        <span className='absolute bottom-2 left-2 w-3 h-3 border-l border-b border-kolping-400/60' aria-hidden />
        <span className='absolute bottom-2 right-2 w-3 h-3 border-r border-b border-kolping-400/60' aria-hidden />

        {/* Caption */}
        <div className='absolute inset-x-0 bottom-0 p-3 sm:p-4 z-10'>
          <div className='font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-kolping-300/90 mb-1'>
            № {String(index + 1).padStart(2, '0')}
          </div>
          <p className='font-display italic text-sm sm:text-base text-white/95 line-clamp-2 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'>
            {decodedCaption}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function ClientGrid({
  play,
  metas,
  captions,
  title,
}: {
  play: string
  metas: PhotoMeta[]
  captions: string[]
  title?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // The index of the card that currently "owns" the morph name (either about
  // to open, or about to receive the reverse-close). Exactly one card carries
  // MORPH_NAME at a time — or zero when idle.
  const [morphIndex, setMorphIndex] = useState<number | null>(null)

  const handleOpen = (i: number) => {
    const doc = document as ViewTransitionDoc
    if (!doc.startViewTransition) {
      setOpenIndex(i)
      return
    }
    // Make sure no stale slide direction leaks into the open morph.
    delete document.documentElement.dataset.slide
    // 1) Name the source card synchronously so the OLD snapshot has it.
    flushSync(() => setMorphIndex(i))
    // 2) Start the transition; inside, flip openIndex so the lightbox mounts
    //    and the source card loses the name (openIndex === index guard below).
    const t = doc.startViewTransition(() => {
      flushSync(() => setOpenIndex(i))
    })
    // 3) After the browser is done animating, clear the marker.
    const done =
      (t && typeof t === 'object' && 'finished' in t && t.finished) || null
    if (done) done.finally(() => setMorphIndex(null))
    else setMorphIndex(null)
  }

  const handleClose = () => {
    const doc = document as ViewTransitionDoc
    const current = openIndex
    if (!doc.startViewTransition || current === null) {
      setOpenIndex(null)
      return
    }
    delete document.documentElement.dataset.slide
    // 1) Mark the destination card so it can reclaim the name in the NEW snap
    //    (the card currently has no name because openIndex === index).
    flushSync(() => setMorphIndex(current))
    const t = doc.startViewTransition(() => {
      flushSync(() => setOpenIndex(null))
    })
    const done =
      (t && typeof t === 'object' && 'finished' in t && t.finished) || null
    if (done) done.finally(() => setMorphIndex(null))
    else setMorphIndex(null)
  }

  const navigate = (direction: 'prev' | 'next') => {
    const doc = document as ViewTransitionDoc
    const step = () => {
      setOpenIndex((i) => {
        if (i === null) return i
        return direction === 'next'
          ? (i + 1) % metas.length
          : (i - 1 + metas.length) % metas.length
      })
    }
    if (!doc.startViewTransition) {
      step()
      return
    }
    // Signal direction to the CSS so ::view-transition-old/new get the right
    // slide keyframes. Cleared after the transition finishes.
    document.documentElement.dataset.slide = direction
    const t = doc.startViewTransition(() => flushSync(step))
    const done =
      (t && typeof t === 'object' && 'finished' in t && t.finished) || null
    const clear = () => {
      delete document.documentElement.dataset.slide
    }
    if (done) done.finally(clear)
    else clear()
  }
  const handlePrev = () => navigate('prev')
  const handleNext = () => navigate('next')

  return (
    <>
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6 [column-fill:_balance]'>
        {metas.map((m: PhotoMeta, i: number) => (
          <PhotoCard
            key={i}
            play={play}
            meta={m}
            caption={captions[i] ?? m.alt}
            index={i}
            // Only the morph-source card carries the name — and only when
            // the lightbox is NOT currently showing it (to avoid duplicate
            // names during the transition commit).
            isNamed={morphIndex === i && openIndex !== i}
            onClick={() => handleOpen(i)}
          />
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          src={`/img/gallery_thumbs/${play}/Bild_${
            metas[openIndex].index + 1
          }.jpg`}
          thumbSrc={`/img/gallery_thumbs/${play}/Bild_${
            metas[openIndex].index + 1
          }.jpg`}
          alt={metas[openIndex].alt}
          caption={captions[openIndex] ?? metas[openIndex].alt}
          downloadHref={`/img/gallery_thumbs/${play}/Bild_${
            metas[openIndex].index + 1
          }.jpg`}
          index={openIndex}
          total={metas.length}
          title={title}
          morphName={MORPH_NAME}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
