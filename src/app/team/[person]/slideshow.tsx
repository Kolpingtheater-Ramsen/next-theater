'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

export default function Slideshow({
  name,
  count,
  aspect = 'landscape',
  placeholder = false,
}: {
  name: string
  count: number
  aspect?: 'portrait' | 'landscape'
  placeholder?: boolean
}) {
  const images = useMemo(() => {
    const list: string[] = []
    if (placeholder) {
      list.push(`/img/team/avatar/placeholder.svg`)
    } else if (count && count > 0) {
      for (let i = 1; i <= count; i++) {
        const suffix = i === 1 ? '' : String(i)
        list.push(`/img/team/avatar/${name}${suffix}.jpg`)
      }
    } else {
      list.push(`/img/team/avatar/${name}.jpg`)
    }
    return list
  }, [name, count, placeholder])

  const [index, setIndex] = useState(0)
  if (!images.length) return null
  return (
    <div className='rounded-lg border border-site-700 overflow-hidden bg-site-800'>
      <div
        className={`relative w-full ${
          aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
        }`}
      >
        <Image
          src={images[index]}
          alt={`${name} ${index + 1}`}
          fill
          className='object-cover'
        />
      </div>
      {images.length > 1 && (
        <div className='flex items-center justify-between p-2 bg-site-900'>
          <button
            className='px-3 py-1 border border-site-700 rounded hover:border-kolping-500'
            onClick={() =>
              setIndex((i) => (i - 1 + images.length) % images.length)
            }
          >
            Zurück
          </button>
          <span className='text-sm text-site-100'>
            {index + 1} / {images.length}
          </span>
          <button
            className='px-3 py-1 border border-site-700 rounded hover:border-kolping-500'
            onClick={() => setIndex((i) => (i + 1) % images.length)}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  )
}
