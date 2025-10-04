import Image from 'next/image'

type Item = {
  title: string
  image: string
  href: string
  tag?: string
}

export default function FeaturedProductions({ items }: { items: Item[] }) {
  return (
    <div className='productions-grid'>
      {items.map((item, idx) => (
        <a 
          key={idx} 
          href={item.href} 
          className='production-card group' 
          aria-label={`Zur Galerie von ${item.title}`}
        >
          <div className='production-card-inner'>
            <div className='production-image'>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px'
                style={{ objectFit: 'cover' }}
              />
            </div>
            {item.tag && (
              <span className='production-tag'>{item.tag}</span>
            )}
            <div className='production-overlay' />
            <div className='production-title-wrapper'>
              <h3 className='production-title'>{item.title}</h3>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
