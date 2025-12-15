import Image from 'next/image'
import Link from 'next/link'
import timeline from '@/data/timeline.json'

type TimelineEntry = {
  date: string
  header: string
  text: string
  image?: string
  galleryHash?: string
  newYear?: boolean
  dominantColor?: string
}

export const dynamic = 'force-static'

// Section Divider with theatrical curtain effect
function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
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
            {title}
          </h2>
          
          {/* Right decorative flourish */}
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-16 h-px bg-gradient-to-r from-kolping-500/80 to-transparent' />
            <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
            <div className='w-8 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
          </div>
        </div>
        
        {subtitle && (
          <p className='text-site-100 text-sm sm:text-base max-w-lg mx-auto'>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// Year separator with theatrical styling
function YearSeparator({ year }: { year: string }) {
  return (
    <div className='relative py-6 sm:py-8 -ml-8 sm:-ml-10'>
      <div className='flex items-center gap-4'>
        {/* Left spotlight beam */}
        <div className='flex-1 h-px bg-gradient-to-r from-transparent via-kolping-500/50 to-kolping-500/80' />
        
        {/* Year badge */}
        <div className='relative'>
          <div className='absolute -inset-3 bg-kolping-500/20 blur-xl rounded-full' />
          <div className='relative px-6 py-2 rounded-full bg-site-800 border border-kolping-500/40 backdrop-blur-sm'>
            <span className='font-display text-2xl sm:text-3xl font-black text-kolping-400 tracking-tight drop-shadow-[0_0_10px_rgba(255,122,0,0.4)]'>
              {year}
            </span>
          </div>
        </div>
        
        {/* Right spotlight beam */}
        <div className='flex-1 h-px bg-gradient-to-l from-transparent via-kolping-500/50 to-kolping-500/80' />
      </div>
    </div>
  )
}

// Production timeline card (with vertical banner image)
function ProductionCard({ 
  entry, 
  index 
}: { 
  entry: TimelineEntry
  index: number 
}) {
  const hasGallery = !!entry.galleryHash
  
  const cardContent = (
    <div 
      className='group relative'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card container */}
      <div className='
        relative poster-frame border-epic bg-site-800 
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in-up
      '>
        {/* Theatrical spotlight glow on hover */}
        <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/15 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />
        
        <div className='relative flex flex-col sm:flex-row overflow-hidden'>
          {/* Image section - optimized for vertical banners */}
          <div 
            className='relative w-full sm:w-44 md:w-52 lg:w-60 aspect-[2/3] sm:aspect-auto sm:self-stretch overflow-hidden bg-site-900 shrink-0' 
            style={{ backgroundColor: entry.dominantColor }}
          >
            {/* Animated spotlight beam */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/20 via-transparent to-transparent' />
            </div>
            
            <Image
              src={`/img/${entry.image}`}
              alt={entry.header}
              fill
              className='object-contain transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110'
            />
            
            {/* Gradient overlays */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-site-800/90 sm:block hidden z-10' />
            <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-site-800 via-site-800/60 to-transparent sm:hidden z-10' />
            
            {/* Year badge on mobile - positioned on the image */}
            <div className='absolute top-3 right-3 z-20 sm:hidden'>
              <div className='px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-kolping-500/40'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-kolping-400 font-mono'>{entry.date}</span>
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div className='relative flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center space-y-4'>
            {/* Date badge - hidden on mobile, shown on sm+ */}
            <div className='hidden sm:flex items-center gap-3'>
              <div className='px-3 py-1 rounded-full bg-kolping-500/20 border border-kolping-500/30'>
                <span className='text-xs font-bold uppercase tracking-wider text-kolping-400 font-mono'>{entry.date}</span>
              </div>
              {hasGallery && (
                <div className='px-2.5 py-1 rounded-full bg-site-700/50'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-site-100'>Galerie</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className='font-display font-bold text-xl sm:text-2xl text-site-50 group-hover:text-kolping-400 transition-colors duration-300'>
                {entry.header}
              </h3>
              <div className='w-12 h-0.5 bg-kolping-500 rounded-full mt-2 transition-all duration-500 group-hover:w-20' />
            </div>
            
            <p className='text-sm sm:text-base text-site-100 leading-relaxed line-clamp-4 sm:line-clamp-3'>
              {entry.text}
            </p>
            
            {hasGallery && (
              <div className='flex items-center gap-2 pt-2'>
                <span className='text-sm font-semibold text-kolping-400 group-hover:text-kolping-500 transition-colors'>
                  Galerie ansehen
                </span>
                <svg 
                  className='w-5 h-5 text-kolping-400 transition-transform duration-300 group-hover:translate-x-2' 
                  fill='none' 
                  viewBox='0 0 24 24' 
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom accent bar */}
        <div className='absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>
    </div>
  )
  
  if (hasGallery) {
    return (
      <Link href={`/gallery/${entry.galleryHash}`} className='block'>
        {cardContent}
      </Link>
    )
  }
  
  return cardContent
}

// Event timeline card (without image)
function EventCard({ 
  entry, 
  index 
}: { 
  entry: TimelineEntry
  index: number 
}) {
  return (
    <div 
      className='group relative animate-fade-in-up'
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Timeline dot */}
      <div className='absolute -left-[39px] sm:-left-[47px] top-6 z-10'>
        <div className='relative'>
          <div className='absolute -inset-1 bg-kolping-500/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity' />
          <div className='relative w-4 h-4 rounded-full bg-kolping-500 border-4 border-site-900 group-hover:scale-125 transition-transform' />
        </div>
      </div>
      
      {/* Content card */}
      <div className='glass rounded-xl p-5 sm:p-6 space-y-3 transition-all duration-300 hover:border-kolping-500/30 hover:bg-site-800/80'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
          <div className='px-3 py-1 rounded-full bg-kolping-500/15 border border-kolping-500/25 w-fit'>
            <time className='text-xs font-bold text-kolping-400 uppercase tracking-wider font-mono'>
              {entry.date}
            </time>
          </div>
          <h3 className='font-display text-lg sm:text-xl font-bold text-site-50 group-hover:text-kolping-400 transition-colors'>
            {entry.header}
          </h3>
        </div>
        
        <p className='text-sm sm:text-base text-site-100 leading-relaxed pl-0 sm:pl-0'>
          {entry.text}
        </p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const entries = (timeline as unknown as TimelineEntry[]).slice().reverse()
  
  return (
    <div className='space-y-8 sm:space-y-12 md:space-y-16'>
      {/* Epic Hero Section */}
      <section className='relative -mt-8 pt-8 pb-8 sm:pb-12 overflow-hidden'>
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
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
          </div>
          
          <h1 className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight'>
            <span className='text-kolping-400 drop-shadow-[0_0_30px_rgba(255,122,0,0.4)]'>Unsere</span>{' '}
            <span className='text-site-50'>Geschichte</span>
          </h1>
          
          <p className='text-site-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Von einer spontanen Idee zur festen Institution – 
            <span className='text-kolping-400'> über 10 Jahre Theater</span> unter freiem Himmel 
            in Ramsen.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className='relative'>
        <div className='glass rounded-xl p-6 sm:p-8 md:p-10 space-y-6 border-epic'>
          <div className='flex items-start gap-4'>
            <div className='hidden sm:block p-3 rounded-xl bg-kolping-500/10 border border-kolping-500/20'>
              <svg className='w-8 h-8 text-kolping-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
              </svg>
            </div>
            <div className='prose prose-invert max-w-none prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed'>
              <p className='text-site-50 !mt-0'>
                Wir sind das <strong className='text-kolping-400'>Kolping-Open-Air-Theater Ramsen</strong>. 
                Seit 2014 entwickeln wir eigene Stücke und bringen sie jeden Sommer auf der Kolpingwiese zur Premiere. 
                Der Eintritt ist frei – <em>Theater für alle</em>.
              </p>
            </div>
          </div>
          
          <div className='flex flex-wrap items-center gap-4 pt-2'>
            <div className='flex items-center gap-3 text-sm sm:text-base text-site-100'>
              <div className='p-2 rounded-lg bg-site-700/50'>
                <svg 
                  xmlns='http://www.w3.org/2000/svg' 
                  viewBox='0 0 24 24' 
                  fill='currentColor' 
                  className='w-5 h-5 text-kolping-400'
                >
                  <path fillRule='evenodd' d='m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' clipRule='evenodd' />
                </svg>
              </div>
              <span>Klosterhof 7, 67305 Ramsen</span>
            </div>
            
            <div className='flex items-center gap-3 text-sm sm:text-base text-site-100'>
              <div className='p-2 rounded-lg bg-site-700/50'>
                <svg 
                  xmlns='http://www.w3.org/2000/svg' 
                  viewBox='0 0 24 24' 
                  fill='currentColor' 
                  className='w-5 h-5 text-kolping-400'
                >
                  <path d='M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z' />
                  <path fillRule='evenodd' d='M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z' clipRule='evenodd' />
                </svg>
              </div>
              <span>Jeden Sommer Open-Air</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className='space-y-4' aria-labelledby='timeline-heading'>
        <SectionDivider 
          title="Chronik" 
          subtitle="Eine Reise durch unsere Theatergeschichte"
        />
        
        <div className='relative pl-8 sm:pl-10'>
          {/* Timeline line */}
          <div className='absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-kolping-500/80 via-site-700 to-site-700' />
          
          <div className='space-y-6 sm:space-y-8'>
            {entries.map((entry, i) => {
              const currentYear = entry.date.split(' ')[1]
              const previousYear = i > 0 ? entries[i - 1].date.split(' ')[1] : null
              const isNewYear = currentYear !== previousYear
              const isProduction = !!entry.image

              return (
                <div key={i}>
                  {isNewYear && (
                    <YearSeparator year={currentYear} />
                  )}
                  
                  {isProduction ? (
                    <ProductionCard entry={entry} index={i} />
                  ) : (
                    <EventCard entry={entry} index={i} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='relative'>
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-kolping-500/5 to-transparent blur-3xl' />
        </div>
        
        <div className='relative grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
          {[
            { value: '10+', label: 'Jahre Theater', icon: '🎭' },
            { value: '15+', label: 'Produktionen', icon: '📽️' },
            { value: '1000+', label: 'Zuschauer/Jahr', icon: '👥' },
            { value: '1', label: 'Jugendpreis', icon: '🏆' },
          ].map((stat, i) => (
            <div 
              key={i}
              className='glass rounded-xl p-5 sm:p-6 text-center space-y-2 hover:border-kolping-500/30 transition-colors animate-fade-in-up'
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className='text-2xl sm:text-3xl'>{stat.icon}</div>
              <div className='font-display text-2xl sm:text-3xl md:text-4xl font-black text-kolping-400'>
                {stat.value}
              </div>
              <div className='text-xs sm:text-sm text-site-100 font-medium'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
