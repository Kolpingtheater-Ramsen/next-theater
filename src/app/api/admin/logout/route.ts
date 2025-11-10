import { NextResponse } from 'next/server'

/**
 * POST /api/admin/logout
 * Logs out admin user
 */
export const runtime = 'edge'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
  
  // Clear the admin token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire immediately
  })
  
  return response
}

