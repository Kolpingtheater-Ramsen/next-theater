import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import { getBookingById } from '@/lib/db'
import { syncWalletPass } from '@/lib/google-wallet'
import { ticketJson } from '@/lib/ticket-http'
export const runtime='edge'
export async function POST(request:Request) {
  if(!(await requireAdminAuth(request))) return ticketJson({error:'Bitte melde dich an.'},401)
  try {
    const {env,ctx}=getRequestContext()
    const {bookingId}=await request.json() as {bookingId?:string}
    if(typeof bookingId !== 'string') return ticketJson({error:'Ticket fehlt.'},400)
    const result=await env.DB.prepare("UPDATE bookings SET status = ?, checked_in_at = NULL, version = version + 1, wallet_sync_pending = 1 WHERE id = ? AND status = ?")
      .bind('confirmed',bookingId,'checked_in').run()
    if(!result.meta.changes) return ticketJson({error:'Ticket nicht gefunden oder Status bereits geändert.'},409)
    ctx.waitUntil(syncWalletPass(env,bookingId))
    return ticketJson({success:true,booking:await getBookingById(env.DB,bookingId)})
  } catch { return ticketJson({error:'Der Ticketstatus konnte nicht geändert werden.'},503) }
}
