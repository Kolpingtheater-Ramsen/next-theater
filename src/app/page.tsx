import Hero from '@/components/Hero'
import CountdownTimer from '@/components/CountdownTimer'
import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'

export default function Home() {
  return (
    <div className='page-container'>
      <Hero
        variant='poster'
        imageSrc='/img/banners/anno.jpg'
        title='Anno 1146'
        tagline='Kolping-Open-Air-Theater Ramsen'
        subtitle='Danke für euren Besuch! Bleibt gespannt – 2025 und 2026 erwarten euch neue Produktionen und besondere Highlights.'
      />

      <section className='page-section'>
        <div className='countdown-marquee-section'>
          <div className='order-1 md:order-2'>
            <CountdownTimer targetDate='2025-08-23T20:00:00+02:00' title='Nächste Premiere startet in' />
          </div>
          <div className='order-2 md:order-1'>
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
          </div>
        </div>
      </section>

      <section className='page-section' aria-labelledby='productions-heading'>
        <h2 id='productions-heading' className='section-heading'>
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

      <section className='page-section' aria-labelledby='join-heading'>
        <div className='cta-card glass'>
          <div className='cta-content'>
            <h3 id='join-heading' className='cta-heading'>
              Werde Teil der Bühne
            </h3>
            <p className='cta-text'>
              Ob Schauspiel, Technik oder Organisation – bei uns ist Platz für alle, die Theater lieben.
            </p>
          </div>
          <div className='cta-buttons'>
            <a
              href='https://www.instagram.com/kolpingjugend_ramsen/'
              target='_blank'
              rel='noopener noreferrer'
              className='cta-button'
              aria-label='Besuche uns auf Instagram'
            >
              Instagram
            </a>
            <a href='/about' className='cta-button'>
              Über uns
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
