import { NextResponse } from 'next/server'
import { revokeAdminToken } from '@/lib/admin-auth'
import { sameOrigin } from '@/lib/ticket-http'
export const runtime = 'edge'
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 })
  await revokeAdminToken(request)
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin-token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
