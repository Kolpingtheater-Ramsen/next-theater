// Admin authentication utilities

/**
 * Simple password-based authentication for admin access
 * Password should be set in environment variable ADMIN_PASSWORD
 */

const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // Default: "admin" (change this!)

/**
 * Hash a password using SHA-256
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(password: string, envPasswordHash?: string): Promise<boolean> {
  const expectedHash = envPasswordHash || ADMIN_PASSWORD_HASH
  const providedHash = await hashPassword(password)
  return providedHash === expectedHash
}

/**
 * Generate auth token (simple JWT-like token)
 */
export function generateAdminToken(): string {
  const token = crypto.randomUUID()
  return btoa(JSON.stringify({
    token,
    type: 'admin',
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }))
}

/**
 * Verify admin token
 */
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token))
    return decoded.type === 'admin' && decoded.exp > Date.now()
  } catch {
    return false
  }
}

/**
 * Extract token from Authorization header or cookie
 */
export function extractAdminToken(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookie
  const cookieHeader = request.headers.get('Cookie')
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=')
        // URL-decode the cookie value
        return [key, decodeURIComponent(v.join('='))]
      })
    )
    return cookies['admin-token'] || null
  }
  
  return null
}

/**
 * Middleware to check admin authentication
 */
export function requireAdminAuth(request: Request): boolean {
  const token = extractAdminToken(request)
  return token ? verifyAdminToken(token) : false
}

