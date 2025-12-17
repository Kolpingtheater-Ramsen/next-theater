import Image from 'next/image'

type Item = {
  title: string
  image: string
  href: string
  tag?: string
  year?: number
  location?: string | null
}

export default function FeaturedProductions({ items }: { items: Item[] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {items.map((item, idx) => (
        <a key={idx} href={item.href} className='group block tilt' aria-label={`Zur Galerie von ${item.title}`}>
          <div className='poster-frame border border-site-700 bg-site-900 overflow-hidden'>
            <div className='relative aspect-[4/5] w-full'>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                className='object-cover transition-transform duration-500 group-hover:scale-[1.04] w-full h-full'
              />
              <div className='absolute left-2 top-2 z-10 flex items-center gap-1.5'>
                {item.tag ? (
                  <span className='rounded bg-kolping-400 px-2 py-[2px] text-[11px] font-bold uppercase text-white'>
                    {item.tag}
                  </span>
                ) : null}
                {item.year ? (
                  <span className='rounded bg-black/60 backdrop-blur-sm px-1.5 py-[2px] text-[10px] font-medium text-site-100'>
                    {item.year}
                  </span>
                ) : null}
                {item.location ? (
                  <span className='rounded bg-black/60 backdrop-blur-sm px-1.5 py-[2px] text-[10px] font-medium text-site-100'>
                    {item.location === 'Open-Air-Bühne' ? 'Open-Air' : 'Kreativ'}
                  </span>
                ) : null}
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90' />
              <div className='absolute bottom-0 left-0 right-0 p-3'>
                <h3 className='font-display text-lg font-extrabold tracking-tight text-site-50 transition-colors group-hover:text-kolping-400'>
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

