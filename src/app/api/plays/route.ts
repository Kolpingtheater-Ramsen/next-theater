import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPlaysWithAvailability } from '@/lib/db'
import { ticketJson } from '@/lib/ticket-http'
export const runtime = 'edge'
export async function GET() {
  try { return ticketJson({success:true,plays:await getAllPlaysWithAvailability(getRequestContext().env.DB)}) }
  catch { return ticketJson({success:false,error:'Die Vorstellungen konnten gerade nicht geladen werden.'},503) }
}
