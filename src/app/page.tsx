import CountdownTimer from '@/components/CountdownTimer'
import Marquee from '@/components/Marquee'
import FeaturedProductions from '@/components/FeaturedProductions'
import PrivacyVideo from '@/components/PrivacyVideo'

export default function Home() {
  return (
    <div className='space-y-8 sm:space-y-10 md:space-y-12'>
      <PrivacyVideo
        videoId='7Xzys_0LkpE'
        posterSrc='/img/banners/anno.jpg'
        title='Anno 1146'
        tagline='2025 - Unsere aktuelle Produktion'
        subtitle='Erlebe die faszinierenden Momente unserer Theaterproduktion. Ein Blick hinter die Kulissen und die Höhepunkte von Anno 1146 – live auf der Kreativbühne des Kolpingtheaters Ramsen.'
      />

      <section className='mx-auto max-w-6xl'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          <div className='order-1 md:order-2'>
            <div className='grid gap-3 sm:gap-4'>
              <CountdownTimer targetDate='2025-08-23T20:00:00+02:00' title='Nächste Premiere startet in' />
            </div>
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
                { date: '2023', title: 'Sagenhafft' },
                { date: '2024', title: 'Nexus' },
                { date: '2024', title: 'Eine höllische Herausforderung' },
                { date: '2025', title: 'Anno 1146' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl space-y-4' aria-labelledby='productions-heading'>
        <h2 id='productions-heading' className='font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight'>
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

      <section className='mx-auto max-w-6xl' aria-labelledby='join-heading'>
        <div className='glass rounded-xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6'>
          <div className='flex-1 text-center md:text-left'>
            <h3 id='join-heading' className='font-display text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight'>
              Werde Teil der Bühne
            </h3>
            <p className='text-site-100 mt-1 text-sm sm:text-base'>
              Ob Schauspiel, Technik oder Organisation – bei uns ist Platz für alle, die Theater lieben.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <a
              href='https://www.instagram.com/kolpingjugend_ramsen/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800 transition-colors'
              aria-label='Besuche uns auf Instagram'
            >
              Instagram
            </a>
            <a
              href='/about'
              className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800 transition-colors'
            >
              Über uns
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
