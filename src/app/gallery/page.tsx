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
            className='group poster-frame tilt border-epic bg-site-800 transition-all duration-500 hover:scale-[1.02]'
            aria-label={`Galerie ansehen: ${t.header}`}
            style={{ 
              viewTransitionName: `gallery-${t.galleryHash}`,
            }}
          >
            <div className='relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-site-700 to-site-900'>
              {/* Spotlight effect overlay */}
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none' />
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
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10' />
            </div>
            
            <div className='relative p-4 sm:p-5 bg-gradient-to-b from-site-800 to-site-900 border-t border-site-700'>
              <div className='space-y-2'>
                <h2 className='font-display text-lg sm:text-xl font-bold text-kolping-400 transition-all duration-300 group-hover:text-kolping-500 group-hover:translate-x-1'>
                  {t.header}
                </h2>
                <div className='flex items-center justify-between'>
                  <span className='text-xs sm:text-sm text-site-100 font-mono'>{t.date}</span>
                  <svg 
                    className='w-5 h-5 text-kolping-500 transition-transform duration-300 group-hover:translate-x-2' 
                    fill='none' 
                    viewBox='0 0 24 24' 
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
