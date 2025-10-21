/**
 * Session Logger Service
 * Core logging service with security, performance, and audit compliance
 * Follows CLAUDE.md governance requirements
 */

import { v4 as uuidv4 } from 'uuid'
import { sql } from '@vercel/postgres'
import { kv } from '@vercel/kv'
import { 
  SessionLog, 
  AIInteraction, 
  SecurityEvent, 
  AuditEvent,
  SessionAction,
  SessionMetadata,
  RiskLevel,
  SecurityEventType,
  LoggingConfig 
} from '@/types/session-logging'

export class SessionLogger {
  private config: LoggingConfig
  private sensitivePatterns: RegExp[]
  private injectionPatterns: RegExp[]

  constructor(config: LoggingConfig) {
    this.config = config
    this.initializeSecurityPatterns()
  }

  /**
   * Initialize security detection patterns
   */
  private initializeSecurityPatterns(): void {
    // Sensitive data patterns (PII, credentials, etc.)
    this.sensitivePatterns = [
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{10}\b/, // Phone numbers
      /password|secret|key|token/i, // Credential keywords
    ]

    // Prompt injection patterns
    this.injectionPatterns = [
      /ignore\s+(previous|all)\s+instructions/i,
      /forget\s+everything/i,
      /new\s+instructions/i,
      /system\s*:\s*/i,
      /assistant\s*:\s*/i,
      /\[INST\]/i,
      /\{.*model.*\}/i,
    ]
  }

  /**
   * Log session activity with security checks
   */
  async logSession(
    userId: string,
    sessionId: string,
    action: SessionAction,
    metadata: SessionMetadata,
    request?: Request
  ): Promise<void> {
    try {
      const ipAddress = this.extractIPAddress(request)
      const userAgent = request?.headers.get('user-agent') || 'unknown'
      
      // Detect sensitive data
      const sensitive = this.detectSensitiveData(JSON.stringify(metadata))
      
      // Calculate risk level
      const riskLevel = this.calculateRiskLevel(action, metadata, sensitive)

      const sessionLog: SessionLog = {
        id: uuidv4(),
        userId,
        sessionId,
        timestamp: new Date(),
        action,
        metadata: this.sanitizeMetadata(metadata),
        ipAddress,
        userAgent,
        sensitive,
        riskLevel,
        aiModelUsed: process.env.AI_MODEL_VERSION
      }

      // Store in database
      if (this.config.enableRealTimeLogging) {
        await this.persistSessionLog(sessionLog)
      }

      // Store in cache for real-time access
      await this.cacheSessionActivity(sessionId, sessionLog)

      // Check for security violations
      if (riskLevel === 'high' || riskLevel === 'critical') {
        await this.handleSecurityEvent(sessionLog, request)
      }

    } catch (error) {
      console.error('Session logging failed:', error)
      // Fail silently to not break user experience
    }
  }

  /**
   * Log AI interactions with prompt injection detection
   */
  async logAIInteraction(
    sessionId: string,
    prompt: string,
    response: string,
    modelVersion: string,
    tokenCount: number
  ): Promise<void> {
    try {
      const promptInjectionDetected = this.detectPromptInjection(prompt)
      const sensitiveDataDetected = this.detectSensitiveData(prompt + response)
      
      const interaction: AIInteraction = {
        id: uuidv4(),
        sessionId,
        modelVersion,
        prompt: this.config.sensitiveDataRedaction ? this.redactSensitiveData(prompt) : prompt,
        response: this.config.sensitiveDataRedaction ? this.redactSensitiveData(response) : response,
        tokenCount,
        timestamp: new Date(),
        riskLevel: this.calculateAIRiskLevel(promptInjectionDetected, sensitiveDataDetected),
        sanitized: this.config.sensitiveDataRedaction,
        promptInjectionDetected,
        sensitiveDataDetected
      }

      // Store AI interaction
      await this.persistAIInteraction(interaction)

      // Handle security events
      if (promptInjectionDetected) {
        await this.logSecurityEvent(
          sessionId,
          'prompt_injection_attempt',
          'high',
          'Potential prompt injection detected in AI interaction',
          true
        )
      }

    } catch (error) {
      console.error('AI interaction logging failed:', error)
    }
  }

  /**
   * Log security events with automated response
   */
  async logSecurityEvent(
    sessionId: string,
    type: SecurityEventType,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    blocked: boolean,
    request?: Request
  ): Promise<void> {
    const securityEvent: SecurityEvent = {
      id: uuidv4(),
      sessionId,
      type,
      severity,
      description,
      timestamp: new Date(),
      ipAddress: this.extractIPAddress(request) || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      blocked,
      response: blocked ? 'Request blocked' : 'Request allowed with monitoring'
    }

    await this.persistSecurityEvent(securityEvent)

    // Automated escalation for critical events
    if (severity === 'critical') {
      await this.escalateSecurityEvent(securityEvent)
    }
  }

  /**
   * Log audit events for compliance
   */
  async logAuditEvent(
    userId: string,
    sessionId: string,
    action: string,
    resource: string,
    success: boolean,
    changes: Record<string, any>,
    reason?: string,
    request?: Request
  ): Promise<void> {
    const auditEvent: AuditEvent = {
      id: uuidv4(),
      userId,
      sessionId,
      action,
      resource,
      timestamp: new Date(),
      success,
      changes: this.sanitizeAuditData(changes),
      reason,
      ipAddress: this.extractIPAddress(request) || 'unknown'
    }

    await this.persistAuditEvent(auditEvent)
  }

  /**
   * Detect sensitive data in content
   */
  private detectSensitiveData(content: string): boolean {
    return this.sensitivePatterns.some(pattern => pattern.test(content))
  }

  /**
   * Detect prompt injection attempts
   */
  private detectPromptInjection(prompt: string): boolean {
    return this.injectionPatterns.some(pattern => pattern.test(prompt))
  }

  /**
   * Redact sensitive data from content
   */
  private redactSensitiveData(content: string): string {
    let redacted = content
    this.sensitivePatterns.forEach(pattern => {
      redacted = redacted.replace(pattern, '[REDACTED]')
    })
    return redacted
  }

  /**
   * Calculate risk level based on action and context
   */
  private calculateRiskLevel(
    action: SessionAction, 
    metadata: SessionMetadata, 
    sensitive: boolean
  ): RiskLevel {
    if (sensitive || action === 'security_violation') return 'critical'
    if (action === 'admin_action' || metadata.priority === 'critical') return 'high'
    if (action === 'ai_query' || metadata.priority === 'high') return 'medium'
    return 'low'
  }

  /**
   * Calculate AI interaction risk level
   */
  private calculateAIRiskLevel(
    promptInjection: boolean, 
    sensitiveData: boolean
  ): RiskLevel {
    if (promptInjection) return 'critical'
    if (sensitiveData) return 'high'
    return 'low'
  }

  /**
   * Extract IP address from request
   */
  private extractIPAddress(request?: Request): string {
    if (!request) return 'unknown'
    
    return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'
    )
  }

  /**
   * Sanitize metadata for storage
   */
  private sanitizeMetadata(metadata: SessionMetadata): SessionMetadata {
    if (!this.config.sensitiveDataRedaction) return metadata

    const sanitized = { ...metadata }
    if (sanitized.businessContext && this.detectSensitiveData(sanitized.businessContext)) {
      sanitized.businessContext = this.redactSensitiveData(sanitized.businessContext)
    }
    return sanitized
  }

  /**
   * Sanitize audit data
   */
  private sanitizeAuditData(changes: Record<string, any>): Record<string, any> {
    if (!this.config.sensitiveDataRedaction) return changes

    const sanitized = { ...changes }
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && this.detectSensitiveData(sanitized[key])) {
        sanitized[key] = '[REDACTED]'
      }
    })
    return sanitized
  }

  /**
   * Persist session log to database
   */
  private async persistSessionLog(log: SessionLog): Promise<void> {
    await sql`
      INSERT INTO session_logs (
        id, user_id, session_id, timestamp, action, metadata,
        ip_address, user_agent, duration, ai_model_used, sensitive, risk_level
      ) VALUES (
        ${log.id}, ${log.userId}, ${log.sessionId}, ${log.timestamp}, 
        ${log.action}, ${JSON.stringify(log.metadata)}, ${log.ipAddress},
        ${log.userAgent}, ${log.duration}, ${log.aiModelUsed}, 
        ${log.sensitive}, ${log.riskLevel}
      )
    `
  }

  /**
   * Persist AI interaction to database
   */
  private async persistAIInteraction(interaction: AIInteraction): Promise<void> {
    await sql`
      INSERT INTO ai_interactions (
        id, session_id, model_version, prompt, response, token_count,
        timestamp, risk_level, sanitized, prompt_injection_detected, sensitive_data_detected
      ) VALUES (
        ${interaction.id}, ${interaction.sessionId}, ${interaction.modelVersion},
        ${interaction.prompt}, ${interaction.response}, ${interaction.tokenCount},
        ${interaction.timestamp}, ${interaction.riskLevel}, ${interaction.sanitized},
        ${interaction.promptInjectionDetected}, ${interaction.sensitiveDataDetected}
      )
    `
  }

  /**
   * Persist security event to database
   */
  private async persistSecurityEvent(event: SecurityEvent): Promise<void> {
    await sql`
      INSERT INTO security_events (
        id, session_id, type, severity, description, timestamp,
        ip_address, user_agent, blocked, response
      ) VALUES (
        ${event.id}, ${event.sessionId}, ${event.type}, ${event.severity},
        ${event.description}, ${event.timestamp}, ${event.ipAddress},
        ${event.userAgent}, ${event.blocked}, ${event.response}
      )
    `
  }

  /**
   * Persist audit event to database
   */
  private async persistAuditEvent(event: AuditEvent): Promise<void> {
    await sql`
      INSERT INTO audit_events (
        id, user_id, session_id, action, resource, timestamp,
        success, changes, reason, ip_address
      ) VALUES (
        ${event.id}, ${event.userId}, ${event.sessionId}, ${event.action},
        ${event.resource}, ${event.timestamp}, ${event.success},
        ${JSON.stringify(event.changes)}, ${event.reason}, ${event.ipAddress}
      )
    `
  }

  /**
   * Cache session activity for real-time access
   */
  private async cacheSessionActivity(sessionId: string, log: SessionLog): Promise<void> {
    const key = `session:${sessionId}:activity`
    const activities = await kv.get<SessionLog[]>(key) || []
    activities.push(log)
    
    // Keep only last 100 activities
    if (activities.length > 100) {
      activities.splice(0, activities.length - 100)
    }
    
    await kv.set(key, activities, { ex: 3600 }) // 1 hour expiry
  }

  /**
   * Handle security events with automated response
   */
  private async handleSecurityEvent(log: SessionLog, request?: Request): Promise<void> {
    // Log security event
    await this.logSecurityEvent(
      log.sessionId,
      'suspicious_activity',
      log.riskLevel === 'critical' ? 'critical' : 'high',
      `High-risk session activity detected: ${log.action}`,
      false,
      request
    )

    // Notify security monitoring system
    await this.notifySecuritySystem(log)
  }

  /**
   * Escalate critical security events
   */
  private async escalateSecurityEvent(event: SecurityEvent): Promise<void> {
    // In production, this would integrate with alerting systems
    console.error('CRITICAL SECURITY EVENT:', event)
    
    // Could integrate with:
    // - Slack/Teams notifications
    // - PagerDuty alerts
    // - Email notifications
    // - SIEM systems
  }

  /**
   * Notify security monitoring system
   */
  private async notifySecuritySystem(log: SessionLog): Promise<void> {
    // In production, integrate with security monitoring
    console.warn('Security monitoring notification:', {
      sessionId: log.sessionId,
      userId: log.userId,
      action: log.action,
      riskLevel: log.riskLevel,
      timestamp: log.timestamp
    })
  }

  /**
   * Get session analytics
   */
  async getSessionAnalytics(sessionId: string): Promise<{
    totalActions: number
    riskEvents: number
    aiInteractions: number
    duration: number
    securityEvents: SecurityEvent[]
  }> {
    const activities = await kv.get<SessionLog[]>(`session:${sessionId}:activity`) || []
    
    return {
      totalActions: activities.length,
      riskEvents: activities.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length,
      aiInteractions: activities.filter(a => a.action === 'ai_query').length,
      duration: activities.length > 0 ? 
        Date.now() - activities[0].timestamp.getTime() : 0,
      securityEvents: [] // Would fetch from database in production
    }
  }
}

// Singleton instance
export const sessionLogger = new SessionLogger({
  enableRealTimeLogging: true,
  retentionPeriodDays: 90,
  sensitiveDataRedaction: true,
  performanceLogging: true,
  securityEventLogging: true,
  aiInteractionLogging: true,
  gdprCompliance: true,
  encryptLogs: true
})