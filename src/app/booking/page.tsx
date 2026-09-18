'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SeatSelection from '@/components/booking/SeatSelection'
import BookingForm from '@/components/booking/BookingForm'
import BookingSummary from '@/components/booking/BookingSummary'
import { DEFAULT_VENUE, formatDay, MAX_SEATS } from '@/lib/tickets'
import type { PlayWithAvailability } from '@/types/database'

type Step = 'date' | 'seats' | 'details'

export default function BookingPage() {
  const router = useRouter()
  const [plays, setPlays] = useState<PlayWithAvailability[]>([])
  const [play, setPlay] = useState<PlayWithAvailability | null>(null)
  const [step, setStep] = useState<Step>('date')
  const [seats, setSeats] = useState<number[]>([])
  const [booked, setBooked] = useState<number[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [seatLoading, setSeatLoading] = useState(false)
  const [seatsReady, setSeatsReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [field, setField] = useState<string>()
  const request = useRef({ payload: '', key: '' })
  const seatRequest = useRef(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const submitting = useRef(false)

  async function loadPlays() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/plays', { cache: 'no-store' })
      const data = await response.json() as { success: boolean; plays: PlayWithAvailability[] }
      if (!response.ok || !data.success) throw new Error()
      setPlays(data.plays)
    } catch { setError('Die Termine konnten nicht geladen werden. Bitte versuche es erneut.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void loadPlays() }, [])
  useEffect(() => {
    const back = () => {
      const hash = window.location.hash.slice(1)
      setStep(hash === 'details' && play && seats.length ? 'details' : hash === 'seats' && play ? 'seats' : 'date')
      setError('')
    }
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [play, seats.length])

  function go(next: Step) {
    setStep(next)
    setError('')
    window.history.pushState(null, '', next === 'date' ? '/booking' : `#${next}`)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }) })
  }
  async function loadSeats(selected: PlayWithAvailability) {
    const current = ++seatRequest.current
    setSeatLoading(true)
    setSeatsReady(false)
    setError('')
    try {
      const response = await fetch(`/api/plays/${selected.id}/seats`, { cache: 'no-store' })
      const data = await response.json() as { success: boolean; bookedSeats: number[] }
      if (!response.ok || !data.success) throw new Error()
      if (current !== seatRequest.current) return
      setBooked(data.bookedSeats)
      setSeats(existing => existing.filter(seat => !data.bookedSeats.includes(seat)))
      setSeatsReady(true)
    } catch {
      if (current === seatRequest.current) setError('Die freien Plätze konnten nicht geladen werden. Bitte lade sie erneut, bevor du buchst.')
    } finally { if (current === seatRequest.current) setSeatLoading(false) }
  }
  function choose(selected: PlayWithAvailability) {
    if (play?.id !== selected.id) setSeats([])
    setPlay(selected)
    go('seats')
    void loadSeats(selected)
  }
  async function reserve() {
    if (!play || submitting.current || !seatsReady || !seats.length) return
    submitting.current = true
    setBusy(true)
    setError('')
    setField(undefined)
    const payload = JSON.stringify({ playId: play.id, seats, name: name.trim(), email: email.trim() })
    if (request.current.payload !== payload) request.current = { payload, key: crypto.randomUUID() }
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...JSON.parse(payload), requestKey: request.current.key }),
      })
      const data = await response.json() as { success: boolean; bookingId: string; code?: string; bookedSeats: number[]; field?: string; error?: string }
      if (!response.ok || !data.success) {
        if (data.code === 'seat_conflict') {
          setBooked(data.bookedSeats)
          setSeats(existing => existing.filter(seat => !data.bookedSeats.includes(seat)))
          go('seats')
        }
        setField(data.field)
        setError(data.error || 'Deine Buchung konnte nicht gespeichert werden. Bitte versuche es erneut.')
        return
      }
      router.push(`/booking/view/${encodeURIComponent(data.bookingId)}?new=true`)
    } catch { setError('Die Verbindung wurde unterbrochen. Deine Angaben bleiben erhalten. Bitte versuche es erneut.') }
    finally { setBusy(false); submitting.current = false }
  }

  const days = [...new Set(plays.map(item => item.date))]
  return <>
    {step === 'date' && (!plays.length || plays[0].id.startsWith('romeo-julia-2026-')) && <Image
      className='ticket-production-banner' src='/img/banners/romeo-und-julia-2026.webp'
      alt='Romeo und Julia reichen sich im Mondlicht über einen Balkon die Hände.'
      width={2172} height={724} priority unoptimized
    />}
    <header className='ticket-intro'>
      <div><p className='ticket-eyebrow'>Kolpingtheater Ramsen · Wintertheater</p><h1 className='ticket-heading'>{play?.title || plays[0]?.title || 'Romeo und Julia'}</h1><p className='ticket-muted'>Ein Abend im Theater. Deine Plätze warten auf dich.</p></div>
      <span className='ticket-badge'>Eintritt frei</span>
    </header>
    <ol className='ticket-steps' aria-label='Buchungsschritte'>
      {(['date', 'seats', 'details'] as const).map((item, i) => <li key={item} aria-current={step === item ? 'step' : undefined}>{['Termin', 'Plätze', 'Deine Daten'][i]}</li>)}
    </ol>
    {step !== 'date' && <button type='button' className='ticket-back' disabled={busy} onClick={() => go(step === 'details' ? 'seats' : 'date')}>← {step === 'details' ? 'Zurück zu deinen Plätzen' : 'Anderen Termin wählen'}</button>}
    <h2 className='ticket-section-title' ref={heading} tabIndex={-1}>{step === 'date' ? 'Wann kommst du ins Theater?' : step === 'seats' ? 'Such dir deine Plätze aus' : 'Fast geschafft.'}</h2>
    {play && step !== 'date' && <p className='ticket-muted'>{formatDay(play.date, true)} · {play.time} Uhr</p>}
    {error && <div className='ticket-error' role='alert' id='ticket-server-error'>{error}{step === 'date' && <button className='ticket-back block' onClick={loadPlays}>Erneut versuchen</button>}</div>}
    {step === 'date' && <>
      {loading ? <p className='ticket-empty' role='status'>Die Vorstellungen werden geladen …</p> : !plays.length && !error ? <div className='ticket-empty'><p>Aktuell sind keine Vorstellungen zur Buchung verfügbar.</p><p className='ticket-muted mt-2'>Bitte schau später wieder vorbei.</p></div> : <div className='ticket-day-grid'>
        {days.map(date => <section className='ticket-day' key={date} aria-label={formatDay(date, true)}>
          <div className='ticket-day-header'><span className='ticket-day-number'>{Number(date.slice(-2))}</span><div><span className='ticket-day-name'>{new Date(`${date}T12:00:00Z`).toLocaleDateString('de-DE', { weekday: 'long', timeZone: 'UTC' })}</span><span className='ticket-day-month'>{new Date(`${date}T12:00:00Z`).toLocaleDateString('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</span></div></div>
          <div className='ticket-times'>{plays.filter(item => item.date === date).map(item => <button className='ticket-time' key={item.id} disabled={item.is_sold_out || item.booking_open === 0} onClick={() => choose(item)} aria-label={`${formatDay(item.date)}, ${item.time} Uhr, ${item.booking_open === 0 ? 'Buchung geschlossen' : item.is_sold_out ? 'ausgebucht' : `${item.available_seats} Plätze frei`}`}><span><strong>{item.time} <span className='text-sm'>Uhr</span></strong><small>{item.booking_open === 0 ? 'Buchung geschlossen' : item.is_sold_out ? 'Ausgebucht' : `${item.available_seats} Plätze frei`}</small></span><span className='ticket-time-arrow' aria-hidden='true'>↗</span></button>)}</div>
        </section>)}
      </div>}
      <div className='ticket-notes'><div><strong>Dein Besuch</strong><p>{plays[0]?.venue || DEFAULT_VENUE}</p></div><div><strong>Zusammen ins Theater</strong><p>Bis zu {MAX_SEATS} Plätze pro Buchung. Alle Plätze einer Buchung werden gemeinsam eingecheckt.</p></div><div><strong>Flexibel bleiben</strong><p>Über deinen privaten Ticketlink kannst du Plätze ändern oder freigeben, solange die Vorstellung noch nicht begonnen hat.</p></div></div>
    </>}
    {step === 'seats' && play && <>
      {seatLoading ? <p className='ticket-empty' role='status'>Freie Plätze werden geladen …</p> : !seatsReady ? <button className='ticket-button' onClick={() => loadSeats(play)}>Plätze erneut laden</button> : <SeatSelection totalSeats={play.total_seats} bookedSeats={booked} selectedSeats={seats} onChange={setSeats} onContinue={() => go('details')} />}
    </>}
    {step === 'details' && play && <div className='ticket-form-grid'>
      <BookingForm name={name} email={email} onChange={(key, value) => { (key === 'name' ? setName : setEmail)(value); setField(undefined) }} onSubmit={reserve} busy={busy} serverField={field} />
      <BookingSummary play={play} seats={seats} onEdit={busy ? undefined : () => go('seats')} />
    </div>}
  </>
}
