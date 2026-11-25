'use client'

import Link from 'next/link'
import PremiereCountdown from '@/components/PremiereCountdown'
import WinterReleaseRefresh from '@/components/WinterReleaseRefresh'
import { WINTER_RELEASE_ISO } from '@/lib/winter-release'

export default function BookingComingSoon() {
  return (
    <>
      <WinterReleaseRefresh />
      <header className='ticket-intro'>
        <div>
          <p className='ticket-eyebrow'>Kolpingtheater Ramsen · Wintertheater</p>
          <h1 className='ticket-heading'>
            Reservierung ab <em>1. Dezember.</em>
          </h1>
          <p className='ticket-muted'>
            Unsere Online-Sitzplatzreservierung öffnet bald.
          </p>
        </div>
        <span className='ticket-badge'>Eintritt frei</span>
      </header>

      <section className='ticket-panel' aria-labelledby='booking-release-heading'>
        <h2 id='booking-release-heading' className='ticket-section-title'>
          Buchungsstart am 1. Dezember 2026
        </h2>
        <p className='ticket-muted mt-2 max-w-2xl'>
          Ab Dienstag, 1. Dezember 2026 um 00:00 Uhr kannst du hier deine
          kostenlosen Plätze für unser Winterstück reservieren. Alle Infos zum
          Stück und den Vorstellungen geben wir ebenfalls ab dem 1. Dezember auf
          unserer Startseite bekannt.
        </p>

        <div className='mt-6'>
          <PremiereCountdown
            targetISO={WINTER_RELEASE_ISO}
            label='Bis zum Buchungsstart'
          />
        </div>

        <div className='ticket-actions mt-8 mb-0'>
          <Link href='/' className='ticket-button ticket-button-primary'>
            Zur Startseite <span aria-hidden>→</span>
          </Link>
          <a
            href='https://www.instagram.com/kolpingtheater_ramsen/'
            target='_blank'
            rel='noopener noreferrer'
            className='ticket-button'
          >
            Instagram <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </>
  )
}
