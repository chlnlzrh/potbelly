import { NextRequest, NextResponse } from 'next/server'
import { DataManager } from '@/lib/data-manager'

export async function GET(request: NextRequest) {
  try {
    const dataManager = new DataManager()
    const tasks = await dataManager.getTasks()
    
    // Generate AI insights based on task data
    const insights = await generateInsights(tasks)

    return NextResponse.json({
      success: true,
      data: insights,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

async function generateInsights(tasks: any[]) {
  const insights = []
  
  // Analyze task completion patterns
  const completedTasks = tasks.filter(t => t.status === 'Completed')
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress')
  const urgentTasks = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High')
  const overdueTasksCount = getOverdueTasks(tasks).length
  
  // Calculate progress metrics
  const completionRate = Math.round((completedTasks.length / tasks.length) * 100)
  const avgTaskDuration = calculateAverageTaskDuration(completedTasks)
  
  // Critical path analysis
  if (urgentTasks.length > 5) {
    insights.push({
      type: 'critical',
      title: 'High Priority Bottleneck Alert',
      message: `${urgentTasks.length} urgent tasks detected. Consider reallocating resources or extending timeline.`,
      action: 'Review critical path and resource allocation',
      priority: 'immediate',
      impact: 'high'
    })
  }

  // Contractor performance insights
  const contractorPerformance = analyzeContractorPerformance(tasks)
  const topPerformer = contractorPerformance.sort((a, b) => b.completionRate - a.completionRate)[0]
  const strugglingContractor = contractorPerformance.find(c => c.completionRate < 60)

  if (topPerformer && topPerformer.completionRate > 85) {
    insights.push({
      type: 'success',
      title: 'Outstanding Performance',
      message: `${topPerformer.name} has ${topPerformer.completionRate}% completion rate. Consider their methods for other teams.`,
      action: 'Share best practices with other contractors',
      priority: 'low',
      impact: 'medium'
    })
  }

  if (strugglingContractor) {
    insights.push({
      type: 'warning',
      title: 'Performance Concern',
      message: `${strugglingContractor.name} has ${strugglingContractor.completionRate}% completion rate. May need additional support.`,
      action: 'Schedule check-in meeting and provide additional resources',
      priority: 'medium',
      impact: 'medium'
    })
  }

  // Timeline analysis
  if (overdueTasksCount > 0) {
    insights.push({
      type: 'warning',
      title: 'Schedule Variance',
      message: `${overdueTasksCount} tasks are overdue. Project timeline may be at risk.`,
      action: 'Review schedule and consider timeline adjustment',
      priority: 'high',
      impact: 'high'
    })
  }

  // Quality prediction
  const qualityRisk = assessQualityRisk(tasks)
  if (qualityRisk.level === 'high') {
    insights.push({
      type: 'critical',
      title: 'Quality Risk Detected',
      message: qualityRisk.message,
      action: 'Implement additional quality checks and inspections',
      priority: 'immediate',
      impact: 'high'
    })
  }

  // Resource optimization
  const resourceOptimization = analyzeResourceUtilization(tasks)
  if (resourceOptimization.suggestions.length > 0) {
    insights.push({
      type: 'info',
      title: 'Resource Optimization Opportunity',
      message: resourceOptimization.message,
      action: resourceOptimization.suggestions[0],
      priority: 'low',
      impact: 'medium'
    })
  }

  // Weather impact analysis (mock)
  const weatherImpact = getWeatherImpact()
  if (weatherImpact.impact === 'high') {
    insights.push({
      type: 'warning',
      title: 'Weather Impact Alert',
      message: weatherImpact.message,
      action: 'Reschedule outdoor work and secure materials',
      priority: 'medium',
      impact: 'medium'
    })
  }

  // Cost variance analysis
  const costAnalysis = analyzeCostVariance(tasks)
  if (costAnalysis.variance > 10) {
    insights.push({
      type: 'warning',
      title: 'Budget Variance Alert',
      message: `Project costs are ${costAnalysis.variance}% over budget in some areas.`,
      action: 'Review budget allocation and implement cost controls',
      priority: 'high',
      impact: 'high'
    })
  }

  // Positive momentum insights
  if (completionRate > 75) {
    insights.push({
      type: 'success',
      title: 'Excellent Progress',
      message: `Project is ${completionRate}% complete and on track for opening target.`,
      action: 'Maintain current pace and prepare for final phase',
      priority: 'low',
      impact: 'positive'
    })
  }

  return insights.slice(0, 8) // Limit to top 8 insights
}

function analyzeContractorPerformance(tasks: any[]) {
  const contractors = ['Vishal', 'Arushi', 'Sabharwal', 'Sandeep', 'Pradeep', 'Bhargav']
  
  return contractors.map(contractor => {
    const contractorTasks = tasks.filter(t => 
      t.owner.toLowerCase().includes(contractor.toLowerCase())
    )
    const completedTasks = contractorTasks.filter(t => t.status === 'Completed')
    
    return {
      name: contractor,
      totalTasks: contractorTasks.length,
      completedTasks: completedTasks.length,
      completionRate: contractorTasks.length > 0 
        ? Math.round((completedTasks.length / contractorTasks.length) * 100)
        : 0
    }
  })
}

function getOverdueTasks(tasks: any[]) {
  const now = new Date()
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    return dueDate < now && task.status !== 'Completed'
  })
}

function calculateAverageTaskDuration(completedTasks: any[]) {
  // Mock calculation - in real app would use actual start/end dates
  return 3.5 // days
}

function assessQualityRisk(tasks: any[]) {
  const criticalTasks = tasks.filter(t => t.priority === 'Critical')
  const inProgressCritical = criticalTasks.filter(t => t.status === 'In Progress')
  
  if (inProgressCritical.length > 3) {
    return {
      level: 'high',
      message: 'Multiple critical tasks in progress simultaneously may compromise quality.'
    }
  }
  
  return { level: 'low', message: 'Quality risk is within acceptable range.' }
}

function analyzeResourceUtilization(tasks: any[]) {
  // Mock analysis - in real app would analyze actual resource allocation
  return {
    message: 'Electrical team appears underutilized while kitchen team is at capacity.',
    suggestions: [
      'Cross-train electrical team for kitchen support tasks',
      'Stagger kitchen tasks to better distribute workload'
    ]
  }
}

function getWeatherImpact() {
  // Mock weather analysis - in real app would integrate with weather API
  const random = Math.random()
  
  if (random > 0.7) {
    return {
      impact: 'high',
      message: 'Heavy rain expected next week. Outdoor work may be delayed.'
    }
  }
  
  return {
    impact: 'low',
    message: 'Weather conditions favorable for construction work.'
  }
}

function analyzeCostVariance(tasks: any[]) {
  // Mock cost analysis - in real app would integrate with actual budget data
  return {
    variance: Math.random() > 0.5 ? 8 : 15 // 8% or 15% variance
  }
}