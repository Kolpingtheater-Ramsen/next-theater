import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookingById } from '@/lib/db'
import { createWalletLink,walletConfigured } from '@/lib/google-wallet'
import { hasStarted } from '@/lib/tickets'
import { rateLimit,sameOrigin,ticketJson } from '@/lib/ticket-http'
export const runtime='edge'
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
  if(!sameOrigin(request)) return ticketJson({error:'Ungültige Anfrage.'},403)
  try {
    const {env}=getRequestContext()
    if(!walletConfigured(env)) return ticketJson({error:'Google Wallet ist noch nicht verfügbar. Dein Online-Ticket bleibt gültig.'},503)
    const booking=await getBookingById(env.DB,(await params).id)
    if(!booking?.play || booking.status!=='confirmed' || hasStarted(booking.play)) return ticketJson({error:'Für dieses Ticket kann kein Wallet-Pass erstellt werden.'},409)
    if(!(await rateLimit(env.DB,`wallet:${booking.id}`,10,300))) return ticketJson({error:'Bitte warte einen Moment und versuche es erneut.'},429)
    return ticketJson({success:true,url:await createWalletLink(env,booking,new URL(request.url).origin)})
  } catch { return ticketJson({error:'Google Wallet ist gerade nicht erreichbar. Bitte versuche es erneut. Dein Ticket bleibt reserviert.'},503) }
}
