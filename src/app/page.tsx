import Image from 'next/image'

export default function Home() {
  return (
    <div className='space-y-12'>
      <section className='relative w-full max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto aspect-[1968/2756] md:max-h-[80vh] overflow-hidden rounded-lg border border-site-700 bg-site-900'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/img/banners/anno.jpg'
            alt=''
            aria-hidden
            fill
            priority
            className='object-cover blur-3xl scale-125 opacity-60'
          />
        </div>
        <Image
          src='/img/banners/anno.jpg'
          alt='Sommerstück 2025 Banner - Anno 1146'
          fill
          priority
          className='object-contain relative z-10'
        />
        <div className='pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 z-30 p-6 md:p-10'>
          <div className='max-w-3xl space-y-2 text-shadow'>
            <span className='inline-block text-sm tracking-wide text-site-100 text-shadow'>
              Kolpingtheater Ramsen
            </span>
            <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-shadow-lg'>
              Anno 1146
            </h1>
            <p className='text-lg md:text-xl font-semibold text-kolping-400 text-shadow'>
              Danke für euren Besuch!
            </p>
            <p className='text-site-50 text-shadow'>
              Wir freuen uns, dass ihr dabei wart. Bleibt gespannt – 2025 und 2026
              erwarten euch neue Produktionen und besondere Highlights. Mehr Infos
              folgen.
            </p>
          </div>
        </div>
      </section>

      <section className='max-w-3xl mx-auto text-center space-y-4 py-4'>
        <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
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
