import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookingById } from '@/lib/db'
import { emailConfig,sendBookingConfirmation } from '@/lib/email'
import { rateLimit,sameOrigin,ticketJson } from '@/lib/ticket-http'
export const runtime='edge'
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
  if(!sameOrigin(request)) return ticketJson({error:'Ungültige Anfrage.'},403)
  try {
    const {env}=getRequestContext()
    const booking=await getBookingById(env.DB,(await params).id)
    if(!booking?.play || booking.status!=='confirmed') return ticketJson({error:'Aktives Ticket nicht gefunden.'},404)
    if(!(await rateLimit(env.DB,`email:${booking.id}`,3,3600))) return ticketJson({error:'Die E-Mail wurde bereits mehrfach angefordert. Bitte prüfe auch deinen Spam-Ordner.'},429)
    const sent=await sendBookingConfirmation(booking,booking.play,booking.seats,emailConfig(env),new URL(request.url).origin)
    await env.DB.prepare('UPDATE bookings SET email_status = ? WHERE id = ?').bind(sent.status,booking.id).run()
    return ticketJson({success:sent.success,emailStatus:sent.status,...(!sent.success && {error:'Die E-Mail konnte nicht versendet werden. Bitte speichere deinen Ticketlink.'})},sent.success?200:503)
  } catch { return ticketJson({error:'Die E-Mail konnte nicht versendet werden. Bitte speichere deinen Ticketlink.'},503) }
}
