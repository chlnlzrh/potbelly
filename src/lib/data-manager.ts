/**
 * Simple Data Manager - No Database Required
 * Reads from existing markdown files and allows Pooja to add/update data
 */

import fs from 'fs'
import path from 'path'

export interface Task {
  id: string
  title: string
  owner: string
  dueDate: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Not Started' | 'In Progress' | 'Awaiting Decision' | 'Scheduled' | 'Awaiting Prerequisites' | 'Awaiting Vendor' | 'Design in Progress' | 'Design Approved' | 'Completed'
  progress?: number
  notes?: string
  addedBy?: 'system' | 'pooja' | 'arushi'
  createdAt?: string
  updatedAt?: string
}

export interface Contractor {
  id: string
  name: string
  role: string
  phone: string
  whatsapp?: string
  email?: string
  lastContact?: string
  responseRate?: number
  currentTasks: string[]
}

export interface Photo {
  id: string
  url: string
  taskId?: string
  area: string
  description: string
  uploadedBy: string
  uploadedAt: string
  contractor?: string
}

export interface ProjectUpdate {
  id: string
  message: string
  type: 'status_update' | 'new_task' | 'photo_upload' | 'decision_made' | 'note'
  addedBy: string
  createdAt: string
  taskId?: string
}

class DataManager {
  private dataDir = path.join(process.cwd(), 'data')
  private tasksFile = path.join(this.dataDir, 'tasks.json')
  private photosFile = path.join(this.dataDir, 'photos.json')
  private updatesFile = path.join(this.dataDir, 'updates.json')
  private contractorsFile = path.join(this.dataDir, 'contractors.json')

  constructor() {
    this.ensureDataDirectory()
    this.initializeFromMarkdown()
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }
  }

  /**
   * Parse the existing Action Items markdown file
   */
  private initializeFromMarkdown() {
    try {
      const markdownPath = path.join(process.cwd(), 'PB Build - Action Items.md')
      
      if (!fs.existsSync(markdownPath)) {
        console.warn('Action Items markdown file not found')
        return
      }

      const content = fs.readFileSync(markdownPath, 'utf-8')
      const tasks = this.parseMarkdownToTasks(content)
      
      // Only initialize if tasks.json doesn't exist (first time)
      if (!fs.existsSync(this.tasksFile)) {
        this.saveTasks(tasks)
        console.log(`Initialized ${tasks.length} tasks from markdown`)
      }

      // Initialize contractors if not exists
      if (!fs.existsSync(this.contractorsFile)) {
        const contractors = this.extractContractorsFromTasks(tasks)
        this.saveContractors(contractors)
        console.log(`Initialized ${contractors.length} contractors`)
      }

    } catch (error) {
      console.error('Error initializing from markdown:', error)
    }
  }

  private parseMarkdownToTasks(content: string): Task[] {
    const tasks: Task[] = []
    const lines = content.split('\n')
    
    for (const line of lines) {
      // Parse table rows (skip headers and separators)
      if (line.startsWith('|') && !line.includes('---') && !line.includes('Action Item')) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col)
        
        if (columns.length >= 5) {
          const [title, owner, dueDate, priority, status] = columns
          
          tasks.push({
            id: this.generateId(),
            title: title.replace(/\*\*/g, ''), // Remove markdown bold
            owner: owner,
            dueDate: dueDate,
            priority: priority as any,
            status: status as any,
            addedBy: 'system',
            createdAt: new Date().toISOString()
          })
        }
      }
    }
    
    return tasks
  }

  private extractContractorsFromTasks(tasks: Task[]): Contractor[] {
    const contractorMap = new Map<string, Contractor>()
    
    tasks.forEach(task => {
      const owners = task.owner.split(/[+&,]/).map(o => o.trim())
      
      owners.forEach(owner => {
        if (!contractorMap.has(owner)) {
          contractorMap.set(owner, {
            id: this.generateId(),
            name: owner,
            role: this.getContractorRole(owner),
            phone: this.getContractorPhone(owner),
            currentTasks: []
          })
        }
        
        contractorMap.get(owner)!.currentTasks.push(task.id)
      })
    })
    
    return Array.from(contractorMap.values())
  }

  private getContractorRole(name: string): string {
    const roles: Record<string, string> = {
      'Vishal': 'Main Contractor',
      'Sabharwal': 'Woodwork & Doors',
      'Arushi': 'Designer & Project Manager',
      'Sandeep': 'Electrical',
      'Pradeep': 'Kitchen Ducting',
      'Bhargav': 'Electrical/Misc',
      'Kitchen Equipment Vendor': 'Equipment Supplier'
    }
    return roles[name] || 'Contractor'
  }

  private getContractorPhone(name: string): string {
    const phones: Record<string, string> = {
      'Vishal': '+91 98765 43210',
      'Sabharwal': '+91 98765 43211',
      'Arushi': '+91 98765 43212',
      'Sandeep': '+91 98765 43213',
      'Pradeep': '+91 98765 43214',
      'Bhargav': '+91 98765 43215',
      'Kitchen Equipment Vendor': '+91 98765 43216'
    }
    return phones[name] || '+91 98765 43200'
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // CRUD Operations for Tasks
  public getTasks(): Task[] {
    try {
      if (fs.existsSync(this.tasksFile)) {
        const data = fs.readFileSync(this.tasksFile, 'utf-8')
        return JSON.parse(data)
      }
      return []
    } catch {
      return []
    }
  }

  public saveTasks(tasks: Task[]): void {
    fs.writeFileSync(this.tasksFile, JSON.stringify(tasks, null, 2))
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasks()
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tasks.push(newTask)
    this.saveTasks(tasks)
    
    // Log the update
    this.addUpdate({
      message: `New task added: ${newTask.title}`,
      type: 'new_task',
      addedBy: task.addedBy || 'pooja',
      taskId: newTask.id
    })
    
    return newTask
  }

  public updateTask(taskId: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks()
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    
    if (taskIndex === -1) return null
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    tasks[taskIndex] = updatedTask
    this.saveTasks(tasks)
    
    // Log the update
    this.addUpdate({
      message: `Task updated: ${updatedTask.title}`,
      type: 'status_update',
      addedBy: updates.addedBy || 'pooja',
      taskId: taskId
    })
    
    return updatedTask
  }

  public deleteTask(taskId: string): boolean {
    const tasks = this.getTasks()
    const filteredTasks = tasks.filter(t => t.id !== taskId)
    
    if (filteredTasks.length !== tasks.length) {
      this.saveTasks(filteredTasks)
      return true
    }
    
    return false
  }

  // Photo Management
  public getPhotos(): Photo[] {
    try {
      if (fs.existsSync(this.photosFile)) {
        const data = fs.readFileSync(this.photosFile, 'utf-8')
        return JSON.parse(data)
      }
      return []
    } catch {
      return []
    }
  }

  public addPhoto(photo: Omit<Photo, 'id' | 'uploadedAt'>): Photo {
    const photos = this.getPhotos()
    const newPhoto: Photo = {
      ...photo,
      id: this.generateId(),
      uploadedAt: new Date().toISOString()
    }
    
    photos.push(newPhoto)
    fs.writeFileSync(this.photosFile, JSON.stringify(photos, null, 2))
    
    // Log the update
    this.addUpdate({
      message: `Photo uploaded: ${newPhoto.description}`,
      type: 'photo_upload',
      addedBy: photo.uploadedBy,
      taskId: photo.taskId
    })
    
    return newPhoto
  }

  // Project Updates/Activity Feed
  public getUpdates(): ProjectUpdate[] {
    try {
      if (fs.existsSync(this.updatesFile)) {
        const data = fs.readFileSync(this.updatesFile, 'utf-8')
        return JSON.parse(data).sort((a: ProjectUpdate, b: ProjectUpdate) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      return []
    } catch {
      return []
    }
  }

  public addUpdate(update: Omit<ProjectUpdate, 'id' | 'createdAt'>): ProjectUpdate {
    const updates = this.getUpdates()
    const newUpdate: ProjectUpdate = {
      ...update,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    }
    
    updates.push(newUpdate)
    fs.writeFileSync(this.updatesFile, JSON.stringify(updates, null, 2))
    
    return newUpdate
  }

  // Contractors
  public getContractors(): Contractor[] {
    try {
      if (fs.existsSync(this.contractorsFile)) {
        const data = fs.readFileSync(this.contractorsFile, 'utf-8')
        return JSON.parse(data)
      }
      return []
    } catch {
      return []
    }
  }

  private saveContractors(contractors: Contractor[]): void {
    fs.writeFileSync(this.contractorsFile, JSON.stringify(contractors, null, 2))
  }

  // Analytics/Summary Methods
  public getProjectSummary() {
    const tasks = this.getTasks()
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'Completed').length
    const inProgress = tasks.filter(t => t.status === 'In Progress').length
    const urgent = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length
    const awaitingDecision = tasks.filter(t => t.status === 'Awaiting Decision').length
    
    return {
      total,
      completed,
      inProgress,
      urgent,
      awaitingDecision,
      progress: Math.round((completed / total) * 100),
      status: urgent > 5 ? 'at_risk' : inProgress > completed ? 'active' : 'on_track'
    }
  }

  public getTasksByOwner(owner: string): Task[] {
    return this.getTasks().filter(task => 
      task.owner.toLowerCase().includes(owner.toLowerCase())
    )
  }

  public getUrgentTasks(): Task[] {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000))
    
    return this.getTasks().filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate <= threeDaysFromNow && task.status !== 'Completed'
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  public getDecisionTasks(): Task[] {
    return this.getTasks().filter(task => 
      task.status === 'Awaiting Decision' || 
      task.owner.toLowerCase().includes('arushi')
    )
  }
}

// Export singleton instance
export const dataManager = new DataManager()