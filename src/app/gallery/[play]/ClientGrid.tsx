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
              className='group inline-block w-full mb-5 md:mb-6 break-inside-avoid text-left poster-frame border-epic overflow-hidden transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-kolping-500 focus:ring-offset-2 focus:ring-offset-site-900'
              onClick={() => setOpenIndex(i)}
              style={{ 
                viewTransitionName: `photo-${play}-${i}`,
              }}
            >
              <div className='relative overflow-hidden bg-site-900 cursor-pointer'>
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
                                
                {/* Caption overlay */}
                <div className='absolute inset-x-0 bottom-0 z-20'>
                  <div className='p-3 sm:p-4 sm:pt-10 pt-10 bg-gradient-to-t from-black/95 via-black/90 to-transparent'>
                    <p className='text-xs sm:text-sm text-white font-medium line-clamp-2 transition-all duration-300' style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      {captions[i] ?? m.alt}
                    </p>
                  </div>
                </div>
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
