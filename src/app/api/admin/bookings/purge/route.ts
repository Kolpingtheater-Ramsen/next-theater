import { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAdminAuth } from '@/lib/admin-auth'
import { purgeExpiredBookings } from '@/lib/booking-retention'
import { ticketJson } from '@/lib/ticket-http'

export const runtime = 'edge'

// Manual retry of the same cleanup that runs automatically every five minutes.
export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdminAuth(request))) return ticketJson({ success: false, error: 'Unauthorized' }, 401)
    const result = await purgeExpiredBookings(getRequestContext().env.DB)
    return ticketJson({ success: true, ...result,
      message: `${result.deletedBookings} Buchungen und ${result.deletedSeats} Sitzplätze gelöscht.`,
    })
  } catch {
    console.error('Expired ticket cleanup failed')
    return ticketJson({ success: false, error: 'Fehler beim Löschen alter Buchungen' }, 500)
  }
}
