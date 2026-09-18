import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import { getBookingById } from '@/lib/db'
import { ticketJson } from '@/lib/ticket-http'
export const runtime='edge'
export async function GET(request:Request) {
  if(!(await requireAdminAuth(request))) return ticketJson({error:'Bitte melde dich an.'},401)
  const code=new URL(request.url).searchParams.get('code') || ''
  const {env}=getRequestContext()
  let id=code
  if(code.startsWith('KTR1:')) {
    const row=await env.DB.prepare('SELECT id FROM bookings WHERE admission_token = ?').bind(code.slice(5)).first<{id:string}>()
    id=row?.id || ''
  }
  const booking=await getBookingById(env.DB,id)
  return booking ? ticketJson({success:true,booking}) : ticketJson({error:'Ticket nicht gefunden.'},404)
}
