import Link from 'next/link'

export default function TicketSupportNotice() {
  return (
    <aside className='ticket-support ticket-no-print' aria-label='Support und Kontakt'>
      <h2 className='ticket-support-title'>Fragen oder Support zur Reservierung?</h2>
      <p className='ticket-muted'>
        Bei Problemen mit deiner Buchung, bei Änderungswünschen oder Fragen zum
        Besuch hilft dir unser Team gerne weiter.
      </p>
      <div className='ticket-support-links'>
        <a href='mailto:kolpingtheaterramsen@gmail.com?subject=Ticket-Support%20Kreativb%C3%BChne'>
          kolpingtheaterramsen@gmail.com
        </a>
        <a
          href='https://www.instagram.com/kolpingtheater_ramsen/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Instagram (@kolpingtheater_ramsen)
        </a>
        <Link href='/contact'>Kontakt &amp; Anfahrt</Link>
      </div>
    </aside>
  )
}
