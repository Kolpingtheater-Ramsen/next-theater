import { syncPendingWalletPasses } from '../src/lib/google-wallet'
import { purgeExpiredBookings } from '../src/lib/booking-retention'
const worker = {
  async scheduled(_event:unknown,env:CloudflareEnv) {
    // Retention must run even while public Wallet issuance is disabled.
    const deleted = await purgeExpiredBookings(env.DB)
    if (deleted.deletedBookings) console.log('Expired ticket data deleted', {
      bookings: deleted.deletedBookings, seats: deleted.deletedSeats,
    })
    await syncPendingWalletPasses(env)
  },
}
export default worker
