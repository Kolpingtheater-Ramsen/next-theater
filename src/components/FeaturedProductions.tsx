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
      {/* Hero card - featured production, larger */}
      {hero && (
        <a
          href={hero.href}
          className='group relative block overflow-hidden rounded-xl border border-site-700 tilt'
          aria-label={`Zur Galerie von ${hero.title}`}
        >
          <div className='relative aspect-[21/9] sm:aspect-[2.4/1] w-full'>
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              sizes='(max-width: 1024px) 100vw, 1152px'
              className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
            />
            {/* Color wash overlay from dominant color */}
            <div
              className='absolute inset-0 opacity-20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-10'
              style={{ backgroundColor: hero.dominantColor }}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-r from-black/40 to-transparent' />

            {/* Tags */}
            <div className='absolute left-4 sm:left-6 top-4 sm:top-6 z-10 flex items-center gap-2'>
              {hero.tag && (
                <span className='rounded-full bg-kolping-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white'>
                  {hero.tag}
                </span>
              )}
              {hero.year && (
                <span className='rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/80'>
                  {hero.year}
                </span>
              )}
              {hero.location && (
                <span className='rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white/80'>
                  {hero.location === 'Open-Air-Bühne' ? 'Open-Air' : 'Kreativ'}
                </span>
              )}
            </div>

            {/* Title */}
            <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6'>
              <h3 className='font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white transition-colors group-hover:text-kolping-400'>
                {hero.title}
              </h3>
            </div>
          </div>
        </a>
      )}

      {/* Grid - remaining productions */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {rest.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className='group block tilt'
            aria-label={`Zur Galerie von ${item.title}`}
          >
            <div className='relative overflow-hidden rounded-xl border border-site-700 bg-site-900'>
              <div className='relative aspect-[4/5] w-full'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                />
                <div
                  className='absolute inset-0 opacity-15 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-5'
                  style={{ backgroundColor: item.dominantColor }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90' />

                {/* Tags */}
                <div className='absolute left-3 top-3 z-10 flex items-center gap-1.5'>
                  {item.tag && (
                    <span className='rounded-full bg-kolping-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                      {item.tag}
                    </span>
                  )}
                  {item.year && (
                    <span className='rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80'>
                      {item.year}
                    </span>
                  )}
                  {item.location && (
                    <span className='rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80'>
                      {item.location === 'Open-Air-Bühne' ? 'Open-Air' : 'Kreativ'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className='absolute bottom-0 left-0 right-0 p-3 sm:p-4'>
                  <h3 className='font-display text-lg sm:text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-kolping-400'>
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
