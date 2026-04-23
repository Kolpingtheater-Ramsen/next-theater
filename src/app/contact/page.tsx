import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'

export default function ContactPage() {
  return (
    <div className='-mx-4 -mt-8'>
      {/* ══════ HERO ══════ */}
      <section className='relative overflow-hidden'>
        <div className='relative w-full h-[70vh] min-h-[460px] max-h-[780px]'>
          <Image
            src='/img/other_images/Gruppenbild.jpg'
            alt='Ensemble des Kolpingtheaters Ramsen'
            fill
            priority
            sizes='100vw'
            className='object-cover animate-kenburns'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-site-950/45 via-site-950/25 to-site-950' />
          <div className='absolute inset-0 bg-gradient-to-r from-site-950/75 via-site-950/35 to-transparent' />
          <div className='vignette' />
          <div className='footlight' />

          {/* corner film-frame ticks */}
          <span className='absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-kolping-400/70' aria-hidden />
          <span className='absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-kolping-400/70' aria-hidden />

          <div className='absolute inset-0 flex flex-col justify-end pb-14 sm:pb-20 md:pb-24'>
            <div className='mx-auto w-full max-w-7xl px-4 sm:px-8'>
              <div className='animate-fade-in-up mb-5 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center gap-2 rounded-full border border-kolping-400/50 bg-site-950/70 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-kolping-400 uppercase'>
                  <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
                  Schreib uns
                </span>
                <span className='inline-flex items-center rounded-full border border-white/20 bg-site-950/55 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono font-semibold tracking-[0.25em] text-white uppercase'>
                  Antwort meist innerhalb weniger Tage
                </span>
              </div>

              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.5em] text-kolping-400 mb-3 animate-fade-in-up'>
                Kolpingtheater Ramsen
              </div>

              <h1 className='animate-curtain-rise font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.88] text-shadow-lg'>
                Sag
                <br />
                <span className='italic text-kolping-400'>Hallo.</span>
              </h1>

              <p className='animate-fade-in-up mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-site-100/90 max-w-2xl leading-relaxed text-shadow'>
                Fragen zur Vorstellung, zur Anfahrt, zum Mitmachen oder einfach
                nur Lust auf Theater? Wir freuen uns über jede Nachricht.
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up'>
                <a
                  href='mailto:kolpingjugendramsen@gmail.com'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]'
                >
                  E-Mail schreiben
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </a>
                <a
                  href='#probe'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Zur nächsten Probe
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ KONTAKTWEGE ══════ */}
      <section className='relative bg-site-950 border-b border-site-700'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-20'>
          <div className='mb-10 sm:mb-14'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
              Kontaktwege
            </div>
            <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
              So <span className='italic text-kolping-400'>erreichen</span> Sie uns.
            </h2>
            <div className='hairline-gold w-24 mt-5' />
          </div>

          <div className='grid md:grid-cols-3 gap-4 sm:gap-6'>
            {[
              {
                num: '01',
                label: 'E-Mail',
                value: 'kolpingjugendramsen@gmail.com',
                sub: 'Für alles Inhaltliche — meist innerhalb weniger Tage',
                href: 'mailto:kolpingjugendramsen@gmail.com',
                cta: 'Schreiben',
              },
              {
                num: '02',
                label: 'Instagram',
                value: '@kolpingjugend_ramsen',
                sub: 'Neues aus Proben, Backstage & Premieren',
                href: 'https://www.instagram.com/kolpingjugend_ramsen/',
                cta: 'Folgen',
                external: true,
              },
              {
                num: '03',
                label: 'YouTube',
                value: '@kolpingtheaterramsen',
                sub: 'Mitschnitte und Einblicke in vergangene Stücke',
                href: 'https://www.youtube.com/@kolpingtheaterramsen',
                cta: 'Abonnieren',
                external: true,
              },
            ].map((c) => (
              <a
                key={c.num}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className='group relative p-6 sm:p-7 border border-site-700 bg-site-900 rounded-sm hover:border-kolping-400/60 transition-colors block'
              >
                <div className='flex items-start justify-between mb-5'>
                  <div className='cast-number font-display text-5xl italic leading-none'>
                    {c.num}
                  </div>
                  <span
                    className='w-2 h-2 rounded-full bg-kolping-400/80 group-hover:bg-kolping-400 transition-colors'
                    aria-hidden
                  />
                </div>
                <h3 className='font-display text-3xl sm:text-4xl uppercase tracking-tight text-site-50 leading-none'>
                  {c.label}
                </h3>
                <div className='mt-2 font-mono text-[11px] sm:text-xs text-site-300 break-all'>
                  {c.value}
                </div>
                <div className='hairline-gold w-10 my-4 group-hover:w-24 transition-all duration-500' />
                <p className='text-sm text-site-100 leading-relaxed'>{c.sub}</p>
                <div className='mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-kolping-400 group-hover:text-kolping-500 transition-colors'>
                  {c.cta}
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PROBE / BESUCH ══════ */}
      <section
        id='probe'
        className='relative bg-site-900 border-b border-site-700 scroll-mt-24'
      >
        <div
          className='absolute inset-0 opacity-[0.04] pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden
        />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-20'>
          <div className='grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start'>
            <div>
              <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                Vor Ort
              </div>
              <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
                Komm
                <br />
                <span className='italic text-kolping-400'>vorbei.</span>
              </h2>
              <div className='hairline-gold w-24 mt-5' />
              <p className='mt-6 text-site-100 text-base sm:text-lg leading-relaxed max-w-xl'>
                Unsere Proben sind offen. Schau rein, sag Hallo,
                probier Theater aus, keine Voranmeldung nötig.
              </p>

              <div className='mt-8 flex flex-wrap gap-3'>
                <a
                  href='https://maps.google.com/?q=Klosterhof+7,+67305+Ramsen'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500'
                >
                  In Google Maps
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </a>
                <Link
                  href='/about'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Über uns
                </Link>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {[
                {
                  label: 'Ort',
                  value: 'Klosterhof 7',
                  sub: '67305 Ramsen',
                  icon: '◆',
                },
                {
                  label: 'Reguläre Probe',
                  value: 'Mittwoch · 19:00',
                  sub: 'Offen für Neue · ohne Voranmeldung',
                  icon: '●',
                },
                {
                  label: 'Aufführungen',
                  value: 'Sommer · Kolpingwiese',
                  sub: 'Eintritt frei — freiwillige Spende willkommen',
                  icon: '★',
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className='relative p-5 sm:p-6 border border-site-700 bg-site-900 rounded-sm group hover:border-kolping-400/40 transition-colors'
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className='font-mono text-[10px] uppercase tracking-[0.35em] text-kolping-400'>
                      {c.label}
                    </div>
                    <div
                      className='text-kolping-400/60 group-hover:text-kolping-400 transition-colors text-lg'
                      aria-hidden
                    >
                      {c.icon}
                    </div>
                  </div>
                  <div className='font-display text-xl sm:text-2xl uppercase tracking-tight text-site-50'>
                    {c.value}
                  </div>
                  <div className='hairline-gold w-10 my-3' />
                  <div className='text-sm text-site-100'>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ INTERESSIERT ══════ */}
      <section className='relative bg-site-950 border-b border-site-700'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-20'>
          <div className='mb-10 sm:mb-14'>
            <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
              Mitmachen
            </div>
            <h2 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-site-50 leading-[0.9]'>
              Für wen wir <span className='italic text-kolping-400'>offen sind.</span>
            </h2>
            <div className='hairline-gold w-24 mt-5' />
          </div>

          <div className='grid md:grid-cols-3 gap-4 sm:gap-6'>
            {[
              {
                num: '01',
                title: 'Auf der Bühne',
                body: 'Schauspiel — ob Anfänger oder mit Erfahrung. Bei uns wird niemand vorgesprochen, alle bekommen eine Rolle.',
              },
              {
                num: '02',
                title: 'Hinter der Bühne',
                body: 'Technik, Bau, Licht, Ton, Kostüm, Maske, Regieassistenz. Ohne diese Leute kein Vorhang.',
              },
              {
                num: '03',
                title: 'Im Hintergrund',
                body: 'Organisation, Öffentlichkeitsarbeit, Catering, Einlass. Jede Rolle zählt, auch abseits des Scheinwerferlichts.',
              },
            ].map((c) => (
              <article
                key={c.num}
                className='group relative p-6 sm:p-8 border border-site-700 bg-site-900 rounded-sm hover:border-kolping-400/40 transition-colors'
              >
                <div className='flex items-start justify-between mb-5'>
                  <div className='cast-number font-display text-5xl italic leading-none'>
                    {c.num}
                  </div>
                  <div className='flex gap-1 pt-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/80' />
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/40' />
                    <span className='w-1.5 h-1.5 rounded-full bg-kolping-400/20' />
                  </div>
                </div>
                <h3 className='font-display text-2xl uppercase tracking-tight text-site-50 leading-tight'>
                  {c.title}
                </h3>
                <div className='hairline-gold w-10 my-4 group-hover:w-24 transition-all duration-500' />
                <p className='text-sm text-site-100 leading-relaxed'>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA · Clapperboard ══════ */}
      <section className='relative bg-site-950 py-16 sm:py-24 px-4 sm:px-8 border-t border-site-700'>
        <div className='relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-site-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]'>
          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />

          <div className='relative p-8 sm:p-12 md:p-16 bg-site-900'>
            <div
              className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kolping-500/10 to-transparent pointer-events-none'
              aria-hidden
            />

            <div className='relative grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-end'>
              <div>
                <div className='font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-kolping-400 mb-4'>
                  Wir sehen uns
                </div>
                <h3 className='font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95]'>
                  Bis
                  <br />
                  <span className='italic text-kolping-400'>bald.</span>
                </h3>
                <p className='mt-5 text-site-100/85 max-w-lg text-sm sm:text-base leading-relaxed'>
                  Eine E-Mail, ein Besuch auf der Probe, ein Abend im Publikum —
                  jeder Weg führt zu uns.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:items-end'>
                <a
                  href='mailto:kolpingjugendramsen@gmail.com'
                  className='group inline-flex items-center gap-3 rounded-sm bg-kolping-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-kolping-500 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                >
                  E-Mail
                  <span className='transition-transform group-hover:translate-x-1'>→</span>
                </a>
                <a
                  href='https://www.instagram.com/kolpingjugend_ramsen/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-site-100 hover:text-kolping-400 transition-colors'
                >
                  → Instagram
                </a>
              </div>
            </div>
          </div>

          <div className='clapper-stripes h-6 sm:h-8' aria-hidden />
        </div>
      </section>
    </div>
  )
}
