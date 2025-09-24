import Hero from '@/components/Hero'
import CountdownTimer from '@/components/CountdownTimer'
import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'

export default function Home() {
  return (
    <div className='space-y-12'>
      <Hero
        variant='poster'
        imageSrc='/img/banners/anno.jpg'
        title='Anno 1146'
        tagline='Kolping-Open-Air-Theater Ramsen'
        subtitle='Danke für euren Besuch! Bleibt gespannt – 2025 und 2026 erwarten euch neue Produktionen und besondere Highlights.'
      />

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
        <FeaturedProductions
          items={[
            { title: 'Anno 1146', image: '/img/banners/anno.jpg', href: '/gallery/anno', tag: 'Neu' },
            { title: 'Nexus', image: '/img/banners/nexus.jpg', href: '/gallery/nexus' },
            { title: 'Traum von Freiheit', image: '/img/banners/freiheit.jpg', href: '/gallery/freiheit' },
            { title: 'Dystopia', image: '/img/banners/dystopia.jpg', href: '/gallery/dystopia' },
            { title: 'Der Kristall der Träume', image: '/img/banners/kristall.jpg', href: '/gallery/kristall' },
            { title: 'Goldfieber', image: '/img/banners/goldfieber.jpg', href: '/gallery/goldfieber' },
          ]}
        />
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
