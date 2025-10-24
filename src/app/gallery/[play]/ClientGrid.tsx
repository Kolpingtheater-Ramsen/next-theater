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
        {metas.map((m: PhotoMeta, i: number) => {
          const thumb = `/img/gallery_thumbs/${play}/Bild_${m.index + 1}.jpg`
          return (
            <button
              key={i}
              className='group inline-block w-full mb-5 md:mb-6 break-inside-avoid text-left poster-frame border-epic transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
              onClick={() => setOpenIndex(i)}
              style={{ 
                viewTransitionName: `photo-${play}-${i}`,
              }}
            >
              <div className='relative overflow-hidden bg-site-900'>
                {/* Subtle spotlight effect */}
                <div className='absolute inset-0 bg-gradient-to-br from-kolping-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10' />
                
                <Image
                  src={thumb}
                  alt={m.alt}
                  width={m.tw ?? m.width}
                  height={m.th ?? m.height}
                  className='w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                
                {/* Overlay gradient for caption readability */}
                <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10' />
                
                {/* Hover caption overlay */}
                <div className='absolute inset-x-0 bottom-0 p-3 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20'>
                  Klicken zum Vergrößern
                </div>
              </div>
              
              <div className='relative p-3 sm:p-4 bg-gradient-to-b from-site-800 to-site-900 border-t border-site-700 group-hover:border-kolping-500/50 transition-colors duration-300'>
                <p className='text-xs sm:text-sm text-site-100 line-clamp-2 group-hover:text-site-50 transition-colors duration-300'>
                  {captions[i] ?? m.alt}
                </p>
              </div>
            </button>
          )
        })}
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
