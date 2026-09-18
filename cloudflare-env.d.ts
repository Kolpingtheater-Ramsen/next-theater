// Cloudflare Next.js on Pages environment type augmentation
/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    GOOGLE_WALLET_ENABLED?: string
    GOOGLE_WALLET_ISSUER_ID?: string
    GOOGLE_WALLET_CLIENT_EMAIL?: string
    GOOGLE_WALLET_PRIVATE_KEY?: string
    DB: D1Database
    ADMIN_PASSWORD_HASH?: string
    RESEND_API_KEY?: string
    FROM_EMAIL?: string
    REPLY_TO_EMAIL?: string
    THEATER_NAME?: string
    DISCORD_WEBHOOK_URL?: string
  }
}

export {}

