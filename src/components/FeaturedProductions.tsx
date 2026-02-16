import Image from 'next/image'

type Item = {
  title: string
  image: string
  href: string
  tag?: string
  year?: number
  location?: string | null
  dominantColor?: string
}

export default function FeaturedProductions({ items }: { items: Item[] }) {
  const [hero, ...rest] = items

  return (
    <div className='space-y-4'>
      {/* Hero card - featured production with poster + info side-by-side on desktop */}
      {hero && (
        <a
          href={hero.href}
          className='group relative block overflow-hidden rounded-xl border border-site-700 bg-site-900 tilt'
          aria-label={`Zur Galerie von ${hero.title}`}
        >
          <div className='flex flex-col sm:flex-row'>
            {/* Poster image */}
            <div className='relative w-full sm:w-2/5 lg:w-1/3 aspect-[3/4] sm:aspect-auto sm:min-h-[320px] md:min-h-[380px] flex-shrink-0'>
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                sizes='(max-width: 640px) 100vw, 400px'
                className='object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]'
              />
              <div
                className='absolute inset-0 opacity-15 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-5'
                style={{ backgroundColor: hero.dominantColor }}
              />
              {/* Gradient fade into info area - bottom on mobile, right on desktop */}
              <div className='absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent via-transparent to-site-900/80 sm:to-site-900' />
            </div>

            {/* Info area */}
            <div className='relative flex-1 flex flex-col justify-center p-5 sm:p-8 md:p-10 -mt-12 sm:mt-0'>
              {/* Tags */}
              <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                {hero.tag && (
                  <span className='rounded-full bg-kolping-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white'>
                    {hero.tag}
                  </span>
                )}
                {hero.year && (
                  <span className='rounded-full bg-site-700/80 px-2.5 py-1 text-[11px] font-medium text-site-100'>
                    {hero.year}
                  </span>
                )}
                {hero.location && (
                  <span className='rounded-full bg-site-700/80 px-2.5 py-1 text-[11px] font-medium text-site-100'>
                    {hero.location === 'Open-Air-Bühne' ? 'Open-Air' : 'Kreativ'}
                  </span>
                )}
              </div>

              <h3 className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-site-50 transition-colors group-hover:text-kolping-400'>
                {hero.title}
              </h3>

              <div className='mt-4 sm:mt-6 inline-flex items-center gap-2 text-sm text-site-100 group-hover:text-kolping-400 transition-colors'>
                Galerie ansehen
                <svg className='w-4 h-4 transition-transform group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </div>
            </div>
          </div>
        </a>
      )}

      {/* Grid - remaining productions as poster cards */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4'>
        {rest.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className='group block tilt'
            aria-label={`Zur Galerie von ${item.title}`}
          >
            <div className='relative overflow-hidden rounded-xl border border-site-700 bg-site-900'>
              <div className='relative aspect-[3/4] w-full'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
                  className='object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]'
                />
                <div
                  className='absolute inset-0 opacity-15 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-5'
                  style={{ backgroundColor: item.dominantColor }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300' />

                {/* Tags */}
                <div className='absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1'>
                  {item.tag && (
                    <span className='rounded-full bg-kolping-400 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white'>
                      {item.tag}
                    </span>
                  )}
                  {item.year && (
                    <span className='rounded-full bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-white/80'>
                      {item.year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className='absolute bottom-0 left-0 right-0 p-2.5 sm:p-3'>
                  <h3 className='font-display text-sm sm:text-base lg:text-lg font-extrabold tracking-tight text-white transition-colors group-hover:text-kolping-400 leading-tight text-shadow'>
                    {item.title}
                  </h3>
                  {item.location && (
                    <span className='mt-1 block text-[10px] sm:text-[11px] text-white/60'>
                      {item.location === 'Open-Air-Bühne' ? 'Open-Air' : 'Kreativbühne'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
