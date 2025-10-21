'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Calendar, Camera, Info, Phone, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeDate, generatePhoneUrl } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PhotoUpload } from './PhotoUpload'

export function HomeTab() {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  const { data: summary, isLoading } = useQuery({
    queryKey: ['project-summary'],
    queryFn: async () => {
      const response = await fetch('/api/project/summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      return response.json()
    },
  })

  const { data: insights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      const response = await fetch('/api/ai/insights')
      if (!response.ok) throw new Error('Failed to fetch insights')
      return response.json()
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xs text-gray-500">Loading...</div>
      </div>
    )
  }

  const projectData = summary?.data

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6 pb-20">
        {/* Project Overview */}
        <Card className="card-mobile">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-normal text-gray-600">Progress</span>
                <span className="text-xs font-bold">{projectData?.summary?.progress || 78}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="progress-bar h-2 rounded-full"
                  style={{ width: `${projectData?.summary?.progress || 78}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs font-bold text-gray-900">{projectData?.summary?.total || 37}</div>
                  <div className="text-xs text-gray-500">Total Tasks</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-green-600">{projectData?.summary?.completed || 5}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600">{projectData?.summary?.inProgress || 12}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        {projectData?.urgentTasks?.length > 0 && (
          <Card className="card-mobile border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span>URGENT ALERTS ({projectData.urgentTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {projectData.urgentTasks.slice(0, 3).map((task: any) => (
                <div key={task.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-red-900">{task.title}</h4>
                        <p className="text-xs text-red-700 mt-1">
                          {formatRelativeDate(task.dueDate)} • {task.owner}
                        </p>
                      </div>
                    </div>
                    {task.owner.toLowerCase().includes('arushi') && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="w-full"
                        asChild
                      >
                        <a href={generatePhoneUrl('+91 98765 43212')}>
                          <Phone className="h-3 w-3 mr-1" />
                          CALL ARUSHI
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {projectData.urgentTasks.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  See All {projectData.urgentTasks.length} Urgent Tasks
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        {insights?.data?.length > 0 && (
          <Card className="card-mobile">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>AI INSIGHTS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {insights.data.slice(0, 2).map((insight: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    insight.type === 'critical' ? 'bg-red-50 border-red-200' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    insight.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h4 className="text-xs font-bold mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-700">{insight.message}</p>
                  {insight.action && (
                    <p className="text-xs font-bold mt-2">💡 {insight.action}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* This Week's Schedule */}
        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>THIS WEEK</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {generateWeekSchedule().map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-xs font-bold">{day.name}</div>
                  <div className="text-xs text-gray-500">{day.date}</div>
                </div>
                <div className="text-right">
                  {day.tasks.length > 0 ? (
                    <div className="space-y-1">
                      {day.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="text-xs text-gray-700">
                          {task}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-green-600">All clear ✅</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Photos */}
        <PhotoSection />

        {/* Quick Info */}
        <Card className="card-mobile">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xs font-bold text-gray-900">Mid-November 2025</div>
                <div className="text-xs text-gray-500">Opening Target</div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">~23 days</div>
                <div className="text-xs text-gray-500">Until Opening</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <PhotoUpload 
          onUpload={(photo) => {
            console.log('Photo uploaded:', photo)
            setShowPhotoUpload(false)
          }}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </ScrollArea>
  )
}

function PhotoSection() {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

  const { data: photosResponse } = useQuery({
    queryKey: ['photos'],
    queryFn: async () => {
      const response = await fetch('/api/photos?limit=6')
      if (!response.ok) throw new Error('Failed to fetch photos')
      return response.json()
    },
  })

  const photos = photosResponse?.data || []

  return (
    <>
      <Card className="card-mobile">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>LATEST PHOTOS ({photos.length})</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowPhotoUpload(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-3">
            {photos.slice(0, 6).map((photo: any, index: number) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={photo.thumbnail} 
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center">
                          <div class="text-lg mb-1">${photo.category === 'kitchen' ? '🍳' : photo.category === 'bar' ? '🍺' : '📷'}</div>
                          <div class="text-xs text-gray-500">${photo.category}</div>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
            ))}
            {photos.length === 0 && [1, 2, 3].map((index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            See All Photos
          </Button>
        </CardContent>
      </Card>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <PhotoUpload 
          onUpload={(photo) => {
            console.log('Photo uploaded:', photo)
            setShowPhotoUpload(false)
          }}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </>
  )
}

function generateWeekSchedule() {
  const today = new Date()
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayName = i === 0 ? 'Today' : 
                   i === 1 ? 'Tomorrow' : 
                   date.toLocaleDateString('en-US', { weekday: 'long' })
    
    const tasks = i === 2 ? ['⏰ 3 decisions due to Arushi'] :
                  i === 3 ? ['🏗️ Scaffolding installation (Vishal)'] :
                  i === 4 ? ['🎨 Painting starts (Vishal)', '🏗️ Kitchen ducting (Pradeep)'] :
                  []
    
    days.push({
      name: dayName,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks
    })
  }
  
  return days
}