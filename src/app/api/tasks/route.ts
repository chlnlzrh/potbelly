/**
 * Tasks API - Simple CRUD operations using file-based data
 */

import { NextRequest, NextResponse } from 'next/server'
import { dataManager } from '@/lib/data-manager'
import { z } from 'zod'

const TaskSchema = z.object({
  title: z.string().min(1),
  owner: z.string().min(1),
  dueDate: z.string(),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']),
  status: z.enum([
    'Not Started', 
    'In Progress', 
    'Awaiting Decision', 
    'Scheduled', 
    'Awaiting Prerequisites', 
    'Awaiting Vendor', 
    'Design in Progress', 
    'Design Approved', 
    'Completed'
  ]),
  progress: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  addedBy: z.enum(['system', 'pooja', 'arushi']).optional()
})

const UpdateTaskSchema = TaskSchema.partial()

/**
 * GET /api/tasks - Get all tasks with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const urgent = searchParams.get('urgent')
    const decisions = searchParams.get('decisions')

    let tasks = dataManager.getTasks()

    // Apply filters
    if (owner) {
      tasks = tasks.filter(task => 
        task.owner.toLowerCase().includes(owner.toLowerCase())
      )
    }

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (priority) {
      tasks = tasks.filter(task => task.priority === priority)
    }

    if (urgent === 'true') {
      tasks = dataManager.getUrgentTasks()
    }

    if (decisions === 'true') {
      tasks = dataManager.getDecisionTasks()
    }

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length
    })

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = TaskSchema.parse(body)
    
    const newTask = dataManager.addTask(validatedData)
    
    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating task:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid task data',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/tasks - Update an existing task
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const validatedUpdates = UpdateTaskSchema.parse(updates)
    const updatedTask = dataManager.updateTask(id, validatedUpdates)
    
    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    })

  } catch (error) {
    console.error('Error updating task:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid update data',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks - Delete a task
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const deleted = dataManager.deleteTask(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}