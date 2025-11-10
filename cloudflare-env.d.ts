// Cloudflare Next.js on Pages environment type augmentation
/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database
    ADMIN_PASSWORD_HASH?: string
    RESEND_API_KEY?: string
    FROM_EMAIL?: string
    REPLY_TO_EMAIL?: string
    THEATER_NAME?: string
  }
}

export {}

