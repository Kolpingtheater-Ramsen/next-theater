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
      <section className='hero-section'>
        <div className='hero-wide'>
          <div className='hero-image-wrapper'>
            <Image
              src={imageSrc}
              alt={title}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 1152px'
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className='hero-overlay' />
          <div className='hero-content hero-content-bottom'>
            {tagline && <div className='hero-tagline'>{tagline}</div>}
            <h1 className='hero-title'>{title}</h1>
            {subtitle && <p className='hero-subtitle'>{subtitle}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='hero-section'>
      <div className='hero-poster'>
        <div className='hero-background'>
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
        
        <div className='hero-poster-layout'>
          <div className='hero-poster-image'>
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
          
          <div className='hero-poster-content'>
            <div className='spotlight' />
            <div className='hero-poster-gradient' />
            <div className='hero-content-wrapper'>
              {tagline && <div className='hero-tagline'>{tagline}</div>}
              <h1 className='hero-title'>{title}</h1>
              {subtitle && <p className='hero-subtitle'>{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
