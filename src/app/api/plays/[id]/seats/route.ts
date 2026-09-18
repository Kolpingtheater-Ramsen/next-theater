import { getRequestContext } from '@cloudflare/next-on-pages'
import { getBookedSeatsForPlay,getPlayById } from '@/lib/db'
import { ticketJson } from '@/lib/ticket-http'
export const runtime = 'edge'
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const db=getRequestContext().env.DB, id=(await params).id
    const play=await getPlayById(db,id)
    if(!play || play.published === 0) return ticketJson({success:false,error:'Vorstellung nicht gefunden.'},404)
    const bookedSeats=await getBookedSeatsForPlay(db,id)
    return ticketJson({success:true,bookedSeats,totalSeats:play.total_seats,availableSeats:Math.max(0,play.total_seats-bookedSeats.length)})
  } catch { return ticketJson({success:false,error:'Die Sitzplätze konnten nicht geladen werden. Bitte versuche es erneut.'},503) }
}
