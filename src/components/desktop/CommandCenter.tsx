'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Home, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Camera, 
  MessageSquare, 
  Settings,
  Search,
  Plus,
  Bell,
  Calendar,
  FileText,
  Monitor
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MenuSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
  expanded: boolean
  items: MenuItem[]
}

interface MenuItem {
  id: string
  title: string
  count?: number
  urgent?: boolean
  active?: boolean
}

export function CommandCenter() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard'])
  const [activeView, setActiveView] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: tasksResponse } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    },
  })

  const { data: projectSummary } = useQuery({
    queryKey: ['project-summary'],
    queryFn: async () => {
      const response = await fetch('/api/project/summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      return response.json()
    },
  })

  const tasks = tasksResponse?.data || []
  const summary = projectSummary?.data

  const menuSections: MenuSection[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      expanded: expandedSections.includes('dashboard'),
      items: [
        { id: 'overview', title: 'Project Overview', active: activeView === 'overview' },
        { id: 'analytics', title: 'Analytics & Reports' },
        { id: 'timeline', title: 'Project Timeline' },
        { id: 'budget', title: 'Budget Tracking' }
      ]
    },
    {
      id: 'tasks',
      title: 'Task Management',
      icon: ClipboardList,
      count: tasks.filter((t: any) => t.status !== 'Completed').length,
      expanded: expandedSections.includes('tasks'),
      items: [
        { 
          id: 'urgent-tasks', 
          title: 'Urgent & Overdue', 
          count: tasks.filter((t: any) => t.priority === 'Critical' || t.priority === 'High').length,
          urgent: true 
        },
        { id: 'in-progress', title: 'In Progress', count: tasks.filter((t: any) => t.status === 'In Progress').length },
        { id: 'decisions', title: 'Awaiting Decisions', count: tasks.filter((t: any) => t.status === 'Awaiting Decision').length },
        { id: 'upcoming', title: 'Upcoming Tasks' },
        { id: 'completed', title: 'Completed Tasks', count: tasks.filter((t: any) => t.status === 'Completed').length }
      ]
    },
    {
      id: 'team',
      title: 'Team & Contractors',
      icon: Users,
      count: 6,
      expanded: expandedSections.includes('team'),
      items: [
        { id: 'contractors', title: 'Contractor Status' },
        { id: 'assignments', title: 'Task Assignments' },
        { id: 'performance', title: 'Performance Review' },
        { id: 'contacts', title: 'Contact Directory' }
      ]
    },
    {
      id: 'communications',
      title: 'Communications',
      icon: MessageSquare,
      count: 12,
      expanded: expandedSections.includes('communications'),
      items: [
        { id: 'messages', title: 'Messages & Updates', count: 5 },
        { id: 'calls', title: 'Call Logs' },
        { id: 'meetings', title: 'Meeting Notes' },
        { id: 'announcements', title: 'Announcements' }
      ]
    },
    {
      id: 'media',
      title: 'Media & Documentation',
      icon: Camera,
      count: 42,
      expanded: expandedSections.includes('media'),
      items: [
        { id: 'photos', title: 'Progress Photos', count: 37 },
        { id: 'documents', title: 'Project Documents' },
        { id: 'videos', title: 'Video Updates' },
        { id: 'drawings', title: 'Technical Drawings' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: BarChart3,
      expanded: expandedSections.includes('reports'),
      items: [
        { id: 'progress-reports', title: 'Progress Reports' },
        { id: 'quality-metrics', title: 'Quality Metrics' },
        { id: 'cost-analysis', title: 'Cost Analysis' },
        { id: 'time-tracking', title: 'Time Tracking' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings & Admin',
      icon: Settings,
      expanded: expandedSections.includes('settings'),
      items: [
        { id: 'project-settings', title: 'Project Settings' },
        { id: 'user-management', title: 'User Management' },
        { id: 'notifications', title: 'Notification Settings' },
        { id: 'integrations', title: 'Integrations' }
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleMenuItemClick = (itemId: string) => {
    setActiveView(itemId)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xs font-bold text-gray-900">POTBELLY BUILD COMMAND CENTER</h1>
            <Badge variant="secondary" className="text-xs">
              <Monitor className="h-3 w-3 mr-1" />
              DESKTOP
            </Badge>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, contacts, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{summary?.summary?.progress || 78}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{tasks.filter((t: any) => t.status === 'In Progress').length}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {menuSections.map((section) => (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-normal rounded-lg transition-colors touch-target",
                    section.expanded 
                      ? "text-black bg-gray-100" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {section.count && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {section.count}
                      </Badge>
                    )}
                    <div className={cn(
                      "transform transition-transform",
                      section.expanded ? "rotate-90" : "rotate-0"
                    )}>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>
                  </div>
                </button>

                {section.expanded && (
                  <div className="ml-4 space-y-0.5">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors touch-target",
                          item.active 
                            ? "text-black bg-blue-50" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span>{item.title}</span>
                        <div className="flex items-center space-x-1">
                          {item.count && (
                            <Badge 
                              variant={item.urgent ? "destructive" : "secondary"} 
                              className="text-xs px-2 py-0"
                            >
                              {item.count}
                            </Badge>
                          )}
                          {item.urgent && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button size="sm" className="w-full justify-start" variant="outline">
              <Plus className="h-3 w-3 mr-2" />
              Add New Task
            </Button>
            <Button size="sm" className="w-full justify-start" variant="outline">
              <Calendar className="h-3 w-3 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-gray-900">
                {menuSections.find(s => s.items.some(i => i.id === activeView))?.title || 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="outline">
                <Bell className="h-3 w-3 mr-1" />
                Notifications
                <Badge variant="destructive" className="ml-2 text-xs px-1">3</Badge>
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {activeView === 'overview' && <ProjectOverview summary={summary} tasks={tasks} />}
            {activeView === 'urgent-tasks' && <UrgentTasksView tasks={tasks} />}
            {activeView === 'analytics' && <AnalyticsView tasks={tasks} />}
            {/* Add more views as needed */}
          </div>
        </main>
      </div>
    </div>
  )
}

function ProjectOverview({ summary, tasks }: { summary: any, tasks: any[] }) {
  const urgentTasks = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High')
  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Project Progress</p>
                <p className="text-2xl font-bold text-green-600">{summary?.summary?.progress || 78}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Urgent Tasks</p>
                <p className="text-2xl font-bold text-red-600">{urgentTasks.length}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Team Members</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold">RECENT TASKS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-bold">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.owner} • {task.status}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold">URGENT ALERTS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTasks.slice(0, 5).map((task, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-900">{task.title}</p>
                  <p className="text-xs text-red-700">{task.owner} • Due: {task.dueDate}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UrgentTasksView({ tasks }: { tasks: any[] }) {
  const urgentTasks = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-red-800">URGENT & HIGH PRIORITY TASKS</h3>
        <Badge variant="destructive">{urgentTasks.length} tasks require attention</Badge>
      </div>

      <div className="space-y-4">
        {urgentTasks.map((task, index) => (
          <Card key={index} className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-red-900 mb-2">{task.title}</h4>
                  <p className="text-xs text-gray-600 mb-3">{task.notes}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Owner: {task.owner}</span>
                    <span>Due: {task.dueDate}</span>
                    <span>Status: {task.status}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="destructive">{task.priority}</Badge>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView({ tasks }: { tasks: any[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold">ANALYTICS & REPORTS</h3>
      <Card>
        <CardContent className="p-6">
          <p className="text-xs text-gray-500">Analytics view coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}