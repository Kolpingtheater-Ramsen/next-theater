import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getAllPlaysWithAvailability } from '@/lib/db'

/**
 * GET /api/plays
 * Returns all plays with availability information
 */
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Get D1 database from Cloudflare context
    const { env } = getRequestContext()
    const db = env.DB
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }
    
    // Fetch plays with availability
    const plays = await getAllPlaysWithAvailability(db)
    
    return NextResponse.json({
      success: true,
      plays
    })
  } catch (error) {
    console.error('Error fetching plays:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch plays',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

