import Image from 'next/image'

type HeroProps = {
  title: string
  subtitle?: string
  tagline?: string
  imageSrc: string
  variant?: 'poster' | 'wide'
}

export default function Hero({ title, subtitle, tagline, imageSrc, variant = 'poster' }: HeroProps) {
  if (variant === 'wide') {
    return (
      <section className='relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
        <div className='relative w-full' style={{ paddingBottom: '42.86%' }}>
          <div className='absolute inset-0'>
            <Image
              src={imageSrc}
              alt={title}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 1152px'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0' />
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
      </section>
    )
  }

  return (
    <section className='relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
      <div className='relative w-full'>
        <div className='absolute inset-0 -z-10 opacity-60 blur-2xl'>
          <Image
            src={imageSrc}
            alt=''
            aria-hidden
            fill
            priority
            sizes='(max-width: 768px) 100vw, 1152px'
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div className='flex flex-col md:flex-row gap-0'>
          {/* Poster image */}
          <div className='flex-shrink-0 w-full md:w-[300px] lg:w-[360px]'>
            <div className='relative w-full' style={{ paddingBottom: '140%' }}>
              <div className='absolute inset-0 poster-frame md:rounded-l-xl overflow-hidden'>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  priority
                  sizes='(max-width: 768px) 100vw, 360px'
                  style={{ objectFit: 'cover' }}
                  className='animate-kenburns'
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className='relative flex-1 p-6 sm:p-8 md:p-10 flex items-end' style={{ minHeight: '400px' }}>
            <div className='absolute inset-0 spotlight pointer-events-none' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0 md:bg-gradient-to-l md:from-black/85 md:via-black/50 md:to-transparent pointer-events-none' />
            <div className='relative z-10 max-w-2xl'>
              {tagline && (
                <div className='mb-2 text-xs md:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-kolping-400 text-shadow uppercase'>
                  {tagline}
                </div>
              )}
              <h1 className='font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-shadow-lg'>
                {title}
              </h1>
              {subtitle && (
                <p className='mt-3 text-sm sm:text-base md:text-lg text-site-50 text-shadow max-w-xl'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
