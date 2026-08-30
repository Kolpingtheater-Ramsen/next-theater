import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Danke für euren Besuch | Kolpingtheater Ramsen',
  description:
    'Die Creepshow ist vorbei. Neuigkeiten zu unserem Winterstück und zum nächsten Sommertheater gibt es auf Instagram und YouTube.',
  openGraph: {
    title: 'Danke für euren Besuch | Kolpingtheater Ramsen',
    description:
      'Die Creepshow ist vorbei. Neuigkeiten zu unserem Winterstück und zum nächsten Sommertheater gibt es auf Instagram und YouTube.',
    images: ['/img/creepshow-banner.webp'],
  },
}

export default function Home() {
  return (
    <div className='-mx-4 -my-8' data-home-state='post-show'>
      <section className='force-dark relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-site-950 px-4 py-16 sm:px-8 sm:py-24'>
        <Image
          src='/img/creepshow-banner.webp'
          alt='Das Ensemble der Creepshow auf der Kolpingwiese'
          fill
          priority
          sizes='100vw'
          className='-z-30 object-cover object-center opacity-30 grayscale-[35%]'
        />
        <div className='absolute inset-0 -z-20 bg-gradient-to-r from-site-950 via-site-950/90 to-site-950/55' />
        <div className='absolute inset-0 -z-10 bg-gradient-to-t from-site-950 via-transparent to-site-950/50' />
        <div className='grain absolute inset-0 -z-10' aria-hidden />

        <span
          className='absolute left-6 top-6 h-4 w-4 border-l-2 border-t-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute right-6 top-6 h-4 w-4 border-r-2 border-t-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute bottom-6 left-6 h-4 w-4 border-b-2 border-l-2 border-kolping-400/70'
          aria-hidden
        />
        <span
          className='absolute bottom-6 right-6 h-4 w-4 border-b-2 border-r-2 border-kolping-400/70'
          aria-hidden
        />

        <div className='mx-auto w-full max-w-6xl'>
          <div className='max-w-3xl'>
            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-kolping-400 sm:text-xs sm:tracking-[0.45em]'>
              Danke für euren Besuch
            </p>
            <h1 className='mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-site-50 sm:text-6xl md:text-7xl'>
              Das war die{' '}
              <span className='italic text-kolping-400'>Creepshow.</span>
            </h1>
            <div className='hairline-gold mt-6 w-24' />
            <p className='mt-6 max-w-2xl text-base leading-relaxed text-site-100 sm:text-lg'>
              Danke an alle, die bei unseren Vorstellungen auf der Kolpingwiese
              dabei waren. Wir haben uns sehr über euren Besuch gefreut.
            </p>

            <div className='mt-10 border-l-2 border-kolping-400 pl-5 sm:mt-12 sm:pl-7'>
              <p className='font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-kolping-400 sm:text-xs'>
                Stay tuned
              </p>
              <p className='mt-3 max-w-xl text-sm leading-relaxed text-site-100 sm:text-base'>
                Auf Instagram und YouTube geben wir bekannt, welches Stück wir
                im Winter spielen und was im nächsten Sommer auf die Bühne
                kommt.
              </p>
            </div>

            <div className='mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
              <a
                href='https://www.instagram.com/kolpingtheater_ramsen/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-black transition-colors hover:bg-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
              >
                Instagram
                <span aria-hidden>→</span>
              </a>
              <a
                href='https://www.youtube.com/@kolpingtheaterramsen'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-site-300/60 bg-site-950/60 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-site-50 backdrop-blur-sm transition-colors hover:border-kolping-400 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
              >
                YouTube
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
