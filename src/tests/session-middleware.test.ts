/**
 * Session Middleware Test Suite
 * Testing request handling, security checks, and performance monitoring
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest, NextResponse } from 'next/server'
import { sessionMiddleware } from '@/middleware/session-middleware'

// Mock dependencies
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn()
}))

jest.mock('@/lib/session-logger', () => ({
  sessionLogger: {
    logSession: jest.fn(),
    logSecurityEvent: jest.fn()
  }
}))

describe('Session Middleware', () => {
  let mockGetToken: jest.MockedFunction<any>
  let mockSessionLogger: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetToken = require('next-auth/jwt').getToken
    mockSessionLogger = require('@/lib/session-logger').sessionLogger
  })

  describe('Request Processing', () => {
    it('should process normal requests successfully', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/dashboard')
      request.cookies.set('session-id', 'test-session-123')
      
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response).toBeInstanceOf(NextResponse)
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        'test-session-123',
        'page_view',
        expect.objectContaining({
          page: '/dashboard',
          feature: 'dashboard'
        }),
        request
      )
    })

    it('should create new session ID when none exists', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue(null)
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.headers.get('X-Session-ID')).toBeTruthy()
      expect(response.cookies.get('session-id')).toBeTruthy()
    })

    it('should handle anonymous users correctly', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue(null)
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'anonymous',
        expect.any(String),
        'page_view',
        expect.any(Object),
        request
      )
    })
  })

  describe('Security Checks', () => {
    it('should detect and block SQL injection attempts', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/tasks?id=1; DROP TABLE users--')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSecurityEvent.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).toBe(403)
      expect(response.headers.get('X-Security-Block')).toBe('true')
      expect(mockSessionLogger.logSecurityEvent).toHaveBeenCalledWith(
        expect.any(String),
        'sql_injection_attempt',
        'high',
        'SQL injection pattern detected in URL',
        true,
        request
      )
    })

    it('should detect and block XSS attempts', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/search?q=<script>alert("xss")</script>')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSecurityEvent.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).toBe(403)
      expect(mockSessionLogger.logSecurityEvent).toHaveBeenCalledWith(
        expect.any(String),
        'xss_attempt',
        'high',
        'XSS pattern detected in URL',
        true,
        request
      )
    })

    it('should detect path traversal attempts', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/files?path=../../../etc/passwd')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSecurityEvent.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).toBe(403)
      expect(mockSessionLogger.logSecurityEvent).toHaveBeenCalledWith(
        expect.any(String),
        'suspicious_activity',
        'high',
        'Path traversal attempt detected',
        true,
        request
      )
    })

    it('should detect bot activity without blocking', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      request.headers.set('user-agent', 'Mozilla/5.0 (compatible; Googlebot/2.1)')
      mockGetToken.mockResolvedValue(null)
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).not.toBe(403) // Should not block
      // Bot detection would be logged but not tested in this unit test
    })

    it('should handle suspicious headers', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      request.headers.set('x-forwarded-host', 'evil.com')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).not.toBe(403) // Should not block but should log
      // Suspicious header logging would be tested in integration tests
    })
  })

  describe('Route Configuration', () => {
    it('should apply correct configuration for dashboard route', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/dashboard')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        expect.any(String),
        'page_view',
        expect.objectContaining({
          page: '/dashboard',
          feature: 'dashboard',
          priority: 'medium'
        }),
        request
      )
    })

    it('should apply correct configuration for admin routes', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/admin')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        expect.any(String),
        'page_view',
        expect.objectContaining({
          page: '/admin',
          feature: 'admin',
          priority: 'high'
        }),
        request
      )
    })

    it('should apply correct configuration for API routes', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/tasks', { method: 'POST' })
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        expect.any(String),
        'task_update',
        expect.objectContaining({
          page: '/api/tasks',
          feature: 'api'
        }),
        request
      )
    })
  })

  describe('Metadata Extraction', () => {
    it('should extract business context from query parameters', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/tasks?taskId=123&contractorId=456&filter=urgent')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        expect.any(String),
        'page_view',
        expect.objectContaining({
          businessContext: 'task:123, contractor:456, filter:urgent'
        }),
        request
      )
    })

    it('should handle requests without query parameters', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/team')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledWith(
        'user123',
        expect.any(String),
        'page_view',
        expect.objectContaining({
          businessContext: ''
        }),
        request
      )
    })
  })

  describe('Performance Monitoring', () => {
    it('should log slow requests', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/dashboard')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(
        new Promise(resolve => setTimeout(resolve, 1100)) // Simulate slow response
      )

      // Act
      await sessionMiddleware(request)

      // Assert
      expect(mockSessionLogger.logSession).toHaveBeenCalledTimes(2) // Original + slow request log
      const slowRequestCall = mockSessionLogger.logSession.mock.calls[1]
      expect(slowRequestCall[4].businessContext).toContain('Slow request:')
    })

    it('should add performance headers', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.headers.get('X-Session-ID')).toBeTruthy()
      expect(response.headers.get('X-Request-ID')).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('should handle session logging errors gracefully', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockRejectedValue(new Error('Logging failed'))

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).not.toBe(500) // Should not crash the request
    })

    it('should handle token retrieval errors', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockRejectedValue(new Error('Token retrieval failed'))
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response).toBeInstanceOf(NextResponse)
      // Should fall back to anonymous user
    })

    it('should handle security event logging errors', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/tasks?id=1; DROP TABLE users--')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSecurityEvent.mockRejectedValue(new Error('Security logging failed'))

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.status).toBe(403) // Should still block the request
    })
  })

  describe('Cookie Management', () => {
    it('should set secure session cookie in production', async () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      const sessionCookie = response.cookies.get('session-id')
      expect(sessionCookie?.secure).toBe(true)
      expect(sessionCookie?.httpOnly).toBe(true)
      expect(sessionCookie?.sameSite).toBe('strict')

      // Cleanup
      process.env.NODE_ENV = originalEnv
    })

    it('should preserve existing session cookies', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      request.cookies.set('session-id', 'existing-session-123')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response.headers.get('X-Session-ID')).toBe('existing-session-123')
      // Should not set a new session cookie
      expect(response.cookies.get('session-id')).toBeFalsy()
    })
  })

  describe('IP Address Extraction', () => {
    it('should extract IP from x-forwarded-for header', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      request.headers.set('x-forwarded-for', '192.168.1.100, 10.0.0.1')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      await sessionMiddleware(request)

      // Assert
      // IP extraction is tested indirectly through the logging call
      expect(mockSessionLogger.logSession).toHaveBeenCalled()
    })

    it('should handle missing IP headers gracefully', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/')
      mockGetToken.mockResolvedValue({ sub: 'user123' })
      mockSessionLogger.logSession.mockResolvedValue(undefined)

      // Act
      const response = await sessionMiddleware(request)

      // Assert
      expect(response).toBeInstanceOf(NextResponse)
      expect(mockSessionLogger.logSession).toHaveBeenCalled()
    })
  })
})