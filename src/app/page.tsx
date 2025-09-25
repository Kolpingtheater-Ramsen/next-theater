/** @jsxImportSource react */
import Image from 'next/image'
import CountdownTimer from '@/components/CountdownTimer'
import Marquee from '@/components/Marquee'

export default function Home() {
  return (
    <div className='home space-y-12'>
      {/* Simplified Hero with scoped media containers */}
      <section className='relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-site-700 bg-site-900 border-epic grain vignette'>
        <div className='absolute inset-0 -z-10'>
          <Image
            src='/img/banners/anno.jpg'
            alt=''
            aria-hidden
            fill
            priority
            className='object-cover opacity-60 blur-2xl'
            sizes='100vw'
          />
        </div>

        <div className='relative grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr] gap-0'>
          <div className='relative poster-frame md:rounded-none md:rounded-l-xl md:overflow-hidden'>
            <div className='media aspect-[3/4]'>
              <Image
                src='/img/banners/anno.jpg'
                alt='Anno 1146'
                fill
                priority
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 360px'
              />
            </div>
          </div>
          <div className='relative p-6 md:p-10 flex items-end'>
            <div className='absolute inset-0 spotlight' />
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0 md:bg-gradient-to-l md:from-black/85 md:via-black/50 md:to-transparent' />
            <div className='relative z-10 max-w-2xl'>
              <div className='mb-2 text-xs md:text-sm font-semibold tracking-[0.2em] text-kolping-400 text-shadow uppercase'>
                Kolping-Open-Air-Theater Ramsen
              </div>
              <h1 className='font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-shadow-lg'>
                Anno 1146
              </h1>
              <p className='mt-3 text-base md:text-lg text-site-50 text-shadow max-w-xl'>
                Danke für euren Besuch! Bleibt gespannt – 2025 und 2026 erwarten euch neue Produktionen und besondere Highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-4'>
        <Marquee
          items={[
            { date: '2017', title: 'Verrat im Kloster' },
            { date: '2018', title: 'Bluttribut' },
            { date: '2019', title: 'Dystopia' },
            { date: '2020', title: 'Der Kristall der Träume' },
            { date: '2021', title: 'Malleus Maleficarum' },
            { date: '2022', title: 'Goldfieber' },
            { date: '2023', title: 'Traum von Freiheit' },
            { date: '2024', title: 'Nexus' },
            { date: '2024', title: 'Eine höllische Herausforderung' },
            { date: '2025', title: 'Anno 1146' },
          ]}
        />
        <div className='grid gap-4'>
          <CountdownTimer targetDate='2025-08-23T20:00:00+02:00' title='Nächste Premiere startet in' />
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-4'>
        <h2 className='font-display text-2xl md:text-3xl font-extrabold tracking-tight'>
          Produktionen
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[
            { title: 'Anno 1146', image: '/img/banners/anno.jpg', href: '/gallery/anno', tag: 'Neu' },
            { title: 'Nexus', image: '/img/banners/nexus.jpg', href: '/gallery/nexus' },
            { title: 'Traum von Freiheit', image: '/img/banners/freiheit.jpg', href: '/gallery/freiheit' },
            { title: 'Dystopia', image: '/img/banners/dystopia.jpg', href: '/gallery/dystopia' },
            { title: 'Der Kristall der Träume', image: '/img/banners/kristall.jpg', href: '/gallery/kristall' },
            { title: 'Goldfieber', image: '/img/banners/goldfieber.jpg', href: '/gallery/goldfieber' },
          ].map((item, idx) => (
            <a key={idx} href={item.href} className='group block tilt'>
              <div className='poster-frame border border-site-700 bg-site-900 overflow-hidden'>
                <div className='media aspect-[4/5]'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
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
      </section>

      <section className='mx-auto max-w-6xl'>
        <div className='glass rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6'>
          <div className='flex-1'>
            <h3 className='font-display text-xl md:text-2xl font-extrabold tracking-tight'>
              Werde Teil der Bühne
            </h3>
            <p className='text-site-100 mt-1'>
              Ob Schauspiel, Technik oder Organisation – bei uns ist Platz für alle, die Theater lieben.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <a
              href='https://www.instagram.com/kolpingjugend_ramsen/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800'
            >
              Instagram
            </a>
            <a
              href='/about'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800'
            >
              Über uns
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
