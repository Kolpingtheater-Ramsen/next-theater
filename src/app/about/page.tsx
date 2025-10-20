import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/Hero'
import timeline from '@/data/timeline.json'

type TimelineEntry = {
  date: string
  header: string
  text: string
  image?: string
  galleryHash?: string
  newYear?: boolean
}

export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <div className='space-y-8 sm:space-y-10 md:space-y-12'>
      {/* Hero Section */}
      <Hero
        variant='wide'
        imageSrc='/img/other_images/Gruppenbild.jpg'
        title='Über uns'
        tagline='Kolping-Open-Air-Theater Ramsen'
        subtitle='Leidenschaft für Theater unter freiem Himmel seit 2014'
      />

      {/* Introduction Section */}
      <section className='glass rounded-xl p-6 sm:p-8 md:p-10 space-y-4'>
        <div className='prose prose-invert max-w-none prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed'>
          <p className='text-site-50'>
            Wir sind das Kolping-Open-Air-Theater Ramsen. Seit 2014 entwickeln wir
            eigene Stücke und bringen sie jeden Sommer auf der Kolpingwiese zur
            Premiere. Der Eintritt ist frei – Theater für alle.
          </p>
          <div className='flex items-center gap-3 mt-6 text-sm sm:text-base text-site-100'>
            <svg 
              xmlns='http://www.w3.org/2000/svg' 
              viewBox='0 0 24 24' 
              fill='currentColor' 
              className='w-5 h-5 text-kolping-400 flex-shrink-0'
            >
              <path fillRule='evenodd' d='m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' clipRule='evenodd' />
            </svg>
            <span>Spielort: Klosterhof 7, 67305 Ramsen</span>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className='space-y-6' aria-labelledby='timeline-heading'>
        <div className='flex items-center gap-4'>
          <h2 id='timeline-heading' className='font-display text-2xl md:text-3xl font-extrabold tracking-tight'>
            Chronik
          </h2>
          <div className='flex-1 h-px bg-gradient-to-r from-site-700 to-transparent' />
        </div>
        
        <ol className='relative space-y-6 sm:space-y-8 border-l-2 border-site-700 pl-6 sm:pl-8 ml-2'>
          {(timeline as unknown as TimelineEntry[])
            .slice()
            .reverse()
            .map((t, i, arr) => {
              const currentYear = t.date.split(' ')[1]
              const previousYear = i > 0 ? arr[i - 1].date.split(' ')[1] : null
              const isNewYear = currentYear !== previousYear

              return (
                <div key={i}>
                  {isNewYear && (
                    <div className='flex items-center gap-4 mb-8 mt-4 -ml-6 sm:-ml-8'>
                      <div className='h-px flex-1 bg-gradient-to-r from-transparent via-kolping-400/30 to-transparent' />
                      <div className='text-center px-4'>
                        <span className='inline-block text-2xl font-bold text-kolping-400 font-display tracking-tight'>
                          {currentYear}
                        </span>
                      </div>
                      <div className='h-px flex-1 bg-gradient-to-r from-transparent via-kolping-400/30 to-transparent' />
                    </div>
                  )}
                  
                  <li className='relative group'>
                    {/* Timeline dot */}
                    <div className='absolute -left-[27px] sm:-left-[35px] top-1 w-4 h-4 rounded-full bg-kolping-400 border-4 border-site-900 group-hover:scale-125 transition-transform' />
                    
                    {/* Content card */}
                    <div className='glass rounded-lg p-4 sm:p-6 space-y-3 hover:border-kolping-400/30 transition-colors'>
                      <div className='flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4'>
                        <time className='text-xs sm:text-sm font-bold text-kolping-400 whitespace-nowrap uppercase tracking-wider'>
                          {t.date}
                        </time>
                        <h3 className='font-display text-lg sm:text-xl font-bold text-site-50'>
                          {t.header}
                        </h3>
                      </div>
                      
                      {t.image && (
                        <Link href={t.galleryHash ? `/gallery/${t.galleryHash}` : '#'} className={t.galleryHash ? 'block group/image' : ''}>
                          <div className='relative aspect-[16/9] rounded-lg overflow-hidden border border-site-700 bg-black poster-frame'>
                            <Image
                              src={`/img/${t.image}`}
                              alt={t.header}
                              fill
                              className={`${t.galleryHash ? 'group-hover/image:scale-105' : ''} object-contain transition-transform duration-500`}
                            />
                          </div>
                        </Link>
                      )}
                      
                      <p className='text-sm sm:text-base text-site-100 leading-relaxed'>
                        {t.text}
                      </p>
                      
                      {t.galleryHash && (
                        <Link
                          href={`/gallery/${t.galleryHash}`}
                          className='inline-flex items-center gap-2 text-sm font-semibold text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded transition-colors group/link'
                        >
                          <span>Galerie ansehen</span>
                          <svg 
                            xmlns='http://www.w3.org/2000/svg' 
                            viewBox='0 0 20 20' 
                            fill='currentColor' 
                            className='w-4 h-4 group-hover/link:translate-x-1 transition-transform'
                          >
                            <path fillRule='evenodd' d='M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z' clipRule='evenodd' />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </li>
                </div>
              )
            })}
        </ol>
      </section>
    </div>
  )
}
