import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
}

// Setup development platform in an async context
if (process.env.NODE_ENV === 'development') {
  ;(async () => {
    await setupDevPlatform()
  })()
}

export default nextConfig
