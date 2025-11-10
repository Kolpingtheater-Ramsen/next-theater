// Cloudflare Next.js on Pages environment type augmentation
/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database
    ADMIN_PASSWORD_HASH?: string
  }
}

export {}

