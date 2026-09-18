'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import ConfirmDialog from '@/components/booking/ConfirmDialog'
import { admissionCode, DEFAULT_VENUE, formatDay, hasStarted, seatLabel, ticketCalendar } from '@/lib/tickets'
import type { BookingWithSeats } from '@/types/database'

export const runtime = 'edge'

export default function BookingViewPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [wallet, setWallet] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [now, setNow] = useState(Date.now())
  const endpoint = `/api/bookings/${encodeURIComponent(bookingId)}`

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(endpoint, { cache: 'no-store' })
      const data = await response.json() as { success: boolean; booking: BookingWithSeats; walletAvailable: boolean; error?: string }
      if (!response.ok || !data.booking) throw new Error(data.error || 'Das Ticket konnte nicht geladen werden.')
      setBooking(data.booking)
      setWallet(data.walletAvailable)
    } catch (err) { setError(err instanceof Error ? err.message : 'Dein Ticket konnte nicht geladen werden.') }
    finally { setLoading(false) }
  }, [endpoint])
  useEffect(() => { void load() }, [load])
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id) }, [])

  async function action(kind: 'cancel' | 'email' | 'wallet') {
    if (!booking || busy) return
    setBusy(kind)
    setError('')
    setNotice('')
    try {
      const response = await fetch(kind === 'cancel' ? endpoint : `${endpoint}/${kind}`, {
        method: kind === 'cancel' ? 'DELETE' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: booking.version || 0 }),
      })
      const data = await response.json() as { success: boolean; booking: BookingWithSeats; code?: string; error?: string; emailStatus: string; url?: string }
      if (!response.ok || !data.success) {
        if (data.code === 'changed') await load()
        throw new Error(data.error || 'Das hat nicht geklappt. Bitte versuche es erneut.')
      }
      if (kind === 'cancel') { setBooking(data.booking); setNotice('Deine Buchung ist storniert. Die Plätze sind wieder frei.') }
      if (kind === 'email') { setBooking(current => current && { ...current, email_status: data.emailStatus }); setNotice('Die Bestätigung wurde zum Versand übergeben. Bitte prüfe auch deinen Spam-Ordner.') }
      if (kind === 'wallet' && typeof data.url === 'string' && data.url.startsWith('https://pay.google.com/gp/v/save/')) window.location.assign(data.url)
    } catch (err) { setError(err instanceof Error ? err.message : 'Die Verbindung wurde unterbrochen. Bitte versuche es erneut.') }
    finally { setBusy(''); setCancel(false) }
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(`${window.location.origin}/booking/view/${bookingId}`); setNotice('Dein privater Ticketlink wurde kopiert.') }
    catch { setNotice('Bitte speichere die Adresse dieser Seite als Lesezeichen.') }
  }
  function calendar() {
    if (!booking?.play) return
    const url = URL.createObjectURL(new Blob([ticketCalendar(booking.play, booking.admission_token || booking.play_id)], { type: 'text/calendar;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = `theater-${booking.play.date}-${booking.play.time.replace(':', '')}.ics`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  if (loading) return <p className='ticket-empty' role='status'>Dein Ticket wird geladen …</p>
  if (!booking?.play) return <div className='ticket-empty'><h1 className='ticket-section-title'>Dein Ticket</h1><p role='alert' className='ticket-muted'>{error || 'Buchung nicht gefunden. Bitte prüfe deinen Ticketlink.'}</p><button className='ticket-button mt-5' onClick={load}>Erneut laden</button><Link className='ticket-back block' href='/booking'>Zu den Vorstellungen</Link></div>
  const play = booking.play
  const past = hasStarted(play, now)
  const valid = booking.status === 'confirmed' && !past
  const status = booking.status === 'cancelled' ? 'Storniert' : booking.status === 'checked_in' ? 'Bereits eingecheckt' : past ? 'Vorstellung hat begonnen' : 'Reservierung bestätigt'
  return <div className='ticket-confirmed'>
    <div className='ticket-no-print'><Link className='ticket-back' href='/booking'>← Zu den Vorstellungen</Link>{valid && <p className='ticket-success-line'>Deine Plätze sind reserviert.</p>}</div>
    {error && <div role='alert' className='ticket-error ticket-no-print'>{error}</div>}
    {notice && <p role='status' className='ticket-notice ticket-no-print'>{notice}</p>}
    <article className='ticket-stub' aria-label='Dein Theaterticket'>
      <header className='ticket-stub-header'><p className='ticket-eyebrow'>Kolpingtheater Ramsen · Dein Ticket</p><h1>{play.title}</h1><span className='ticket-badge'>Eintritt frei</span></header>
      <div className={`ticket-status ${booking.status === 'cancelled' ? 'cancelled' : ''}`}>{status}</div>
      <div className='ticket-stub-body'>
        <div className='ticket-stub-details'><dl><div><dt>Vorstellung</dt><dd>{formatDay(play.date, true)}<br/><strong>{play.time} Uhr</strong></dd></div><div><dt>Spielort</dt><dd>{play.venue || DEFAULT_VENUE}</dd></div><div><dt>Reserviert für</dt><dd>{booking.name}</dd></div><div><dt>Deine Plätze</dt><dd><div className='ticket-chips'>{booking.seats.length ? booking.seats.map(seat => <span className='ticket-chip' key={seat}>{seatLabel(seat)}</span>) : 'Keine reservierten Plätze'}</div></dd></div></dl></div>
        <div className='ticket-stub-qr'>{valid && booking.admission_token ? <><div className='ticket-qr'><QRCodeSVG value={admissionCode(booking.admission_token)} size={200} level='M' title='QR-Code für den Einlass'/></div><p>Am Einlass vorzeigen.<br/>Gilt für alle {booking.seats.length} {booking.seats.length === 1 ? 'reservierten Platz' : 'reservierten Plätze'}.</p></> : <p>{booking.status === 'cancelled' ? 'Dieses Ticket ist nicht mehr gültig.' : booking.status === 'checked_in' ? 'Viel Freude bei der Vorstellung!' : 'Bitte wende dich an das Team am Einlass.'}</p>}</div>
      </div>
    </article>
    <div className='ticket-no-print'>
      {valid && <>
        <div className='ticket-actions'>
          <button type='button' className='ticket-button' onClick={() => window.print()}>Ticket drucken</button>
          <button type='button' className='ticket-button' onClick={calendar}>Zum Kalender hinzufügen</button>
          {wallet && <button type='button' className='ticket-wallet' disabled={!!busy} onClick={() => action('wallet')} aria-label='Zu Google Wallet hinzufügen'>
            {/* Official localized Google Wallet asset. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/img/google-wallet-de.svg' alt='Zu Google Wallet hinzufügen' width={250} height={48}/>
          </button>}
        </div>
        <div className='ticket-notice'><p>{booking.email_status === 'sent' ? `Die Bestätigung wurde an ${booking.email} zum Versand übergeben.` : booking.email_status === 'pending' ? 'Der E-Mail-Versand wird noch verarbeitet.' : 'Deine Plätze sind reserviert. Eine Bestätigung per E-Mail konnte noch nicht versendet werden.'}</p><p>Speichere deinen privaten Ticketlink. Darüber kannst du diese Buchung verwalten.</p><div className='ticket-actions mb-0'><button className='ticket-button' onClick={copyLink}>Ticketlink kopieren</button><button className='ticket-back' disabled={!!busy} onClick={() => action('email')}>{busy === 'email' ? 'Wird versendet …' : 'E-Mail erneut senden'}</button></div></div>
        <section className='ticket-management'><h2 className='ticket-section-title'>Deine Buchung verwalten</h2><p className='ticket-muted'>Pläne ändern sich. Du kannst deine Plätze vor Beginn ändern oder wieder freigeben.</p><div className='ticket-actions'><Link className='ticket-button' href={`/booking/view/${bookingId}/edit`}>Plätze ändern</Link><button className='ticket-button ticket-button-danger' disabled={!!busy} onClick={() => setCancel(true)}>Buchung stornieren</button></div></section>
      </>}
      {!valid && <Link href='/booking' className='ticket-button'>Zu den Vorstellungen</Link>}
    </div>
    {cancel && <ConfirmDialog title='Buchung stornieren?' onCancel={() => setCancel(false)} onConfirm={() => action('cancel')} busy={busy === 'cancel'} confirmLabel='Plätze freigeben'><p>Du gibst alle {booking.seats.length} Plätze für {formatDay(play.date)} um {play.time} Uhr frei. Das lässt sich nicht rückgängig machen.</p></ConfirmDialog>}
  </div>
}
