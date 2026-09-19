import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, generateAdminToken } from '@/lib/admin-auth'
import { sameOrigin, rateLimit } from '@/lib/ticket-http'
import { getRequestContext } from '@cloudflare/next-on-pages'

/**
 * POST /api/admin/login
 * Authenticates admin user and returns token
 */
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { password?: string }
    const { password } = body
    
    if (!sameOrigin(request)) return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 403 })
    if (typeof password !== 'string' || password.length > 256 || !password) {
      return NextResponse.json(
        { success: false, error: 'Bitte das Passwort eingeben.' },
        { status: 400 }
      )
    }
    
    // Get admin password hash from environment
    const { env } = getRequestContext()
    const adminPasswordHash = env.ADMIN_PASSWORD_HASH
    if (!adminPasswordHash) return NextResponse.json({ error: 'Admin-Zugang nicht eingerichtet' }, { status: 503 })
    if (!(await rateLimit(env.DB, `login:${request.headers.get('cf-connecting-ip') || 'local'}`, 10, 900))) {
      return NextResponse.json({ error: 'Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.' }, { status: 429 })
    }
    
    // Verify password
    const isValid = await verifyAdminPassword(password, adminPasswordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Das Passwort ist nicht korrekt.' },
        { status: 401 }
      )
    }
    
    // Generate token
    const token = await generateAdminToken(env.DB)
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Angemeldet'
    }, { headers: { 'Cache-Control': 'private, no-store' } })
    
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Anmeldung fehlgeschlagen.' },
      { status: 500 }
    )
  }
}

