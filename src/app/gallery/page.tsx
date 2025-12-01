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

// Gallery card with theatrical effects
function GalleryCard({ 
  show, 
  index 
}: { 
  show: TimelineEntry
  index: number 
}) {
  return (
    <Link
      href={`/gallery/${show.galleryHash}`}
      className='group relative block'
      aria-label={`Galerie ansehen: ${show.header}`}
      style={{ 
        viewTransitionName: `gallery-${show.galleryHash}`,
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Card container with epic glow */}
      <div className='
        relative poster-frame border-epic bg-site-800 
        transition-all duration-500 ease-out
        hover:scale-[1.03] hover:-translate-y-2
        animate-fade-in-up
      '>
        {/* Theatrical spotlight glow on hover */}
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />
        
        {/* Image container */}
        <div className='relative aspect-[3/4] overflow-hidden bg-site-800'>
          {/* Animated spotlight beam */}
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/20 via-transparent to-transparent' />
          </div>
          
          <Image
            src={`/img/${show.image}`}
            alt={show.header}
            fill
            className='object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110'
            style={{ 
              viewTransitionName: `gallery-image-${show.galleryHash}`,
            }}
          />
          
          {/* Dramatic gradient overlays */}
          <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10' />
          
          {/* Year badge */}
          <div className='absolute top-3 right-3 z-20'>
            <div className='px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-kolping-500/40'>
              <span className='text-[10px] font-bold uppercase tracking-wider text-kolping-400 font-mono'>{show.date}</span>
            </div>
          </div>
          
          {/* Title overlay on image */}
          <div className='absolute bottom-0 inset-x-0 p-4 z-20'>
            <h2 className='font-display font-bold text-lg sm:text-xl text-white group-hover:text-kolping-400 transition-colors duration-300 drop-shadow-lg'>
              {show.header}
            </h2>
            <div className='flex items-center gap-2 mt-1'>
              <div className='w-6 h-0.5 bg-kolping-500 rounded-full transition-all duration-500 group-hover:w-12' />
              <span className='text-xs text-white/70 font-medium'>
                Galerie ansehen
              </span>
              <svg 
                className='w-4 h-4 text-kolping-400 transition-transform duration-300 group-hover:translate-x-1' 
                fill='none' 
                viewBox='0 0 24 24' 
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Bottom accent bar */}
        <div className='h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </Link>
  )
}

export default function GalleryPage() {
  const shows = (timeline as unknown as TimelineEntry[])
    .filter((t) => t.image && t.galleryHash)
    .reverse()

  return (
    <div className='space-y-8 sm:space-y-12 md:space-y-16'>
      {/* Epic Hero Section */}
      <section className='relative -mt-8 pt-8 pb-12 sm:pb-16 overflow-hidden'>
        {/* Background theatrical elements */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Stage spotlights */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />
          <div className='absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />
        </div>
        
        <div className='relative text-center space-y-6'>
          {/* Decorative top element */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-kolping-500/20 blur-2xl rounded-full' />
              <svg className='relative w-12 h-12 text-kolping-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            </div>
          </div>
          
          <h1 className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight'>
            <span className='text-kolping-400 drop-shadow-[0_0_30px_rgba(255,122,0,0.4)]'>Unsere</span>{' '}
            <span className='text-site-50'>Galerie</span>
          </h1>
          
          <p className='text-site-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Tauchen Sie ein in unsere vergangenen Aufführungen und erleben Sie die 
            <span className='text-kolping-400'> Magie des Theaters</span> – 
            festgehalten in unvergesslichen Momenten.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section>
        {/* Section Divider */}
        <div className='relative py-8 sm:py-12'>
          <div className='relative text-center space-y-3'>
            <div className='flex items-center justify-center gap-4'>
              {/* Left decorative flourish */}
              <div className='hidden sm:flex items-center gap-2'>
                <div className='w-8 h-px bg-gradient-to-l from-kolping-500 to-transparent' />
                <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                <div className='w-16 h-px bg-gradient-to-l from-kolping-500/80 to-transparent' />
              </div>
              
              <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
                Produktionen
              </h2>
              
              {/* Right decorative flourish */}
              <div className='hidden sm:flex items-center gap-2'>
                <div className='w-16 h-px bg-gradient-to-r from-kolping-500/80 to-transparent' />
                <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                <div className='w-8 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
              </div>
            </div>
            
            <p className='text-site-100 text-sm sm:text-base max-w-lg mx-auto'>
              Wählen Sie eine Produktion, um die Fotogalerie zu erkunden
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          {shows.map((show, index) => (
            <GalleryCard 
              key={show.galleryHash} 
              show={show} 
              index={index} 
            />
          ))}
        </div>
      </section>
    </div>
  )
}
