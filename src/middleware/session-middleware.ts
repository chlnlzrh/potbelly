/**
 * Session Logging Middleware
 * Automatic session tracking and security monitoring for Next.js
 * Follows CLAUDE.md security and performance requirements
 */

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sessionLogger } from '@/lib/session-logger'
import { SessionAction, SessionMetadata } from '@/types/session-logging'

interface RouteConfig {
  action: SessionAction
  requiresAuth: boolean
  sensitiveRoute: boolean
  trackingEnabled: boolean
}

// Route configuration for automatic tracking
const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/': { 
    action: 'page_view', 
    requiresAuth: false, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/dashboard': { 
    action: 'page_view', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/tasks': { 
    action: 'page_view', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/team': { 
    action: 'page_view', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/admin': { 
    action: 'page_view', 
    requiresAuth: true, 
    sensitiveRoute: true, 
    trackingEnabled: true 
  },
  '/api/tasks': { 
    action: 'task_update', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/api/decisions': { 
    action: 'decision_made', 
    requiresAuth: true, 
    sensitiveRoute: true, 
    trackingEnabled: true 
  },
  '/api/contractors': { 
    action: 'contractor_contact', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/api/photos': { 
    action: 'photo_upload', 
    requiresAuth: true, 
    sensitiveRoute: false, 
    trackingEnabled: true 
  },
  '/api/ai': { 
    action: 'ai_query', 
    requiresAuth: true, 
    sensitiveRoute: true, 
    trackingEnabled: true 
  },
  '/api/admin': { 
    action: 'admin_action', 
    requiresAuth: true, 
    sensitiveRoute: true, 
    trackingEnabled: true 
  }
}

// Security patterns for request analysis
const SECURITY_PATTERNS = {
  sqlInjection: /('|(\\\')|;|--|\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
  xss: /(<script|javascript:|onload=|onerror=|onclick=)/i,
  pathTraversal: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\)/i,
  suspiciousHeaders: /(x-forwarded-host|x-original-url|x-rewrite-url)/i
}

/**
 * Session tracking middleware
 */
export async function sessionMiddleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl
  
  try {
    // Get session information
    const token = await getToken({ req: request })
    const sessionId = request.cookies.get('session-id')?.value || generateSessionId()
    const userId = token?.sub || 'anonymous'

    // Get route configuration
    const routeConfig = getRouteConfig(pathname)
    
    if (!routeConfig.trackingEnabled) {
      return NextResponse.next()
    }

    // Security checks
    const securityResult = performSecurityChecks(request)
    if (securityResult.blocked) {
      await sessionLogger.logSecurityEvent(
        sessionId,
        securityResult.eventType!,
        'high',
        securityResult.reason!,
        true,
        request
      )
      
      return new NextResponse('Security violation detected', { 
        status: 403,
        headers: { 'X-Security-Block': 'true' }
      })
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(sessionId, request)
    if (rateLimitResult.exceeded) {
      await sessionLogger.logSecurityEvent(
        sessionId,
        'brute_force_attempt',
        'medium',
        'Rate limit exceeded',
        true,
        request
      )
      
      return new NextResponse('Too many requests', { 
        status: 429,
        headers: { 'Retry-After': '60' }
      })
    }

    // Create session metadata
    const metadata: SessionMetadata = {
      page: pathname,
      feature: extractFeature(pathname),
      priority: routeConfig.sensitiveRoute ? 'high' : 'medium',
      businessContext: extractBusinessContext(request)
    }

    // Log the session activity
    await sessionLogger.logSession(
      userId,
      sessionId,
      routeConfig.action,
      metadata,
      request
    )

    // Continue with the request
    const response = NextResponse.next()
    
    // Add session tracking headers
    response.headers.set('X-Session-ID', sessionId)
    response.headers.set('X-Request-ID', generateRequestId())
    
    // Set session cookie if not exists
    if (!request.cookies.get('session-id')) {
      response.cookies.set('session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
    }

    // Log performance metrics
    const duration = Date.now() - startTime
    if (duration > 1000) { // Log slow requests
      await sessionLogger.logSession(
        userId,
        sessionId,
        'page_view',
        { 
          ...metadata, 
          businessContext: `Slow request: ${duration}ms` 
        },
        request
      )
    }

    return response

  } catch (error) {
    console.error('Session middleware error:', error)
    
    // Log the error but don't block the request
    try {
      const sessionId = request.cookies.get('session-id')?.value || 'unknown'
      await sessionLogger.logSecurityEvent(
        sessionId,
        'suspicious_activity',
        'medium',
        `Middleware error: ${error}`,
        false,
        request
      )
    } catch (logError) {
      console.error('Failed to log middleware error:', logError)
    }

    return NextResponse.next()
  }
}

/**
 * Get route configuration with fallback
 */
function getRouteConfig(pathname: string): RouteConfig {
  // Exact match first
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname]
  }

  // Pattern matching for API routes
  if (pathname.startsWith('/api/')) {
    return {
      action: 'page_view',
      requiresAuth: true,
      sensitiveRoute: pathname.includes('admin') || pathname.includes('ai'),
      trackingEnabled: true
    }
  }

  // Default configuration
  return {
    action: 'page_view',
    requiresAuth: false,
    sensitiveRoute: false,
    trackingEnabled: true
  }
}

/**
 * Perform security checks on request
 */
function performSecurityChecks(request: NextRequest): {
  blocked: boolean
  eventType?: string
  reason?: string
} {
  const url = request.url
  const headers = Object.fromEntries(request.headers.entries())
  const userAgent = request.headers.get('user-agent') || ''

  // Check for SQL injection
  if (SECURITY_PATTERNS.sqlInjection.test(url)) {
    return {
      blocked: true,
      eventType: 'sql_injection_attempt',
      reason: 'SQL injection pattern detected in URL'
    }
  }

  // Check for XSS
  if (SECURITY_PATTERNS.xss.test(url)) {
    return {
      blocked: true,
      eventType: 'xss_attempt',
      reason: 'XSS pattern detected in URL'
    }
  }

  // Check for path traversal
  if (SECURITY_PATTERNS.pathTraversal.test(url)) {
    return {
      blocked: true,
      eventType: 'suspicious_activity',
      reason: 'Path traversal attempt detected'
    }
  }

  // Check for suspicious headers
  const suspiciousHeaderFound = Object.keys(headers).some(header => 
    SECURITY_PATTERNS.suspiciousHeaders.test(header)
  )
  
  if (suspiciousHeaderFound) {
    return {
      blocked: false, // Don't block, but log
      eventType: 'suspicious_activity',
      reason: 'Suspicious headers detected'
    }
  }

  // Check for bot patterns
  const botPatterns = /bot|crawler|spider|scraper|curl|wget/i
  if (botPatterns.test(userAgent)) {
    return {
      blocked: false, // Don't block, but monitor
      eventType: 'suspicious_activity',
      reason: 'Bot activity detected'
    }
  }

  return { blocked: false }
}

/**
 * Check rate limiting
 */
async function checkRateLimit(sessionId: string, request: NextRequest): Promise<{
  exceeded: boolean
  current: number
  limit: number
}> {
  // Implement rate limiting logic
  // This is a simplified version - in production use Redis or similar
  const rateLimitKey = `rate_limit:${sessionId}`
  const windowMs = 60 * 1000 // 1 minute window
  const limit = 100 // 100 requests per minute

  try {
    // In production, use Redis or Vercel KV for distributed rate limiting
    const now = Date.now()
    const requests = [] // Would get from cache/Redis
    const recentRequests = requests.filter((time: number) => now - time < windowMs)
    
    if (recentRequests.length >= limit) {
      return { exceeded: true, current: recentRequests.length, limit }
    }

    // Add current request
    recentRequests.push(now)
    // Store back to cache/Redis

    return { exceeded: false, current: recentRequests.length, limit }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return { exceeded: false, current: 0, limit }
  }
}

/**
 * Extract feature from pathname
 */
function extractFeature(pathname: string): string {
  if (pathname.startsWith('/api/')) return 'api'
  if (pathname === '/') return 'home'
  if (pathname === '/dashboard') return 'dashboard'
  if (pathname === '/tasks') return 'tasks'
  if (pathname === '/team') return 'team'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'unknown'
}

/**
 * Extract business context from request
 */
function extractBusinessContext(request: NextRequest): string {
  const { searchParams } = request.nextUrl
  const taskId = searchParams.get('taskId')
  const contractorId = searchParams.get('contractorId')
  const filter = searchParams.get('filter')

  const context = []
  if (taskId) context.push(`task:${taskId}`)
  if (contractorId) context.push(`contractor:${contractorId}`)
  if (filter) context.push(`filter:${filter}`)

  return context.length > 0 ? context.join(', ') : ''
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}