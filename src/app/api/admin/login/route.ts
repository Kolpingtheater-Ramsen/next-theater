import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, generateAdminToken } from '@/lib/admin-auth'
// @ts-ignore - Cloudflare specific import
import { getRequestContext } from '@cloudflare/next-on-pages'

/**
 * POST /api/admin/login
 * Authenticates admin user and returns token
 */
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body
    
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }
    
    // Get admin password hash from environment
    const { env } = getRequestContext()
    const adminPasswordHash = (env as any).ADMIN_PASSWORD_HASH
    
    // Verify password
    const isValid = await verifyAdminPassword(password, adminPasswordHash)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    // Generate token
    const token = generateAdminToken()
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    })
    
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
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

