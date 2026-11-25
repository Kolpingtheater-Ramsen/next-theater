import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/engagementpreis-2026', destination: '/', permanent: true }]
  },
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
