import Image from 'next/image'

type HeroProps = {
  title: string
  subtitle?: string
  tagline?: string
  imageSrc: string
}

export default function Hero({ title, subtitle, tagline, imageSrc }: HeroProps) {
  return (
    <section className='relative mx-auto w-full max-w-5xl md:max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
      <div className='absolute inset-0 -z-10'>
        <Image
          src={imageSrc}
          alt=''
          aria-hidden
          fill
          priority
          className='object-cover opacity-60 blur-2xl scale-110'
        />
      </div>

      <div className='relative aspect-[21/9] md:aspect-[16/5] lg:aspect-[21/6]'>
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className='object-cover md:object-contain animate-kenburns'
        />

        <div className='spotlight' />
        <div className='curtain-left hidden sm:block' />
        <div className='curtain-right hidden sm:block' />

        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0' />

        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-10'>
          <div className='max-w-4xl'>
            {tagline ? (
              <div className='mb-1 text-sm font-semibold tracking-widest text-kolping-400 text-shadow uppercase'>
                {tagline}
              </div>
            ) : null}
            <h1 className='font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-shadow-lg'>
              {title}
            </h1>
            {subtitle ? (
              <p className='mt-2 max-w-2xl text-base md:text-lg text-site-50 text-shadow'>
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

