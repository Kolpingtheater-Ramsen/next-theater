import Image from 'next/image'

type HeroProps = {
  title: string
  subtitle?: string
  tagline?: string
  imageSrc: string
  variant?: 'poster' | 'wide'
}

export default function Hero({ title, subtitle, tagline, imageSrc, variant = 'poster' }: HeroProps) {
  return (
    <section className='relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
      {/* Background blur effect */}
      <div className='absolute inset-0 -z-10'>
        <div className='relative w-full h-full'>
          <Image
            src={imageSrc}
            alt=''
            aria-hidden
            fill
            priority
            sizes='(max-width: 768px) 100vw, 1152px'
            className='opacity-60 blur-2xl scale-110'
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {variant === 'poster' ? (
        <div className='relative grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr] gap-0'>
          {/* Poster Image Section */}
          <div className='relative poster-frame md:rounded-none md:rounded-l-xl overflow-hidden'>
            <div className='relative w-full aspect-[1968/2756] md:aspect-[3/4]'>
              <Image
                src={imageSrc}
                alt={title}
                fill
                priority
                sizes='(max-width: 768px) 100vw, 360px'
                className='animate-kenburns'
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className='relative p-4 sm:p-6 md:p-10 flex items-end min-h-[300px] md:min-h-[400px]'>
            <div className='absolute inset-0 spotlight pointer-events-none' />
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0 md:bg-gradient-to-l md:from-black/85 md:via-black/50 md:to-transparent' />
            <div className='relative z-10 max-w-2xl'>
              {tagline && (
                <div className='mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-kolping-400 text-shadow uppercase'>
                  {tagline}
                </div>
              )}
              <h1 className='font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-shadow-lg'>
                {title}
              </h1>
              {subtitle && (
                <p className='mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-site-50 text-shadow max-w-xl'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='relative w-full aspect-[21/9] md:aspect-[16/5] lg:aspect-[21/6]'>
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            sizes='(max-width: 768px) 100vw, 1152px'
            className='md:object-contain animate-kenburns'
            style={{ objectFit: 'cover' }}
          />
          <div className='spotlight pointer-events-none' />
          <div className='curtain-left hidden sm:block pointer-events-none' />
          <div className='curtain-right hidden sm:block pointer-events-none' />
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0' />
          <div className='absolute bottom-0 left-0 right-0 p-6 md:p-10'>
            <div className='max-w-4xl'>
              {tagline && (
                <div className='mb-1 text-sm font-semibold tracking-widest text-kolping-400 text-shadow uppercase'>
                  {tagline}
                </div>
              )}
              <h1 className='font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-shadow-lg'>
                {title}
              </h1>
              {subtitle && (
                <p className='mt-2 max-w-2xl text-base md:text-lg text-site-50 text-shadow'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
