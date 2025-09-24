import Hero from '@/components/Hero'
import CountdownTimer from '@/components/CountdownTimer'
import ShowSchedule from '@/components/ShowSchedule'

export default function Home() {
  return (
    <div className='space-y-12'>
      <Hero
        imageSrc='/img/banners/anno.jpg'
        title='Anno 1146'
        tagline='Kolping-Open-Air-Theater Ramsen'
        subtitle='Danke für euren Besuch! Bleibt gespannt – 2025 und 2026 erwarten euch neue Produktionen und besondere Highlights.'
      />

      <section className='mx-auto grid max-w-5xl gap-4 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <CountdownTimer targetDate='2025-08-23T20:00:00+02:00' title='Nächste Premiere startet in' />
        </div>
        <div>
          <ShowSchedule />
        </div>
      </section>

      <section className='max-w-4xl mx-auto text-center space-y-4 py-4'>
        <h2 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>
          Mehr kommt schon bald
        </h2>
        <p className='text-site-100'>
          Wir arbeiten bereits an den nächsten Projekten für 2025 und 2026. Schau
          regelmäßig vorbei oder folge uns für Neuigkeiten, Probenblicke und
          Ankündigungen.
        </p>
        <div className='flex items-center justify-center gap-3 pt-2'>
          <a
            href='https://www.youtube.com/@kolpingtheaterramsen'
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='18'
              height='18'
              fill='currentColor'
              aria-hidden='true'
              className='shrink-0'
            >
              <path d='M23.498 6.186a3 3 0 0 0-2.118-2.118C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.38.568A3 3 0 0 0 .502 6.186C0 7.766 0 12 0 12s0 4.234.502 5.814a3 3 0 0 0 2.118 2.118C4.2 20.5 12 20.5 12 20.5s7.8 0 9.38-.568a3 3 0 0 0 2.118-2.118C24 16.234 24 12 24 12s0-4.234-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z' />
            </svg>
            <span>YouTube</span>
          </a>
          <a
            href='https://www.instagram.com/kolpingjugend_ramsen/'
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 rounded border border-site-700 hover:border-kolping-500 bg-site-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='18'
              height='18'
              fill='currentColor'
              aria-hidden='true'
              className='shrink-0'
            >
              <path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </div>
  )
}
