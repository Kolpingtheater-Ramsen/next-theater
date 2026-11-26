'use client'

import Link from 'next/link'
import PremiereCountdown from '@/components/PremiereCountdown'
import WinterReleaseRefresh from '@/components/WinterReleaseRefresh'
import TicketSupportNotice from '@/components/booking/TicketSupportNotice'
import { WINTER_RELEASE_ISO } from '@/lib/winter-release'

export default function BookingComingSoon() {
  return (
    <>
      <WinterReleaseRefresh />
      <header className='ticket-intro'>
        <div>
          <p className='ticket-eyebrow'>Kolpingtheater Ramsen · Kreativbühne</p>
          <h1 className='ticket-heading'>
            Reservierung ab <em>1. Dezember.</em>
          </h1>
          <p className='ticket-muted'>
            Unsere Online-Sitzplatzreservierung für „Romeo &amp; Julia – Ein Minidrama“ öffnet am 1. Dezember 2026.
          </p>
          <Link href='/booking/vorab' prefetch={false} className='ticket-back mt-2 underline underline-offset-4'>
            Vorabreservierung fürs Theaterteam
          </Link>
        </div>
        <span className='ticket-badge'>Eintritt frei</span>
      </header>

      <section className='ticket-panel' aria-labelledby='booking-release-heading'>
        <h2 id='booking-release-heading' className='ticket-section-title'>
          Buchungsstart am 1. Dezember 2026
        </h2>
        <p className='ticket-muted mt-2 max-w-2xl'>
          Ab Dienstag, 1. Dezember 2026 um 00:00 Uhr kannst du hier deine
          kostenlosen festen Sitzplätze (78 Plätze pro Vorstellung, Reihen A bis H)
          für „Romeo &amp; Julia – Ein Minidrama“ am 27. und 28. Dezember 2026
          (jeweils 17:00 &amp; 19:30 Uhr, ca. 50 Minuten) im Pfarrheim in Ramsen
          reservieren. Alle Infos zum Stück und häufige Fragen findest du schon
          jetzt auf unserer Startseite.
        </p>

        <div className='mt-6'>
          <PremiereCountdown
            targetISO={WINTER_RELEASE_ISO}
            label='Bis zum Buchungsstart'
          />
        </div>

        <div className='ticket-actions mt-8 mb-0'>
          <Link href='/' className='ticket-button ticket-button-primary'>
            Infos &amp; Termine ansehen <span aria-hidden>→</span>
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

      <TicketSupportNotice />
    </>
  )
}
