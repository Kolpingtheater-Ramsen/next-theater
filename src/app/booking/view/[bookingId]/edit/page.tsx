'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SeatSelection from '@/components/booking/SeatSelection'
import ConfirmDialog from '@/components/booking/ConfirmDialog'
import { formatDay, hasStarted, seatLabel } from '@/lib/tickets'
import type { BookingWithSeats } from '@/types/database'

export const runtime = 'edge'

export default function EditBookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingWithSeats | null>(null)
  const [seats, setSeats] = useState<number[]>([])
  const [booked, setBooked] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')
  const endpoint = `/api/bookings/${encodeURIComponent(bookingId)}`
  const load = useCallback(async () => {
    setLoading(true); setReady(false); setError('')
    try {
      const response = await fetch(endpoint, { cache: 'no-store' })
      const data = await response.json() as { success: boolean; booking: BookingWithSeats; error?: string }
      if (!response.ok || !data.booking?.play) throw new Error(data.error || 'Ticket nicht gefunden.')
      setBooking(data.booking)
      setSeats(data.booking.seats)
      if (data.booking.status !== 'confirmed' || hasStarted(data.booking.play)) return
      const availability = await fetch(`/api/plays/${data.booking.play_id}/seats`, { cache: 'no-store' })
      const result = await availability.json() as { success: boolean; bookedSeats: number[] }
      if (!availability.ok || !result.success) throw new Error('Die freien Plätze konnten nicht geladen werden. Bitte versuche es erneut.')
      setBooked(result.bookedSeats.filter((seat: number) => !data.booking.seats.includes(seat)))
      setReady(true)
    } catch (err) { setError(err instanceof Error ? err.message : 'Das Ticket konnte nicht geladen werden.') }
    finally { setLoading(false) }
  }, [endpoint])
  useEffect(() => { void load() }, [load])
  async function save() {
    if (!booking || !ready || busy) return
    setBusy(true); setError('')
    try {
      const response = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seats, version: booking.version || 0 }) })
      const data = await response.json() as { success: boolean; code?: string; error?: string; bookedSeats?: number[] }
      if (!response.ok || !data.success) {
        if (data.code === 'changed') { setReady(false) }
        else if (data.bookedSeats) {
          const occupied = data.bookedSeats.filter((seat: number) => !booking.seats.includes(seat))
          setBooked(occupied)
          setSeats(current => current.filter(seat => !occupied.includes(seat)))
        }
        throw new Error(data.error || 'Die Änderung konnte nicht gespeichert werden.')
      }
      router.push(`/booking/view/${bookingId}`)
    } catch (err) { setError(err instanceof Error ? err.message : 'Die Verbindung wurde unterbrochen. Bitte lade dein Ticket neu und prüfe die reservierten Plätze.') }
    finally { setBusy(false); setConfirm(false) }
  }
  const editable = booking?.play && booking.status === 'confirmed' && !hasStarted(booking.play)
  const changed = booking && JSON.stringify([...seats].sort((a,b) => a-b)) !== JSON.stringify([...booking.seats].sort((a,b) => a-b))
  return <>
    <Link className='ticket-back' href={`/booking/view/${bookingId}`}>← Zurück zu deinem Ticket</Link>
    <p className='ticket-eyebrow'>Deine Reservierung</p><h1 className='ticket-heading'>Plätze ändern</h1>
    {booking?.play && <p className='ticket-muted'>{booking.play.title} · {formatDay(booking.play.date)} · {booking.play.time} Uhr</p>}
    {error && <div role='alert' className='ticket-error'>{error}</div>}
    {loading ? <p className='ticket-empty' role='status'>Deine Plätze werden geladen …</p> : !editable ? <p className='ticket-notice'>Diese Buchung kann nicht mehr geändert werden. Bitte wende dich bei Fragen an das Theater.</p> : !ready ? <button className='ticket-button' onClick={load}>Ticket und freie Plätze erneut laden</button> : <>
      <p className='ticket-notice'>Bisher reserviert: <strong>{booking.seats.map(seatLabel).join(' · ')}</strong>. Deine bisherigen Plätze bleiben reserviert, bis du die Änderung bestätigst.</p>
      <SeatSelection totalSeats={booking.play!.total_seats} selectedSeats={seats} bookedSeats={booked} onChange={setSeats} disabled={busy} continueLabel='Änderung prüfen' onContinue={() => { if (changed) setConfirm(true); else setError('Deine Auswahl ist unverändert.') }} />
    </>}
    {!loading && !booking && <button className='ticket-button' onClick={load}>Erneut laden</button>}
    {confirm && <ConfirmDialog title='Diese Plätze reservieren?' confirmLabel='Änderung speichern' busy={busy} onCancel={() => setConfirm(false)} onConfirm={save}><p>Neue Auswahl: <strong>{seats.map(seatLabel).join(' · ')}</strong>.</p><p className='mt-3'>Nicht mehr ausgewählte Plätze werden wieder freigegeben.</p></ConfirmDialog>}
  </>
}
