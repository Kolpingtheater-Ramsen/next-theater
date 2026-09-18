import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import { syncPendingWalletPasses } from '@/lib/google-wallet'
import { ticketJson } from '@/lib/ticket-http'
export const runtime='edge'
export async function POST(request:Request) {
  if(!(await requireAdminAuth(request))) return ticketJson({error:'Nicht angemeldet.'},401)
  await syncPendingWalletPasses(getRequestContext().env)
  return ticketJson({success:true})
}
