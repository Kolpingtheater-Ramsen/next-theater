'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from './Lightbox'

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

  return (
    <button
      className='group relative inline-block w-full mb-5 md:mb-6 break-inside-avoid text-left focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
      onClick={onClick}
      style={{ 
        viewTransitionName: `photo-${play}-${index}`,
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Card container with epic glow */}
      <div className='
        relative poster-frame border-epic bg-site-800 
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in-up
        overflow-hidden
      '>
        {/* Theatrical spotlight glow on hover */}
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />
        
        {/* Image container */}
        <div className='relative overflow-hidden bg-site-900'>
          {/* Animated spotlight beam */}
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/15 via-transparent to-transparent' />
          </div>
          
          <Image
            src={thumb}
            alt={meta.alt}
            width={meta.tw ?? meta.width}
            height={meta.th ?? meta.height}
            className='w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
          
          {/* Dramatic gradient overlay */}
          <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent z-10' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 z-10' />
          
          {/* Caption overlay */}
          <div className='absolute inset-x-0 bottom-0 z-20'>
            <div className='p-3 sm:p-4'>
              <p className='text-xs sm:text-sm text-white font-medium line-clamp-2 group-hover:text-kolping-400 transition-colors duration-300 drop-shadow-lg'>
                {caption ?? meta.alt}
              </p>
              <div className='flex items-center gap-2 mt-1.5'>
                <div className='w-4 h-0.5 bg-kolping-500 rounded-full transition-all duration-500 group-hover:w-8' />
                <span className='text-[10px] text-white/60 font-medium uppercase tracking-wider'>
                  
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent bar */}
        <div className='h-0.5 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </button>
  )
}

export default function ClientGrid({
  play,
  metas,
  captions,
}: {
  play: string
  metas: PhotoMeta[]
  captions: string[]
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
