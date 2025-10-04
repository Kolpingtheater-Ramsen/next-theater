import Image from 'next/image'

type Item = {
  title: string
  image: string
  href: string
  tag?: string
}

export default function FeaturedProductions({ items }: { items: Item[] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {items.map((item, idx) => (
        <a key={idx} href={item.href} className='group block tilt'>
          <div className='poster-frame border border-site-700 bg-site-900 overflow-hidden'>
            <div className='relative aspect-[4/5] w-full'>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                className='object-cover transition-transform duration-500 group-hover:scale-[1.04] w-full h-full'
              />
              {item.tag ? (
                <span className='absolute left-2 top-2 z-10 rounded bg-kolping-400 px-2 py-[2px] text-[11px] font-bold uppercase text-black'>
                  {item.tag}
                </span>
              ) : null}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-3'>
                <h3 className='font-display text-lg font-extrabold tracking-tight text-site-50'>
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

