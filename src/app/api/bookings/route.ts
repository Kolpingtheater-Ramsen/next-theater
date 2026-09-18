import { getRequestContext } from '@cloudflare/next-on-pages'
import { createBooking, getBookingByRequestKey, getBookedSeatsForPlay, getPlayById } from '@/lib/db'
import { emailConfig, sendBookingConfirmation } from '@/lib/email'
import { sendDiscordSeatUpdate } from '@/lib/discord'
import { isBookingOpen, validSeats } from '@/lib/tickets'
import { seatPolicy } from '@/lib/seat-policy'
import { rateLimit, sameOrigin, ticketJson } from '@/lib/ticket-http'

export const runtime = 'edge'
export async function POST(request: Request) {
  if (!sameOrigin(request)) return ticketJson({ error: 'Ungültige Anfrage.' },403)
  try {
    const { env } = getRequestContext()
    const body = await request.json() as Record<string,unknown>
    const { playId, seats, requestKey } = body
    if (typeof playId !== 'string' || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof requestKey !== 'string' || !/^[a-f0-9-]{36}$/.test(requestKey)) {
      return ticketJson({ error: 'Bitte prüfe deine Angaben.' },400)
    }
    const name = body.name.trim(), email = body.email.trim().toLowerCase()
    if (name.length < 2 || name.length > 120) return ticketJson({ error: 'Bitte gib deinen vollständigen Namen ein (2 bis 120 Zeichen).', field: 'name' },400)
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ticketJson({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.', field: 'email' },400)
    const existing = await getBookingByRequestKey(env.DB,requestKey)
    const replay = (booking: NonNullable<typeof existing>) => {
      if (booking.play_id !== playId || booking.email !== email || booking.name !== name || !Array.isArray(seats) || JSON.stringify([...booking.seats].sort((a,b)=>a-b)) !== JSON.stringify([...seats].sort((a,b)=>a-b))) {
        return ticketJson({ error: 'Diese Anfrage wurde schon verarbeitet. Bitte öffne dein Ticket oder starte eine neue Buchung.' },409)
      }
      return ticketJson({ success: true, bookingId: booking.id, emailStatus: booking.email_status })
    }
    if (existing) return replay(existing)
    if (!(await rateLimit(env.DB,`book:${request.headers.get('cf-connecting-ip') || 'local'}`,30,900))) return ticketJson({ error: 'Zu viele Anfragen. Bitte versuche es später erneut.' },429)
    const play = await getPlayById(env.DB,playId)
    if (!play || !isBookingOpen(play)) return ticketJson({ error: 'Diese Vorstellung ist nicht zur Buchung geöffnet.' },409)
    if (!validSeats(seats,play.total_seats)) return ticketJson({ error: 'Bitte wähle ein bis fünf verfügbare Sitzplätze.' },400)
    const bookedSeats = await getBookedSeatsForPlay(env.DB,play.id)
    if (seats.some(seat=>bookedSeats.includes(seat))) {
      // The first copy of this request may have committed since our initial lookup.
      const completed = await getBookingByRequestKey(env.DB,requestKey)
      if (completed) return replay(completed)
      return ticketJson({ error: 'Ein Platz wurde gerade reserviert. Bitte prüfe deine Auswahl.', code:'seat_conflict', bookedSeats },409)
    }
    const policy = seatPolicy(play.total_seats,bookedSeats,seats)
    if (policy.issue) return ticketJson({ error:policy.issue.message, code:'seat_policy', reason:policy.issue.code, bookedSeats },409)
    const id = `booking-${crypto.randomUUID()}`
    const result = await createBooking(env.DB,{id,playId,name,email,seats,requestKey,admissionToken:crypto.randomUUID(),bookedSeats})
    if (!result.success) {
      // Another identical request may have committed while this request was waiting.
      const completed = await getBookingByRequestKey(env.DB,requestKey)
      if (completed) return replay(completed)
      if (result.error === 'duplicate_booking') return ticketJson({ error:'Für diese E-Mail-Adresse gibt es bereits eine Buchung für diesen Termin. Öffne den Ticketlink aus deiner Bestätigung, um Plätze zu ändern.', code:'duplicate_booking' },409)
      if (result.error === 'seat_conflict') return ticketJson({ error:'Ein Platz wurde gerade reserviert. Bitte prüfe deine Auswahl.', code:'seat_conflict', bookedSeats:await getBookedSeatsForPlay(env.DB,play.id) },409)
      return ticketJson({ error:'Die Buchung konnte nicht gespeichert werden. Deine Angaben bleiben erhalten.' },503)
    }
    // A reservation stays successful even when a notification fails.
    const sent = await sendBookingConfirmation({id,name,email},play,seats,emailConfig(env),new URL(request.url).origin)
    try {
      await env.DB.prepare('UPDATE bookings SET email_status = ? WHERE id = ?').bind(sent.status,id).run()
    } catch { console.error('Could not record email delivery status') }
    getRequestContext().ctx.waitUntil(sendDiscordSeatUpdate({webhookUrl:env.DISCORD_WEBHOOK_URL,showLabel:play.display_date,seatCount:seats.length,availableSeatCount:play.total_seats-bookedSeats.length-seats.length,action:'booked'}))
    return ticketJson({success:true,bookingId:id,emailStatus:sent.status},201)
  } catch (error) {
    if (error instanceof SyntaxError) return ticketJson({error:'Ungültige Anfrage.'},400)
    console.error('Booking request failed')
    return ticketJson({error:'Die Verbindung ist gerade gestört. Bitte versuche dieselbe Anfrage noch einmal.'},503)
  }
}
