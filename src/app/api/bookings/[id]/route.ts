import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookingById, cancelBooking, getBookedSeatsForPlay, updateBookingSeats } from '@/lib/db'
import { emailConfig, sendCancellationConfirmation, sendBookingModification } from '@/lib/email'
import { sendDiscordSeatUpdate } from '@/lib/discord'
import { hasStarted, validSeats } from '@/lib/tickets'
import { sameOrigin, ticketJson } from '@/lib/ticket-http'
import { syncWalletPass, walletConfigured } from '@/lib/google-wallet'

export const runtime = 'edge'
type Context = { params: Promise<{ id:string }> }
export async function GET(_request: Request,{params}:Context) {
  try {
    const {env} = getRequestContext()
    const booking = await getBookingById(env.DB,(await params).id)
    if (!booking) return ticketJson({error:'Buchung nicht gefunden. Bitte prüfe deinen Ticketlink.'},404)
    if (booking.wallet_sync_pending && booking.wallet_issued) getRequestContext().ctx.waitUntil(syncWalletPass(env,booking.id))
    const {request_key: _key, wallet_sync_pending: _pending, ...publicBooking} = booking
    void _key; void _pending
    return ticketJson({success:true,booking:publicBooking,walletAvailable:walletConfigured(env)})
  } catch { return ticketJson({error:'Dein Ticket konnte gerade nicht geladen werden. Bitte versuche es erneut.'},503) }
}

async function change(request:Request,{params}:Context,cancel:boolean) {
  if (!sameOrigin(request)) return ticketJson({error:'Ungültige Anfrage.'},403)
  try {
    const {env,ctx} = getRequestContext()
    const booking = await getBookingById(env.DB,(await params).id)
    if (!booking?.play) return ticketJson({error:'Buchung nicht gefunden.'},404)
    const body = await request.json() as { seats?:unknown; version?:number }
    if (booking.status !== 'confirmed' || hasStarted(booking.play)) return ticketJson({error:'Diese Buchung kann nicht mehr geändert werden. Bitte wende dich an das Theater.'},409)
    if (body.version !== (booking.version || 0)) return ticketJson({error:'Die Buchung wurde inzwischen geändert. Bitte lade dein Ticket erneut.',code:'changed'},409)
    if (!cancel && !validSeats(body.seats,booking.play.total_seats)) return ticketJson({error:'Bitte wähle ein bis fünf gültige Sitzplätze.'},400)
    const seats = body.seats as number[]
    const bookedSeats = cancel ? [] : await getBookedSeatsForPlay(env.DB,booking.play_id)
    if (!cancel) {
      const occupied = bookedSeats.filter(seat=>!booking.seats.includes(seat))
      if (seats.some(seat=>occupied.includes(seat))) return ticketJson({error:'Ein Platz wurde inzwischen reserviert. Bitte prüfe deine Auswahl.',code:'seat_conflict',bookedSeats},409)
    }
    const result = cancel ? await cancelBooking(env.DB,booking) : await updateBookingSeats(env.DB,booking,seats)
    if (!result.success) {
      const latest = await getBookingById(env.DB,booking.id)
      const changed = !latest || latest.version !== booking.version || latest.status !== 'confirmed'
      return ticketJson({error:changed ? 'Deine Buchung wurde inzwischen geändert. Bitte lade dein Ticket erneut.' : 'Ein Platz wurde inzwischen reserviert. Bitte prüfe die aktuelle Auswahl.',code:changed ? 'changed' : 'seat_conflict',bookedSeats:await getBookedSeatsForPlay(env.DB,booking.play_id)},409)
    }
    const updated = await getBookingById(env.DB,booking.id)
    const origin = new URL(request.url).origin
    ctx.waitUntil((async()=>{
      if (cancel) await sendCancellationConfirmation(booking,booking.play!,booking.seats,emailConfig(env),origin)
      else await sendBookingModification(booking,booking.play!,seats,booking.seats,emailConfig(env),origin)
    })())
    ctx.waitUntil((async()=>{
      const occupied = await getBookedSeatsForPlay(env.DB, booking.play_id)
      await sendDiscordSeatUpdate({webhookUrl:env.DISCORD_WEBHOOK_URL,showLabel:booking.play!.display_date,seatCount:cancel?booking.seats.length:Math.abs(seats.length-booking.seats.length),availableSeatCount:booking.play!.total_seats-occupied.length,action:cancel || seats.length<booking.seats.length?'cancelled':'booked'})
    })())
    ctx.waitUntil(syncWalletPass(env,booking.id))
    return ticketJson({success:true,booking:updated})
  } catch(error) {
    return ticketJson({error:error instanceof SyntaxError ? 'Ungültige Anfrage.' : 'Die Änderung konnte nicht gespeichert werden. Bitte versuche es erneut.'},error instanceof SyntaxError ? 400 : 503)
  }
}
export function PATCH(request:Request,context:Context) { return change(request,context,false) }
export function DELETE(request:Request,context:Context) { return change(request,context,true) }
