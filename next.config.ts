import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

if (process.env.NODE_ENV === 'development') {
  // Enable Cloudflare bindings during `pnpm dev`
  await setupDevPlatform()
}

const nextConfig: NextConfig = {
  images: {
    // Disable Next.js image optimization so images are served directly from /public
    // This is required for Cloudflare Pages with next-on-pages
    unoptimized: true,
  },
}

export default nextConfig
