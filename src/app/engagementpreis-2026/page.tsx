import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Nominierung Deutscher Engagementpreis 2026 | Kolpingtheater Ramsen',
  description:
    'Das Kolpingtheater Ramsen ist für den Deutschen Engagementpreis 2026 nominiert. Alle Informationen zur Nominierung und zum Publikumsvoting.',
  alternates: { canonical: '/engagementpreis-2026' },
  openGraph: {
    title: 'Wir sind für den Deutschen Engagementpreis 2026 nominiert',
    description:
      'Unser ehrenamtliches Theaterprojekt gehört zu den Nominierten für den Deutschen Engagementpreis 2026.',
    url: '/engagementpreis-2026',
    type: 'article',
    images: [
      {
        url: '/img/deutscher-engagementpreis-2026-banner.png',
        alt: 'Wir sind für den Deutschen Engagementpreis 2026 nominiert',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wir sind für den Deutschen Engagementpreis 2026 nominiert',
    description:
      'Unser ehrenamtliches Theaterprojekt gehört zu den Nominierten für den Deutschen Engagementpreis 2026.',
    images: ['/img/deutscher-engagementpreis-2026-banner.png'],
  },
}

const facts = [
  { value: '626', label: 'Nominierte Projekte und Personen' },
  { value: '170', label: 'Engagementpreise haben nominiert' },
  { value: '1.–29.10.', label: 'Publikumsvoting 2026' },
  { value: '26.11.', label: 'Preisverleihung in Berlin' },
]

export default function EngagementpreisPage() {
  return (
    <div className='-mx-4 -mt-8'>
      <article>
        <header className='force-dark relative isolate overflow-hidden border-b border-site-700 bg-site-950'>
          <div className='absolute inset-0 -z-20 bg-[radial-gradient(circle_at_22%_25%,rgba(255,122,0,0.22),transparent_36%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,0.06),transparent_32%)]' />
          <div className='grain absolute inset-0 -z-10' aria-hidden />
          <div className='mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)] lg:gap-16'>
            <div>
              <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.42em] text-kolping-400 sm:text-xs'>
                Ehrenamt · Theater · Gemeinschaft
              </p>
              <h1 className='mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-site-50 sm:text-6xl md:text-7xl'>
                Wir sind für den Deutschen Engagementpreis 2026{' '}
                <span className='italic text-kolping-400'>nominiert.</span>
              </h1>
              <div className='hairline-gold mt-7 w-24' />
              <p className='mt-7 max-w-2xl text-base leading-relaxed text-site-100 sm:text-lg'>
                Der Jugend-Engagement-Wettbewerb RLP „Sich einmischen – was
                bewegen“ hat unser Projekt für den Deutschen Engagementpreis
                vorgeschlagen. Über diese Anerkennung freuen wir uns riesig.
              </p>
              <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='https://www.deutscher-engagementpreis.de/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-black transition-colors hover:bg-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
                >
                  Zur Preiswebsite <span aria-hidden>↗</span>
                </a>
                <Link
                  href='/about'
                  className='inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-site-700 bg-site-900 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-site-50 transition-colors hover:border-kolping-400 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
                >
                  Unsere Geschichte <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className='relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-sm bg-white shadow-[0_35px_100px_-35px_rgba(0,0,0,0.95)]'>
              <Image
                src='/img/deutscher-engagementpreis-2026-badge.png'
                alt='Offizieller Badge: Wir sind nominiert für den Deutschen Engagementpreis 2026'
                fill
                priority
                sizes='(min-width: 1024px) 42vw, 90vw'
                className='object-contain'
              />
            </div>
          </div>
        </header>

        <section className='border-b border-site-700 bg-site-900'>
          <div className='mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24'>
            <div className='grid gap-12 lg:grid-cols-[1fr_.9fr] lg:gap-20'>
              <div>
                <p className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>
                  Was hinter der Nominierung steckt
                </p>
                <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-site-50 sm:text-5xl'>
                  Viele Hände. Eine{' '}
                  <span className='italic text-kolping-400'>Bühne.</span>
                </h2>
                <div className='hairline-gold mt-6 w-24' />
                <div className='mt-7 space-y-5 text-base leading-relaxed text-site-100'>
                  <p>
                    Seit 2014 schreiben, bauen, organisieren und spielen wir
                    unsere Produktionen selbst. Schauspiel, Technik, Kulissen,
                    Kostüme und die vielen unsichtbaren Aufgaben hinter dem
                    Vorhang entstehen ehrenamtlich im Team.
                  </p>
                  <p>
                    Im Februar 2026 wurden wir dafür beim
                    Jugend-Engagement-Wettbewerb RLP „Sich einmischen – was
                    bewegen“ ausgezeichnet. Diese Auszeichnung hat nun den Weg
                    zur Nominierung für den Deutschen Engagementpreis eröffnet.
                  </p>
                  <p>
                    Die Nominierung gehört allen, die seit Jahren ihre Ideen,
                    Zeit und Energie in das Kolpingtheater Ramsen einbringen –
                    auf, vor und hinter der Bühne.
                  </p>
                </div>
              </div>

              <aside className='border border-kolping-500/30 bg-site-950 p-6 sm:p-8'>
                <p className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                  Deutscher Engagementpreis 2026
                </p>
                <h2 className='mt-4 font-display text-3xl uppercase leading-tight text-site-50'>
                  Die wichtigsten Termine
                </h2>
                <div className='mt-7 space-y-6 border-l border-site-700 pl-6'>
                  <div>
                    <p className='font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400'>
                      1.–29. Oktober 2026
                    </p>
                    <p className='mt-2 text-sm leading-relaxed text-site-100'>
                      In diesem Zeitraum findet das öffentliche
                      Publikumsvoting statt.
                    </p>
                  </div>
                  <div>
                    <p className='font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400'>
                      26. November 2026
                    </p>
                    <p className='mt-2 text-sm leading-relaxed text-site-100'>
                      Preisverleihung im Colosseum Berlin.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className='border-b border-site-700 bg-site-950'>
          <div className='mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20'>
            <div className='grid gap-px overflow-hidden border border-site-700 bg-site-700 sm:grid-cols-2 lg:grid-cols-4'>
              {facts.map((fact) => (
                <div key={fact.label} className='bg-site-900 p-6 sm:p-8'>
                  <div className='font-display text-4xl font-black italic text-kolping-400 sm:text-5xl'>
                    {fact.value}
                  </div>
                  <p className='mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-site-100'>
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>
            <p className='mt-5 text-xs leading-relaxed text-site-300'>
              626 Projekte und Personen wurden von 170 Engagementpreisen für
              den Deutschen Engagementpreis 2026 vorgeschlagen. Fünf
              Jury-Auszeichnungen sind mit jeweils 10.000 Euro und einem
              professionellen Imagevideo verbunden.
            </p>
          </div>
        </section>

        <section className='bg-site-900 px-4 py-16 sm:px-8 sm:py-24'>
          <div className='mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 bg-site-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
            <div className='clapper-stripes h-6 sm:h-8' aria-hidden />
            <div className='grid gap-8 p-8 sm:p-12 md:grid-cols-[1fr_auto] md:items-end'>
              <div>
                <p className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>
                  Bleibt mit uns dran
                </p>
                <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-site-50 sm:text-5xl'>
                  Neuigkeiten zur{' '}
                  <span className='italic text-kolping-400'>Nominierung.</span>
                </h2>
                <p className='mt-5 max-w-2xl text-sm leading-relaxed text-site-100 sm:text-base'>
                  Sobald das Publikumsvoting startet, teilen wir alle weiteren
                  Informationen auf unserer Website und auf Instagram.
                </p>
              </div>
              <a
                href='https://www.instagram.com/kolpingtheater_ramsen/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-black transition-colors hover:bg-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-950'
              >
                Instagram folgen <span aria-hidden>↗</span>
              </a>
            </div>
            <div className='clapper-stripes h-6 sm:h-8' aria-hidden />
          </div>
        </section>
      </article>
    </div>
  )
}
