import { getRequestContext } from '@cloudflare/next-on-pages'
import type { D1Database } from '@/types/env'
import { digest, sameOrigin } from './ticket-http'

export async function verifyAdminPassword(password: string, expectedHash?: string) {
  if (!expectedHash || typeof password !== 'string') return false
  return (await digest(password)) === expectedHash
}

export async function generateAdminToken(db: D1Database) {
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`
  await db.batch([
    db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(Date.now()),
    db.prepare('INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)')
      .bind(await digest(token), Date.now() + 86400000),
  ])
  return token
}

export function extractAdminToken(request: Request): string | null {
  const header = request.headers.get('authorization')
  if (header?.startsWith('Bearer ')) return header.slice(7)
  try {
    const cookie = request.headers.get('cookie')?.split(';').map(c => c.trim()).find(c => c.startsWith('admin-token='))
    return cookie ? decodeURIComponent(cookie.slice('admin-token='.length)) : null
  } catch { return null }
}

export async function requireAdminAuth(request: Request) {
  const token = extractAdminToken(request)
  if (!token || !/^[a-f0-9-]{72}$/.test(token) || !sameOrigin(request)) return false
  const { env } = getRequestContext()
  const session = await env.DB.prepare('SELECT expires_at FROM admin_sessions WHERE token_hash = ?')
    .bind(await digest(token)).first<{ expires_at: number }>()
  return !!session && session.expires_at > Date.now()
}

export async function revokeAdminToken(request: Request) {
  const token = extractAdminToken(request)
  if (token) await getRequestContext().env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await digest(token)).run()
}
