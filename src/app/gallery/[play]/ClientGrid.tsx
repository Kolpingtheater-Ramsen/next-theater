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
  blurDataURL?: string
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
      <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]'>
        {metas.map((m: PhotoMeta, i: number) => {
          const thumb = `/img/gallery_thumbs/${play}/Bild_${m.index + 1}.jpg`
          return (
            <button
              key={i}
              className='group inline-block w-full mb-4 break-inside-avoid text-left rounded-lg overflow-hidden border border-site-700 hover:border-kolping-500'
              onClick={() => setOpenIndex(i)}
            >
              <Image
                src={thumb}
                alt={m.alt}
                width={m.tw ?? m.width}
                height={m.th ?? m.height}
                className='w-full h-auto object-cover'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                placeholder={m.blurDataURL ? 'blur' : undefined}
                blurDataURL={m.blurDataURL}
              />
              <div className='p-3 bg-site-800 text-sm text-site-100'>
                {captions[i] ?? m.alt}
              </div>
            </button>
          )
        })}
      </div>
      {openIndex !== null && (
        <Lightbox
          src={`/img/gallery_full/${play}/Bild_${
            metas[openIndex].index + 1
          }.jpg`}
          thumbSrc={`/img/gallery_thumbs/${play}/Bild_${
            metas[openIndex].index + 1
          }.jpg`}
          alt={metas[openIndex].alt}
          caption={captions[openIndex] ?? metas[openIndex].alt}
          downloadHref={`/img/gallery_full/${play}/Bild_${
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
