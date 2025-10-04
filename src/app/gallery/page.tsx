import Link from 'next/link'
import Image from 'next/image'
import timeline from '@/data/timeline.json'

type TimelineEntry = {
  date: string
  header: string
  text: string
  image?: string
  galleryHash?: string
}

export default function GalleryPage() {
  const shows = (timeline as unknown as TimelineEntry[])
    .filter((t) => t.image && t.galleryHash)
    .reverse()
  return (
    <div className='space-y-8 sm:space-y-10 md:space-y-12'>
      <h1 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight'>Galerie</h1>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {shows.map((t: TimelineEntry) => (
          <Link
            key={t.galleryHash}
            href={`/gallery/${t.galleryHash}`}
            className='group rounded-lg overflow-hidden border border-site-700 hover:border-kolping-500 transition-colors'
            aria-label={`Galerie ansehen: ${t.header}`}
          >
            <div className='relative aspect-[16/9] overflow-hidden'>
              <Image
                src={`/img/${t.image}`}
                alt={t.header}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </div>
            <div className='p-3 bg-site-800 flex items-center justify-between'>
              <span className='font-medium transition-colors group-hover:text-kolping-400'>{t.header}</span>
              <span className='text-xs text-site-100'>{t.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
