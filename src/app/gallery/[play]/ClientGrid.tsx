'use client'

import Image from 'next/image'
import { useState } from 'react'
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

// Theatrical photo card component
function PhotoCard({
  play,
  meta,
  caption,
  index,
  onClick,
}: {
  play: string
  meta: PhotoMeta
  caption: string
  index: number
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
        viewTransitionName: `photo-${play}-${index}`,
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
            onClick={() => setOpenIndex(i)}
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
          onClose={() => setOpenIndex(null)}
          onPrev={() =>
            setOpenIndex((i) => (i! - 1 + metas.length) % metas.length)
          }
          onNext={() => setOpenIndex((i) => (i! + 1) % metas.length)}
        />
      )}
    </>
  )
}
