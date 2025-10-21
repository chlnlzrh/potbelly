import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days overdue`
  } else if (diffInDays === 0) {
    return 'Due today'
  } else if (diffInDays === 1) {
    return 'Due tomorrow'
  } else if (diffInDays <= 7) {
    return `Due in ${diffInDays} days`
  } else {
    return formatDate(date)
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'in progress':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'awaiting decision':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'not started':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'scheduled':
      return 'text-indigo-600 bg-indigo-50 border-indigo-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function generatePhoneUrl(phone: string): string {
  // Clean phone number and create tel: link
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  return `tel:${cleanPhone}`
}

export function generateWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '')
  const text = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${cleanPhone}${text ? `?text=${text}` : ''}`
}

export function generateSMSUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const text = message ? encodeURIComponent(message) : ''
  return `sms:${cleanPhone}${text ? `?body=${text}` : ''}`
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function groupTasksByStatus(tasks: any[]) {
  return tasks.reduce((groups, task) => {
    const status = task.status || 'Unknown'
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(task)
    return groups
  }, {} as Record<string, any[]>)
}

export function groupTasksByOwner(tasks: any[]) {
  return tasks.reduce((groups, task) => {
    const owners = task.owner.split(/[+&,]/).map((o: string) => o.trim())
    owners.forEach((owner: string) => {
      if (!groups[owner]) {
        groups[owner] = []
      }
      groups[owner].push(task)
    })
    return groups
  }, {} as Record<string, any[]>)
}

export function isUrgent(dueDate: string | Date, priority: string): boolean {
  const due = new Date(dueDate)
  const now = new Date()
  const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return diffInDays <= 3 || priority === 'Critical'
}

export function sortTasksByPriority(tasks: any[]) {
  const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
  
  return tasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // If same priority, sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

export function getContractorAvailability(lastContact: string | undefined): 'available' | 'busy' | 'unknown' {
  if (!lastContact) return 'unknown'
  
  const lastContactDate = new Date(lastContact)
  const now = new Date()
  const hoursSinceContact = (now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60)
  
  if (hoursSinceContact < 4) return 'busy'
  if (hoursSinceContact < 24) return 'available'
  return 'unknown'
}

export function generateContractorMessage(contractorName: string, context?: string): string {
  const templates = {
    'Vishal': 'Hi Vishal, checking on today\'s progress. Any updates?',
    'Arushi': 'Hi Arushi, need your input on pending decisions. When can we connect?',
    'Sabharwal': 'Hi Sabharwal, how is the woodwork progressing?',
    'Sandeep': 'Hi Sandeep, checking on electrical work timeline.',
    'Pradeep': 'Hi Pradeep, confirming kitchen ducting schedule.',
    'default': `Hi ${contractorName}, checking on project progress.`
  }
  
  return templates[contractorName as keyof typeof templates] || templates.default
}