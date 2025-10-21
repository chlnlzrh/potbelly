'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Filter, Phone, MessageCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  formatRelativeDate, 
  generatePhoneUrl, 
  generateWhatsAppUrl,
  getPriorityColor,
  getStatusColor,
  groupTasksByStatus,
  sortTasksByPriority
} from '@/lib/utils'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'my_decisions' | 'this_week' | 'urgent' | 'by_person' | 'by_status'

const FILTER_CHIPS = [
  { id: 'all', label: 'ALL ITEMS', icon: null },
  { id: 'my_decisions', label: 'MY DECISIONS', icon: '🔥' },
  { id: 'this_week', label: 'THIS WEEK', icon: '📅' },
  { id: 'urgent', label: 'URGENT', icon: '⚠️' },
  { id: 'by_person', label: 'BY PERSON', icon: '👷' },
  { id: 'by_status', label: 'BY STATUS', icon: '📊' },
]

export function TasksTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [expandedSections, setExpandedSections] = useState<string[]>(['urgent'])

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ['tasks', activeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeFilter === 'urgent') params.append('urgent', 'true')
      if (activeFilter === 'my_decisions') params.append('decisions', 'true')
      
      const response = await fetch(`/api/tasks?${params}`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    },
  })

  const tasks = tasksResponse?.data || []

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const renderTaskGroups = () => {
    if (activeFilter === 'by_status') {
      const groupedTasks = groupTasksByStatus(tasks)
      return Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <TaskSection
          key={status}
          title={status.toUpperCase()}
          tasks={statusTasks}
          count={statusTasks.length}
          expanded={expandedSections.includes(status)}
          onToggle={() => toggleSection(status)}
          variant={getStatusVariant(status)}
        />
      ))
    }

    if (activeFilter === 'by_person') {
      return renderPersonGroups()
    }

    // Default grouping by urgency/timeline
    const urgentTasks = tasks.filter((task: any) => 
      task.priority === 'Critical' || 
      new Date(task.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    )
    const thisWeekTasks = tasks.filter((task: any) => {
      const dueDate = new Date(task.dueDate)
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      return dueDate <= weekFromNow && !urgentTasks.includes(task)
    })
    const inProgressTasks = tasks.filter((task: any) => 
      task.status === 'In Progress' && !urgentTasks.includes(task) && !thisWeekTasks.includes(task)
    )
    const upcomingTasks = tasks.filter((task: any) => 
      !urgentTasks.includes(task) && 
      !thisWeekTasks.includes(task) && 
      !inProgressTasks.includes(task) &&
      task.status !== 'Completed'
    )
    const completedTasks = tasks.filter((task: any) => task.status === 'Completed')

    return (
      <>
        <TaskSection
          title="URGENT & OVERDUE"
          tasks={urgentTasks}
          count={urgentTasks.length}
          expanded={expandedSections.includes('urgent')}
          onToggle={() => toggleSection('urgent')}
          variant="critical"
        />
        <TaskSection
          title="DUE THIS WEEK"
          tasks={thisWeekTasks}
          count={thisWeekTasks.length}
          expanded={expandedSections.includes('this_week')}
          onToggle={() => toggleSection('this_week')}
          variant="warning"
        />
        <TaskSection
          title="IN PROGRESS"
          tasks={inProgressTasks}
          count={inProgressTasks.length}
          expanded={expandedSections.includes('in_progress')}
          onToggle={() => toggleSection('in_progress')}
          variant="info"
        />
        <TaskSection
          title="COMING SOON"
          tasks={upcomingTasks}
          count={upcomingTasks.length}
          expanded={expandedSections.includes('upcoming')}
          onToggle={() => toggleSection('upcoming')}
          variant="default"
        />
        <TaskSection
          title="COMPLETED"
          tasks={completedTasks}
          count={completedTasks.length}
          expanded={expandedSections.includes('completed')}
          onToggle={() => toggleSection('completed')}
          variant="success"
        />
      </>
    )
  }

  const renderPersonGroups = () => {
    const contractors = ['Vishal', 'Arushi', 'Sabharwal', 'Sandeep', 'Pradeep', 'Bhargav']
    
    return contractors.map(contractor => {
      const contractorTasks = tasks.filter((task: any) => 
        task.owner.toLowerCase().includes(contractor.toLowerCase())
      )
      
      if (contractorTasks.length === 0) return null
      
      return (
        <TaskSection
          key={contractor}
          title={`${contractor.toUpperCase()} (${contractorTasks.length})`}
          tasks={contractorTasks}
          count={contractorTasks.length}
          expanded={expandedSections.includes(contractor)}
          onToggle={() => toggleSection(contractor)}
          variant="default"
          showContactButtons={contractor}
        />
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xs text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Project Overview */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold">COMPLETE PROJECT OVERVIEW</h2>
          <Button size="sm" variant="outline">
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-xs font-bold">{tasks.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-xs font-bold text-red-600">
              {tasks.filter((t: any) => t.priority === 'Critical' || t.priority === 'High').length}
            </div>
            <div className="text-xs text-gray-500">Urgent</div>
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600">
              {tasks.filter((t: any) => t.status === 'In Progress').length}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div>
            <div className="text-xs font-bold text-green-600">
              {tasks.filter((t: any) => t.status === 'Completed').length}
            </div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {FILTER_CHIPS.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="chip"
              className="whitespace-nowrap"
              onClick={() => setActiveFilter(filter.id as FilterType)}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Task Groups */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-20">
          {renderTaskGroups()}
        </div>
      </ScrollArea>
    </div>
  )
}

interface TaskSectionProps {
  title: string
  tasks: any[]
  count: number
  expanded: boolean
  onToggle: () => void
  variant: 'critical' | 'warning' | 'info' | 'success' | 'default'
  showContactButtons?: string
}

function TaskSection({ 
  title, 
  tasks, 
  count, 
  expanded, 
  onToggle, 
  variant,
  showContactButtons 
}: TaskSectionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'critical': return '🔴'
      case 'warning': return '🟡'
      case 'info': return '🟢'
      case 'success': return '✅'
      default: return '⏳'
    }
  }

  return (
    <Card className={cn("card-mobile", expanded && getVariantStyles())}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer touch-target"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-xs font-bold">
            {getIconColor()} {title} ({count})
          </span>
        </div>
      </div>

      {expanded && (
        <CardContent className="p-4 pt-0 space-y-3">
          {showContactButtons && (
            <div className="flex space-x-2 mb-3">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generatePhoneUrl(getContractorPhone(showContactButtons))}>
                  <Phone className="h-3 w-3 mr-1" />
                  CALL {showContactButtons.toUpperCase()}
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generateWhatsAppUrl(getContractorPhone(showContactButtons))}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  MESSAGE
                </a>
              </Button>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-4">
              No tasks in this category
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </CardContent>
      )}
    </Card>
  )
}

function TaskCard({ task }: { task: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div 
        className="p-3 cursor-pointer touch-target"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <h4 className="text-xs font-bold text-gray-900 line-clamp-2">{task.title}</h4>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{task.owner}</span>
              <span>•</span>
              <span>{formatRelativeDate(task.dueDate)}</span>
              <span>•</span>
              <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
        
        {task.progress && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-bold">{task.progress}% done</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="progress-bar h-1.5 rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Status:</span>
                <div className={cn("inline-block ml-1 px-2 py-1 rounded", getStatusColor(task.status))}>
                  {task.status}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>
                <div className={cn("inline-block ml-1 px-2 py-1 rounded", getPriorityColor(task.priority))}>
                  {task.priority}
                </div>
              </div>
            </div>

            {task.notes && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Notes:</div>
                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">{task.notes}</div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generatePhoneUrl(getContractorPhone(task.owner))}>
                  <Phone className="h-3 w-3 mr-1" />
                  CALL
                </a>
              </Button>
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <a href={generateWhatsAppUrl(getContractorPhone(task.owner))}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  MESSAGE
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed': return 'success'
    case 'in progress': return 'info'
    case 'awaiting decision': return 'warning'
    case 'not started': return 'default'
    default: return 'default'
  }
}

function getContractorPhone(name: string): string {
  const phones: Record<string, string> = {
    'Vishal': '+91 98765 43210',
    'Sabharwal': '+91 98765 43211',
    'Arushi': '+91 98765 43212',
    'Sandeep': '+91 98765 43213',
    'Pradeep': '+91 98765 43214',
    'Bhargav': '+91 98765 43215',
  }
  return phones[name] || '+91 98765 43200'
}