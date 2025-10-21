/**
 * Session Logging Types
 * Comprehensive type definitions for session management and audit logging
 */

export interface SessionLog {
  id: string
  userId: string
  sessionId: string
  timestamp: Date
  action: SessionAction
  metadata: SessionMetadata
  ipAddress: string
  userAgent: string
  duration?: number
  aiModelUsed?: string
  sensitive: boolean
  riskLevel: RiskLevel
}

export interface AIInteraction {
  id: string
  sessionId: string
  modelVersion: string
  prompt: string
  response: string
  tokenCount: number
  timestamp: Date
  riskLevel: RiskLevel
  sanitized: boolean
  promptInjectionDetected: boolean
  sensitiveDataDetected: boolean
}

export interface SessionMetadata {
  page: string
  feature: string
  taskId?: string
  contractorId?: string
  decisionType?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  businessContext?: string
}

export type SessionAction = 
  | 'login'
  | 'logout'
  | 'page_view'
  | 'task_update'
  | 'decision_made'
  | 'contractor_contact'
  | 'photo_upload'
  | 'ai_query'
  | 'status_change'
  | 'filter_applied'
  | 'report_generated'
  | 'admin_action'
  | 'security_violation'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SessionState {
  sessionId: string
  userId: string
  startTime: Date
  lastActivity: Date
  isActive: boolean
  deviceInfo: DeviceInfo
  preferences: UserPreferences
  currentPage: string
  actionCount: number
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  screen: {
    width: number
    height: number
  }
  timezone: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notificationsEnabled: boolean
  autoSave: boolean
  defaultView: 'dashboard' | 'tasks' | 'team'
}

export interface SecurityEvent {
  id: string
  sessionId: string
  type: SecurityEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  blocked: boolean
  response: string
}

export type SecurityEventType =
  | 'prompt_injection_attempt'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'suspicious_activity'
  | 'brute_force_attempt'
  | 'unauthorized_access'
  | 'data_exfiltration_attempt'
  | 'unusual_location'
  | 'session_hijacking'

export interface AuditEvent {
  id: string
  userId: string
  sessionId: string
  action: string
  resource: string
  timestamp: Date
  success: boolean
  changes: Record<string, any>
  reason?: string
  ipAddress: string
}

export interface LoggingConfig {
  enableRealTimeLogging: boolean
  retentionPeriodDays: number
  sensitiveDataRedaction: boolean
  performanceLogging: boolean
  securityEventLogging: boolean
  aiInteractionLogging: boolean
  gdprCompliance: boolean
  encryptLogs: boolean
}