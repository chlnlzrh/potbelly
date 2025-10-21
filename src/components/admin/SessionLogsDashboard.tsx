/**
 * Session Logs Dashboard Component
 * Admin interface for monitoring session activity and security events
 * Follows CLAUDE.md UI/UX requirements with Shadcn UI + Tailwind CSS
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertTriangle,
  Shield,
  Activity,
  Users,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionLog, SecurityEvent } from '@/types/session-logging'

interface SessionLogsDashboardProps {
  className?: string
}

interface SessionLogsResponse {
  data: SessionLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: any
}

interface AnalyticsResponse {
  timeframe: string
  overview: {
    total_sessions: number
    unique_users: number
    high_risk_activities: number
    ai_interactions: number
    sensitive_activities: number
    avg_session_duration: number
  }
  actionBreakdown: Array<{
    action: string
    count: number
    high_risk: number
    critical_risk: number
  }>
  securityEvents: Array<{
    type: string
    severity: string
    count: number
    latest_occurrence: string
  }>
  activityTrends: Array<{
    hour: string
    activity_count: number
    risk_count: number
    unique_sessions: number
  }>
}

export function SessionLogsDashboard({ className }: SessionLogsDashboardProps) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    userId: '',
    sessionId: '',
    action: '',
    riskLevel: '',
    search: '',
    timeframe: '24h'
  })

  const [selectedLogs, setSelectedLogs] = useState<string[]>([])

  // Fetch session logs
  const { 
    data: logsData, 
    isLoading: logsLoading, 
    refetch: refetchLogs 
  } = useQuery<SessionLogsResponse>({
    queryKey: ['session-logs', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      
      const response = await fetch(`/api/admin/session-logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch session logs')
      return response.json()
    }
  })

  // Fetch analytics
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading 
  } = useQuery<AnalyticsResponse>({
    queryKey: ['session-analytics', filters.timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics?timeframe=${filters.timeframe}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <Users className="h-4 w-4" />
      case 'ai_query': return <Activity className="h-4 w-4" />
      case 'security_violation': return <AlertTriangle className="h-4 w-4" />
      case 'admin_action': return <Shield className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A'
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(1)}s`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp))
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-normal">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.overview.total_sessions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {filters.timeframe}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-normal">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.overview.unique_users?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-normal">High Risk Activities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {analyticsData?.overview.high_risk_activities?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-normal">AI Interactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.overview.ai_interactions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              AI queries made
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Alert */}
      {analyticsData?.securityEvents && analyticsData.securityEvents.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.securityEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {event.severity}
                    </Badge>
                    <span className="text-xs font-normal">{event.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.count} occurrences
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-bold">Session Logs</CardTitle>
          <CardDescription className="text-xs">
            Monitor and analyze user session activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-8 text-xs"
              />
            </div>

            <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="page_view">Page View</SelectItem>
                <SelectItem value="ai_query">AI Query</SelectItem>
                <SelectItem value="task_update">Task Update</SelectItem>
                <SelectItem value="admin_action">Admin Action</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange('riskLevel', value)}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="text-xs"
            />

            <Input
              placeholder="Session ID"
              value={filters.sessionId}
              onChange={(e) => handleFilterChange('sessionId', e.target.value)}
              className="text-xs"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchLogs()}
                disabled={logsLoading}
                className="text-xs"
              >
                <RefreshCw className={cn("h-4 w-4", logsLoading && "animate-spin")} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Session Logs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-normal">Timestamp</TableHead>
                  <TableHead className="text-xs font-normal">User</TableHead>
                  <TableHead className="text-xs font-normal">Action</TableHead>
                  <TableHead className="text-xs font-normal">Risk</TableHead>
                  <TableHead className="text-xs font-normal">Page</TableHead>
                  <TableHead className="text-xs font-normal">Duration</TableHead>
                  <TableHead className="text-xs font-normal">IP Address</TableHead>
                  <TableHead className="text-xs font-normal">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-xs">
                      Loading session logs...
                    </TableCell>
                  </TableRow>
                ) : logsData?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-xs text-muted-foreground">
                      No session logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logsData?.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs font-normal">
                        {formatTimestamp(log.timestamp.toString())}
                      </TableCell>
                      <TableCell className="text-xs font-normal">
                        <div className="flex items-center gap-2">
                          {log.userId === 'anonymous' ? (
                            <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                          ) : (
                            <span>{log.userId.slice(0, 8)}...</span>
                          )}
                          {log.sensitive && (
                            <Badge variant="destructive" className="text-xs">Sensitive</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-normal">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span>{log.action.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getRiskLevelColor(log.riskLevel) as any}
                          className="text-xs"
                        >
                          {log.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-normal">
                        {log.metadata?.page || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs font-normal">
                        {formatDuration(log.duration)}
                      </TableCell>
                      <TableCell className="text-xs font-normal">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {logsData && logsData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                Showing {((logsData.pagination.page - 1) * logsData.pagination.limit) + 1} to{' '}
                {Math.min(logsData.pagination.page * logsData.pagination.limit, logsData.pagination.total)} of{' '}
                {logsData.pagination.total} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(logsData.pagination.page - 1)}
                  disabled={logsData.pagination.page === 1}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(logsData.pagination.page + 1)}
                  disabled={logsData.pagination.page === logsData.pagination.totalPages}
                  className="text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}