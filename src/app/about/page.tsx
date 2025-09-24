import Image from 'next/image'
import Link from 'next/link'
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
    <div className='space-y-12'>
      <section className='prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:font-extrabold prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl'>
        <h1>Über uns</h1>
        <p>
          Wir sind das Kolping-Open-Air-Theater Ramsen. Seit 2014 entwickeln wir
          eigene Stücke und bringen sie jeden Sommer auf der Kolpingwiese zur
          Premiere. Der Eintritt ist frei – Theater für alle.
        </p>
        <p>Spielort: Klosterhof 7, 67305 Ramsen.</p>
        <div className='not-prose mt-6'>
          <div className='relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-site-700'>
            <Image
              src='/img/other_images/Gruppenbild.webp'
              alt='Gruppenbild des Kolpingtheaters Ramsen'
              fill
              className='object-cover'
              priority={false}
            />
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='font-display text-2xl md:text-3xl font-extrabold tracking-tight'>Chronik</h2>
        <ol className='space-y-8'>
          {(timeline as unknown as TimelineEntry[])
            .slice()
            .reverse()
            .map((t, i) => (
              <li key={i} className='relative'>
                <div className='grid md:grid-cols-[220px_1fr] gap-6'>
                  <div className='text-xs md:text-sm font-semibold text-kolping-400 whitespace-nowrap'>
                    {t.date}
                  </div>
                  <div className='space-y-2'>
                    <div className='font-semibold'>{t.header}</div>
                    {t.image ? (
                      <div className='relative aspect-[16/9] rounded-lg overflow-hidden border border-site-700 bg-black'>
                        <Image
                          src={`/img/${t.image}`}
                          alt={t.header}
                          fill
                          className='object-contain'
                        />
                      </div>
                    ) : null}
                    <p className='text-sm text-site-100'>{t.text}</p>
                    {t.galleryHash ? (
                      <Link
                        href={`/gallery/${t.galleryHash}`}
                        className='text-kolping-400 underline'
                      >
                        Galerie ansehen
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
        </ol>
      </section>
    </div>
  )
}
