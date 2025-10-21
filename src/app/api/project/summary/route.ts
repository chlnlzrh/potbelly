/**
 * Project Summary API - Dashboard overview data
 */

import { NextResponse } from 'next/server'
import { dataManager } from '@/lib/data-manager'

export async function GET() {
  try {
    const summary = dataManager.getProjectSummary()
    const urgentTasks = dataManager.getUrgentTasks()
    const decisionTasks = dataManager.getDecisionTasks()
    const recentUpdates = dataManager.getUpdates().slice(0, 5)
    const contractors = dataManager.getContractors()

    // Calculate contractor workloads
    const contractorWorkloads = contractors.map(contractor => {
      const tasks = dataManager.getTasksByOwner(contractor.name)
      const activeTasks = tasks.filter(t => t.status !== 'Completed')
      const criticalTasks = activeTasks.filter(t => t.priority === 'Critical' || t.priority === 'High')
      
      return {
        ...contractor,
        activeTasks: activeTasks.length,
        criticalTasks: criticalTasks.length,
        nextDue: activeTasks.length > 0 ? 
          activeTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0].dueDate 
          : null
      }
    })

    // Generate AI-like insights
    const insights = generateProjectInsights(summary, urgentTasks, decisionTasks)

    return NextResponse.json({
      success: true,
      data: {
        summary,
        urgentTasks: urgentTasks.slice(0, 5),
        decisionTasks: decisionTasks.slice(0, 5),
        recentUpdates,
        contractors: contractorWorkloads,
        insights,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching project summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project summary' },
      { status: 500 }
    )
  }
}

function generateProjectInsights(summary: any, urgentTasks: any[], decisionTasks: any[]) {
  const insights = []

  // Decision bottleneck insight
  if (decisionTasks.length >= 3) {
    insights.push({
      type: 'critical',
      title: 'Decision Bottleneck Detected',
      message: `${decisionTasks.length} decisions are pending. This is blocking project progress.`,
      action: 'Schedule immediate call with Arushi',
      priority: 'high'
    })
  }

  // Timeline risk insight
  if (urgentTasks.length >= 5) {
    insights.push({
      type: 'warning',
      title: 'Timeline Risk',
      message: `${urgentTasks.length} tasks are due in the next 3 days. Consider resource reallocation.`,
      action: 'Review critical path and priorities',
      priority: 'medium'
    })
  }

  // Progress insight
  if (summary.progress >= 75) {
    insights.push({
      type: 'success',
      title: 'Excellent Progress',
      message: `Project is ${summary.progress}% complete and on track for mid-November opening.`,
      action: 'Maintain current momentum',
      priority: 'low'
    })
  }

  // Dependency insight for painting
  const paintingTask = urgentTasks.find(t => t.title.toLowerCase().includes('painting'))
  if (paintingTask) {
    insights.push({
      type: 'info',
      title: 'Critical Dependency Alert',
      message: 'Painting starts Friday. Ensure scaffolding and ducting are completed first.',
      action: 'Confirm readiness with Vishal and Pradeep',
      priority: 'high'
    })
  }

  return insights
}