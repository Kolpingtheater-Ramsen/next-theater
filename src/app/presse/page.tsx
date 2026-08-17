import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import teamData from '@/data/team.json'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Presse & Press Kit | Kolpingtheater Ramsen',
  description:
    'Presseinformationen, Kurzprofil, Fakten, Logo und Bildmaterial des Kolping-Open-Air-Theaters Ramsen.',
  alternates: { canonical: '/presse' },
  openGraph: {
    title: 'Presse & Press Kit | Kolpingtheater Ramsen',
    description: 'Offizielle Presseinformationen und Bildmaterial des Kolping-Open-Air-Theaters Ramsen.',
    url: '/presse',
    type: 'website',
    images: [{ url: '/img/other_images/Gruppenbild.jpg', alt: 'Ensemble des Kolpingtheaters Ramsen' }],
  },
}

const pressAssets = [
  {
    src: '/img/logo.png',
    downloadName: 'kolpingtheater-ramsen-logo.png',
    title: 'Logo',
    detail: 'PNG · 1104 × 1102 px · transparenter Hintergrund',
    alt: 'Logo des Kolpingtheaters Ramsen',
    fit: 'object-contain p-8 sm:p-12',
  },
  {
    src: '/img/other_images/Gruppenbild.jpg',
    downloadName: 'kolpingtheater-ramsen-ensemble.jpg',
    title: 'Ensemble',
    detail: 'JPG · 2192 × 1099 px',
    alt: 'Ensemble des Kolpingtheaters Ramsen',
    fit: 'object-cover',
  },
  {
    src: '/img/gallery_thumbs/anno/Bild_2.jpg',
    downloadName: 'kolpingtheater-ramsen-anno-1146-szenenfoto.jpg',
    title: 'Szenenfoto · Anno 1146',
    detail: 'JPG · 1200 × 800 px · Produktion 2025',
    alt: 'Graf Gottfried beauftragt Lothar von Greifenfels damit, die Gaukler zu töten',
    fit: 'object-cover',
  },
  {
    src: '/img/gallery_thumbs/nexus/Bild_1.jpg',
    downloadName: 'kolpingtheater-ramsen-nexus-finale.jpg',
    title: 'Szenenfoto · Nexus',
    detail: 'JPG · 1200 × 675 px · Produktion 2024',
    alt: 'Das große Finale der Produktion Nexus',
    fit: 'object-cover',
  },
]

const productionMotifs = [
  { title: 'Verrat im Kloster', year: 2017, src: '/img/banners/kloster.jpg', file: 'kolpingtheater-ramsen-verrat-im-kloster-2017-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Bluttribut', year: 2018, src: '/img/banners/bluttribut.jpg', file: 'kolpingtheater-ramsen-bluttribut-2018-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Dystopia', year: 2019, src: '/img/banners/dystopia.jpg', file: 'kolpingtheater-ramsen-dystopia-2019-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Der Kristall der Träume', year: 2020, src: '/img/banners/kristall.jpg', file: 'kolpingtheater-ramsen-kristall-der-traeume-2020-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Malleus Maleficarum', year: 2021, src: '/img/banners/maleficarum.jpg', file: 'kolpingtheater-ramsen-malleus-maleficarum-2021-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Goldfieber', year: 2022, src: '/img/banners/goldfieber.jpg', file: 'kolpingtheater-ramsen-goldfieber-2022-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Traum von Freiheit', year: 2023, src: '/img/other_images/Plakat Traum von Freiheit.jpg', file: 'kolpingtheater-ramsen-traum-von-freiheit-2023-plakat.jpg', kind: 'Originalplakat' },
  { title: 'Traum von Freiheit', year: 2023, src: '/img/banners/freiheit.jpg', file: 'kolpingtheater-ramsen-traum-von-freiheit-2023-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Sagenhaft', year: 2023, src: '/img/banners/sagenhaft.jpg', file: 'kolpingtheater-ramsen-sagenhaft-2023-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Nexus', year: 2024, src: '/img/banners/nexus.jpg', file: 'kolpingtheater-ramsen-nexus-2024-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Eine höllische Herausforderung', year: 2024, src: '/img/banners/hell.jpg', file: 'kolpingtheater-ramsen-hoellische-herausforderung-2024-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Anno 1146 – Alles hat eine Geschichte', year: 2025, src: '/img/banners/anno.jpg', file: 'kolpingtheater-ramsen-anno-1146-2025-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Schicksalsfäden', year: 2025, src: '/img/banners/schicksal.jpg', file: 'kolpingtheater-ramsen-schicksalsfaeden-2025-produktionsmotiv.jpg', kind: 'Produktionsmotiv' },
  { title: 'Theatergaudi', year: 2026, src: '/img/theatergaudi-2026-poster.jpg', file: 'kolpingtheater-ramsen-theatergaudi-2026-plakat.jpg', kind: 'Originalplakat' },
]

const trailers = [
  { year: 2026, title: '10. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'FyqtNxaxHBc' },
  { year: 2025, title: '9. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'My0Tlczguo4' },
  { year: 2025, title: 'Schicksalsfäden – TRAILER', id: 'BXA0PLAoQyE' },
  { year: 2024, title: '8. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'AVA0oU7xrgU' },
  { year: 2024, title: 'Höllische Herausforderung – TRAILER', id: 'dSxisyOp49g' },
  { year: 2023, title: '7. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'YqaOtjRkKVY' },
  { year: 2023, title: 'SAGENHAFT – TRAILER', id: 'JjOECsPBRqU' },
  { year: 2022, title: '6. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'EtmaG3W6o9Y' },
  { year: 2021, title: '5. KolpingOpenAir-Theater Ramsen – TRAILER', id: 'mw3wfoTQvo4' },
  { year: 2020, title: 'Der Kristall der Träume – AFTERMOVIE', id: 'jCytcFp1ut4' },
  { year: null, title: 'Kolping Open-Air-Theater in Ramsen – TRAILER', id: 'HJMblxYFka0' },
]

const facts = [
  { value: '2014', label: 'Gründung der Theatergruppe' },
  { value: String(teamData.plays.length), label: 'Produktionen im Repertoire' },
  { value: '2', label: 'Bühnenformate: Open-Air & Kreativbühne' },
  { value: 'Ramsen', label: 'Spielort in Rheinland-Pfalz' },
]

function DownloadIcon() {
  return (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path d='M12 3v12m0 0 4-4m-4 4-4-4M5 20h14' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path d='M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export default function PressePage() {
  return (
    <div className='-mx-4 -mt-8'>
      <section className='force-dark relative overflow-hidden border-b border-site-700 bg-site-950'>
        <div className='absolute inset-0'>
          <Image src='/img/other_images/Gruppenbild.jpg' alt='' fill priority sizes='100vw' className='object-cover opacity-45' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950 via-site-950/75 to-site-950/30' />
          <div className='absolute inset-0 bg-gradient-to-t from-site-950 via-transparent to-site-950/40' />
          <div className='scanlines opacity-20' />
        </div>
        <div className='relative mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-8 sm:pb-24'>
          <div className='max-w-4xl'>
            <div className='mb-5 font-mono text-[10px] uppercase tracking-[0.5em] text-kolping-400 sm:text-xs'>
              Pressebereich · Offizielles Material
            </div>
            <h1 className='font-display text-5xl font-black uppercase leading-[0.88] tracking-tight text-site-50 sm:text-7xl md:text-8xl lg:text-9xl'>
              Bühne für
              <br />
              <span className='italic text-kolping-400'>Geschichten.</span>
            </h1>
            <p className='mt-7 max-w-2xl text-base leading-relaxed text-site-100/90 sm:text-lg'>
              Fakten, Kurzprofil und ausgewähltes Bildmaterial für redaktionelle Berichterstattung über das Kolping-Open-Air-Theater Ramsen.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <a href='#downloads' className='inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-kolping-500'>
                Material ansehen <span aria-hidden='true'>↓</span>
              </a>
              <a href='mailto:kolpingtheaterramsen@gmail.com?subject=Presseanfrage' className='inline-flex items-center gap-2 rounded-sm border border-white/20 bg-site-950/60 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white transition-colors hover:border-kolping-400 hover:text-kolping-400'>
                Presseanfrage
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className='border-b border-site-700 bg-site-900'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24'>
          <div className='grid gap-12 lg:grid-cols-[1.25fr_.75fr] lg:gap-20'>
            <div>
              <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>Kurzprofil</div>
              <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[.95] tracking-tight sm:text-5xl'>
                Theater aus <span className='italic text-kolping-400'>eigener Feder.</span>
              </h2>
              <div className='hairline-gold mt-6 w-24' />
              <div className='mt-8 space-y-5 text-base leading-relaxed text-site-100 sm:text-lg'>
                <p>
                  Das Kolping-Open-Air-Theater Ramsen entstand 2014 aus einer Idee der Kolpingjugend. Die Gruppe entwickelt und spielt eigene Stücke – im Sommer unter freiem Himmel auf der Kolpingwiese und seit 2023 zusätzlich auf der Kreativbühne im Pfarrheim.
                </p>
                <p>
                  Historische Stoffe, Fantasie, Gesellschaftskritik und Komödie gehören zum Repertoire. Auf und hinter der Bühne arbeitet das Ensemble gemeinschaftlich an Schauspiel, Technik, Kulissen, Kostüm und Organisation. Die Aufführungen sind eintrittsfrei; freiwillige Spenden sind willkommen.
                </p>
              </div>
              <div className='mt-7 rounded-sm border-l-2 border-kolping-400 bg-site-800/60 p-5'>
                <div className='font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400'>Boilerplate zur Übernahme</div>
                <p className='mt-3 text-sm leading-relaxed text-site-100'>
                  Das 2014 gegründete Kolping-Open-Air-Theater Ramsen bringt selbst entwickelte Theaterstücke auf die Bühne. Gespielt wird im Sommer open air auf der Kolpingwiese und im Winter auf der Kreativbühne im Pfarrheim. Das Ensemble verbindet Schauspiel mit gemeinschaftlicher Arbeit in Technik, Kulissenbau, Kostüm und Organisation; der Eintritt zu den Aufführungen ist frei.
                </p>
              </div>
            </div>

            <aside className='border border-site-700 bg-site-950 p-6 sm:p-8'>
              <div className='flex items-center justify-between border-b border-site-700 pb-5'>
                <h2 className='font-display text-2xl uppercase'>Key Facts</h2>
                <span className='h-2 w-2 rounded-full bg-kolping-400' />
              </div>
              <dl className='divide-y divide-site-700'>
                {facts.map((fact, index) => (
                  <div key={fact.label} className='grid grid-cols-[64px_1fr] gap-4 py-5'>
                    <dt className='order-2 text-sm leading-snug text-site-100'>{fact.label}</dt>
                    <dd className='cast-number font-display text-2xl italic text-kolping-400'>{index === 1 ? String(fact.value).padStart(2, '0') : fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className='mt-5 text-xs leading-relaxed text-site-300'>
                Ausgezeichnet mit dem Kolpingjugendpreis 2022 (1. Platz) und dem Jugend-Engagement-Preis Rheinland-Pfalz 2026.
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id='downloads' className='scroll-mt-24 border-b border-site-700 bg-site-950'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24'>
          <div className='max-w-3xl'>
            <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>Downloadbereich</div>
            <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[.95] tracking-tight sm:text-6xl'>Logo & <span className='italic text-kolping-400'>Pressebilder.</span></h2>
            <p className='mt-6 text-site-100'>Die Dateien werden in ihrer vorhandenen Auflösung bereitgestellt. Bitte die Nutzungshinweise unterhalb der Auswahl beachten.</p>
          </div>

          <div className='mt-12 grid gap-5 sm:grid-cols-2'>
            {pressAssets.map((asset) => (
              <article key={asset.src} className='group overflow-hidden rounded-sm border border-site-700 bg-site-900 transition-colors hover:border-kolping-400/60'>
                <div className='relative aspect-[16/10] overflow-hidden bg-site-800'>
                  <Image src={asset.src} alt={asset.alt} fill sizes='(min-width: 640px) 50vw, 100vw' className={`${asset.fit} transition-transform duration-700 group-hover:scale-[1.025]`} />
                </div>
                <div className='p-5 sm:p-6'>
                  <h3 className='font-display text-xl uppercase tracking-tight text-site-50'>{asset.title}</h3>
                  <p className='mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-site-300'>{asset.detail}</p>
                  <a href={asset.src} download={asset.downloadName} className='mt-5 inline-flex items-center gap-2 rounded-sm bg-kolping-400 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-kolping-500' aria-label={`${asset.title} herunterladen`}>
                    <DownloadIcon /> Herunterladen
                  </a>
                  <div className='mt-3 break-all font-mono text-[9px] text-site-300'>{asset.downloadName}</div>
                </div>
              </article>
            ))}
          </div>

          <div className='mt-20 border-t border-site-700 pt-14'>
            <div className='max-w-3xl'>
              <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>Plakate & Produktionsmotive</div>
              <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[.95] tracking-tight sm:text-5xl'>Produktionen im <span className='italic text-kolping-400'>Bild.</span></h2>
              <p className='mt-5 text-site-100'>Originalplakate sind ausdrücklich gekennzeichnet. Die weiteren Dateien sind historische Produktionsmotive und Banner aus dem jeweiligen Webauftritt.</p>
            </div>
            <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {productionMotifs.map((motif) => (
                <article key={motif.file} className='group flex overflow-hidden rounded-sm border border-site-700 bg-site-900 transition-colors hover:border-kolping-400/60'>
                  <div className='flex w-full flex-col'>
                    <div className='relative aspect-[4/3] overflow-hidden bg-site-800'>
                      <Image src={motif.src} alt={`${motif.kind} der Produktion ${motif.title}`} fill sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' className='object-contain transition-transform duration-700 group-hover:scale-[1.025]' />
                    </div>
                    <div className='flex flex-1 flex-col p-5'>
                      <div className='font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-kolping-400'>{motif.kind} · {motif.year}</div>
                      <h3 className='mt-2 font-display text-xl uppercase leading-tight text-site-50'>{motif.title}</h3>
                      <a href={motif.src} download={motif.file} className='mt-auto inline-flex w-fit items-center gap-2 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-site-100 transition-colors hover:text-kolping-400' aria-label={`${motif.title}, ${motif.year} herunterladen`}>
                        <DownloadIcon /> Download
                      </a>
                      <div className='mt-2 break-all font-mono text-[8px] leading-relaxed text-site-300'>{motif.file}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className='mt-10 grid gap-6 border border-site-700 bg-site-900 p-6 sm:p-8 md:grid-cols-2'>
            <div>
              <h3 className='font-display text-xl uppercase text-site-50'>Verwendung</h3>
              <p className='mt-3 text-sm leading-relaxed text-site-100'>
                Die Bereitstellung als Download überträgt keine Nutzungsrechte. Eine redaktionelle Verwendung bitte vor Veröffentlichung mit dem Pressekontakt abstimmen. Bearbeitung, kommerzielle Nutzung und Weitergabe bedürfen der schriftlichen Zustimmung.
              </p>
            </div>
            <div>
              <h3 className='font-display text-xl uppercase text-site-50'>Copyright & Bildnachweis</h3>
              <p className='mt-3 text-sm leading-relaxed text-site-100'>
                Als Bildnachweis bitte „Kolping-Open-Air-Theater Ramsen“ angeben. Motive nicht sinnentstellend verändern. Für abweichende Formate oder Fragen zu einzelnen Motiven nehmen Sie bitte Kontakt auf.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='border-b border-site-700 bg-site-900'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24'>
          <div className='max-w-3xl'>
            <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400 sm:text-xs'>Offizieller YouTube-Kanal</div>
            <h2 className='mt-4 font-display text-4xl font-black uppercase leading-[.95] tracking-tight sm:text-6xl'>Trailer & <span className='italic text-kolping-400'>Filme.</span></h2>
            <p className='mt-6 text-site-100'>Direkte Links zu den offiziellen Videos – ohne eingebetteten Player und ohne YouTube-Tracking auf dieser Seite.</p>
          </div>
          <div className='mt-12 grid gap-4 md:grid-cols-2'>
            {trailers.map((trailer) => (
              <a key={trailer.id} href={`https://www.youtube.com/watch?v=${trailer.id}`} target='_blank' rel='noopener noreferrer' className='group flex min-h-36 items-stretch overflow-hidden rounded-sm border border-site-700 bg-site-950 transition-colors hover:border-kolping-400/70' aria-label={`${trailer.title} auf YouTube ansehen (öffnet in neuem Tab)`}>
                <div className='flex w-20 shrink-0 items-center justify-center border-r border-site-700 bg-kolping-400 text-black sm:w-24'>
                  <span className='font-display text-xl font-black'>{trailer.year ?? 'Archiv'}</span>
                </div>
                <div className='flex flex-1 items-center justify-between gap-4 p-5 sm:p-6'>
                  <div>
                    <div className='font-mono text-[9px] uppercase tracking-[0.25em] text-site-300'>Offizielles Video</div>
                    <h3 className='mt-2 font-display text-lg uppercase leading-tight text-site-50 sm:text-xl'>{trailer.title}</h3>
                    <div className='mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-kolping-400'>Auf YouTube ansehen</div>
                  </div>
                  <span className='shrink-0 text-kolping-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1'><ExternalIcon /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-site-900'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24'>
          <div className='relative overflow-hidden border border-site-700 bg-site-950 p-7 sm:p-10 md:p-14'>
            <div className='absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-kolping-500/10 to-transparent' aria-hidden='true' />
            <div className='relative grid gap-10 md:grid-cols-[1fr_auto] md:items-end'>
              <div>
                <div className='font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400'>Pressekontakt</div>
                <h2 className='mt-4 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl'>Sprechen wir <span className='italic text-kolping-400'>darüber.</span></h2>
                <p className='mt-5 max-w-xl text-site-100'>Für Presseanfragen, Freigaben und weiteres Material erreichen Sie das Kolpingtheater Ramsen per E-Mail.</p>
                <a href='mailto:kolpingtheaterramsen@gmail.com?subject=Presseanfrage' className='mt-6 inline-block break-all font-mono text-sm text-kolping-400 underline decoration-kolping-400/40 underline-offset-4 hover:text-kolping-500'>kolpingtheaterramsen@gmail.com</a>
              </div>
              <div className='flex flex-col items-start gap-3 md:items-end'>
                <a href='mailto:kolpingtheaterramsen@gmail.com?subject=Presseanfrage' className='inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-kolping-500'>Presseanfrage <span aria-hidden='true'>→</span></a>
                <Link href='/contact' className='font-mono text-[10px] uppercase tracking-[0.25em] text-site-100 hover:text-kolping-400'>Alle Kontaktwege</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
