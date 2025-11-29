import Link from 'next/link'
import Image from 'next/image'
import timeline from '@/data/timeline.json'

type TimelineEntry = {
  date: string
  header: string
  text: string
  image?: string
  galleryHash?: string
  dominantColor?: string
}

export default function GalleryPage() {
  const shows = (timeline as unknown as TimelineEntry[])
    .filter((t) => t.image && t.galleryHash)
    .reverse()
  return (
    <div className='space-y-8 sm:space-y-10 md:space-y-12'>
      <div className='text-center space-y-4'>
        <h1 className='font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-kolping-400'>
          Galerie
        </h1>
        <p className='text-site-100 text-sm sm:text-base max-w-2xl mx-auto'>
          Tauchen Sie ein in unsere vergangenen Aufführungen und erleben Sie die Magie des Theaters
        </p>
      </div>
      
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
        {shows.map((t: TimelineEntry) => (
          <Link
            key={t.galleryHash}
            href={`/gallery/${t.galleryHash}`}
            className='group relative poster-frame tilt border-epic overflow-hidden transition-all duration-500 hover:scale-[1.02]'
            aria-label={`Galerie ansehen: ${t.header}`}
            style={{ 
              viewTransitionName: `gallery-${t.galleryHash}`,
            }}
          >
            <div className='relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-site-700 to-site-900'>
              {/* Spotlight effect overlay */}
              <div className='spotlight' />
              
              <Image
                src={`/img/${t.image}`}
                alt={t.header}
                fill
                className='object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110'
                style={{ 
                  viewTransitionName: `gallery-image-${t.galleryHash}`,
                }}
              />
              
              {/* Gradient overlay for text readability */}
              <div className='absolute inset-0 z-10' />
              
              {/* Text overlay positioned at bottom with backdrop */}
              <div className='absolute inset-x-0 bottom-0 z-20'>
                <div className='p-4 pt-10 sm:p-5 sm:pt-10 bg-gradient-to-t from-black/95 via-black/90 to-transparent'>
                  <div className='space-y-2'>
                    <h2 className='font-display text-lg sm:text-xl font-bold text-white transition-all duration-300 group-hover:text-kolping-400 group-hover:translate-x-1' style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {t.header}
                    </h2>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs sm:text-sm text-white/90 font-mono' style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{t.date}</span>
                      <svg 
                        className='w-5 h-5 text-kolping-400 transition-transform duration-300 group-hover:translate-x-2' 
                        fill='none' 
                        viewBox='0 0 24 24' 
                        stroke='currentColor'
                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
