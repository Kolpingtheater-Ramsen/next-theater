import { NextResponse } from 'next/server'
import type { D1Database } from '@/types/env'

export function ticketJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' } })
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return (!origin || origin === new URL(request.url).origin) && request.headers.get('sec-fetch-site') !== 'cross-site'
}

export async function digest(value: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function rateLimit(db: D1Database, key: string, max: number, windowSeconds: number) {
  const now = Math.floor(Date.now() / 1000)
  const hashed = await digest(key)
  const row = await db.prepare(`INSERT INTO ticket_rate_limits (key, hits, resets_at) VALUES (?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET hits = CASE WHEN resets_at <= ? THEN 1 ELSE hits + 1 END,
    resets_at = CASE WHEN resets_at <= ? THEN ? ELSE resets_at END RETURNING hits`)
    .bind(hashed, now + windowSeconds, now, now, now + windowSeconds).first<{ hits: number }>()
  return !!row && row.hits <= max
}
