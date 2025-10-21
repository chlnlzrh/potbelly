'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Phone, MessageCircle, MapPin, Clock, User, Calendar, Activity, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  formatRelativeDate, 
  generatePhoneUrl, 
  generateWhatsAppUrl,
  getPriorityColor 
} from '@/lib/utils'

interface ContractorStats {
  total: number
  completed: number
  inProgress: number
  urgent: number
  avgProgress: number
  lastUpdate: string
}

export function TeamTab() {
  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    },
  })

  const tasks = tasksResponse?.data || []

  const contractors = [
    {
      name: 'Vishal',
      role: 'Lead Contractor',
      phone: '+91 98765 43210',
      specialty: 'Structural & General Work',
      avatar: '👷‍♂️',
      status: 'active'
    },
    {
      name: 'Arushi',
      role: 'Project Manager',
      phone: '+91 98765 43212',
      specialty: 'Design & Coordination',
      avatar: '👩‍💼',
      status: 'active'
    },
    {
      name: 'Sabharwal',
      role: 'Electrical Contractor',
      phone: '+91 98765 43211',
      specialty: 'Electrical Systems',
      avatar: '⚡',
      status: 'active'
    },
    {
      name: 'Sandeep',
      role: 'Plumbing Contractor',
      phone: '+91 98765 43213',
      specialty: 'Plumbing & Water Systems',
      avatar: '🔧',
      status: 'active'
    },
    {
      name: 'Pradeep',
      role: 'Kitchen Specialist',
      phone: '+91 98765 43214',
      specialty: 'Kitchen Equipment & Ducting',
      avatar: '🍳',
      status: 'active'
    },
    {
      name: 'Bhargav',
      role: 'Finishing Contractor',
      phone: '+91 98765 43215',
      specialty: 'Painting & Finishing',
      avatar: '🎨',
      status: 'active'
    }
  ]

  const getContractorStats = (contractorName: string): ContractorStats => {
    const contractorTasks = tasks.filter((task: any) => 
      task.owner.toLowerCase().includes(contractorName.toLowerCase())
    )

    const completed = contractorTasks.filter((t: any) => t.status === 'Completed').length
    const inProgress = contractorTasks.filter((t: any) => t.status === 'In Progress').length
    const urgent = contractorTasks.filter((t: any) => 
      t.priority === 'Critical' || t.priority === 'High'
    ).length

    const totalProgress = contractorTasks.reduce((sum: number, task: any) => 
      sum + (task.progress || 0), 0
    )
    const avgProgress = contractorTasks.length > 0 ? Math.round(totalProgress / contractorTasks.length) : 0

    const lastUpdate = contractorTasks.length > 0 
      ? Math.max(...contractorTasks.map((t: any) => new Date(t.dueDate).getTime()))
      : Date.now()

    return {
      total: contractorTasks.length,
      completed,
      inProgress,
      urgent,
      avgProgress,
      lastUpdate: new Date(lastUpdate).toISOString()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xs text-gray-500">Loading team...</div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 pb-20">
        {/* Team Overview */}
        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>TEAM OVERVIEW</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xs font-bold text-gray-900">{contractors.length}</div>
                <div className="text-xs text-gray-500">Team Members</div>
              </div>
              <div>
                <div className="text-xs font-bold text-green-600">
                  {contractors.filter(c => c.status === 'active').length}
                </div>
                <div className="text-xs text-gray-500">Active Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-mobile">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href="tel:+91 98765 43212">
                  <Phone className="h-3 w-3 mr-1" />
                  CALL ARUSHI
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generateWhatsAppUrl('+91 98765 43210')}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  MSG VISHAL
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contractor Cards */}
        {contractors.map((contractor) => {
          const stats = getContractorStats(contractor.name)
          const hasUrgentTasks = stats.urgent > 0
          
          return (
            <ContractorCard 
              key={contractor.name}
              contractor={contractor}
              stats={stats}
              hasUrgentTasks={hasUrgentTasks}
            />
          )
        })}

        {/* Team Schedule */}
        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>TODAY'S SCHEDULE</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {generateTodaySchedule().map((item, index) => (
              <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0">
                <div className="text-xs">{item.time}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold">{item.contractor}</div>
                  <div className="text-xs text-gray-500">{item.task}</div>
                </div>
                <div className="text-xs text-gray-500">{item.location}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

interface ContractorCardProps {
  contractor: {
    name: string
    role: string
    phone: string
    specialty: string
    avatar: string
    status: string
  }
  stats: ContractorStats
  hasUrgentTasks: boolean
}

function ContractorCard({ contractor, stats, hasUrgentTasks }: ContractorCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={`card-mobile ${hasUrgentTasks ? 'border-red-200' : ''}`}>
      <div 
        className="p-4 cursor-pointer touch-target"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{contractor.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xs font-bold text-gray-900">{contractor.name}</h3>
                {hasUrgentTasks && (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
              </div>
              <div className="text-xs text-gray-500 mb-1">{contractor.role}</div>
              <div className="text-xs text-gray-400">{contractor.specialty}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-xs font-bold text-green-600">{stats.avgProgress}%</span>
            </div>
            <div className="text-xs text-gray-500">{stats.total} tasks</div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div>
            <div className={`text-xs font-bold ${stats.urgent > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {stats.urgent}
            </div>
            <div className="text-xs text-gray-500">Urgent</div>
          </div>
        </div>
      </div>

      {expanded && (
        <CardContent className="p-4 pt-0 border-t border-gray-100">
          <div className="space-y-4">
            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generatePhoneUrl(contractor.phone)}>
                  <Phone className="h-3 w-3 mr-1" />
                  CALL
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generateWhatsAppUrl(contractor.phone)}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  MESSAGE
                </a>
              </Button>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="text-xs font-bold mb-2">Recent Activity</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Last update {formatRelativeDate(stats.lastUpdate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Working on site today</span>
                </div>
              </div>
            </div>

            {/* Urgent Tasks Alert */}
            {hasUrgentTasks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <span className="text-xs font-bold text-red-800">
                    {stats.urgent} Urgent Task{stats.urgent > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-xs text-red-700">
                  Requires immediate attention
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function generateTodaySchedule() {
  return [
    {
      time: '9:00 AM',
      contractor: 'Vishal',
      task: 'Scaffolding setup',
      location: 'Main area'
    },
    {
      time: '10:30 AM',
      contractor: 'Sabharwal',
      task: 'Electrical inspection',
      location: 'Kitchen'
    },
    {
      time: '2:00 PM',
      contractor: 'Pradeep',
      task: 'Ducting installation',
      location: 'Kitchen'
    },
    {
      time: '3:30 PM',
      contractor: 'Arushi',
      task: 'Design review meeting',
      location: 'Site office'
    }
  ]
}