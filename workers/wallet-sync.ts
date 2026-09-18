import { syncPendingWalletPasses } from '../src/lib/google-wallet'
export default {
  async scheduled(_event:unknown,env:CloudflareEnv) {
    await syncPendingWalletPasses(env)
  },
}
