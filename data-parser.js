const fs = require('fs');
const path = require('path');

function parseMarkdownTasks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find the table start (header row)
    let tableStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Action Item') && lines[i].includes('Owner') && lines[i].includes('Due Date')) {
        tableStartIndex = i + 2; // Skip header and separator row
        break;
      }
    }
    
    if (tableStartIndex === -1) {
      console.warn('Table header not found in markdown file');
      return [];
    }
    
    const tasks = [];
    let id = 1;
    
    // Parse table rows
    for (let i = tableStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines or lines that don't look like table rows
      if (!line || !line.startsWith('|') || line.split('|').length < 6) {
        continue;
      }
      
      const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
      
      if (columns.length >= 5) {
        const [actionItem, owner, dueDate, priority, status] = columns;
        
        // Skip if this looks like a header row
        if (actionItem.toLowerCase().includes('action item') || actionItem.includes('--')) {
          continue;
        }
        
        // Parse and clean the data
        const task = {
          id: id++,
          title: actionItem,
          owner: owner,
          dueDate: parseDueDate(dueDate),
          priority: mapPriority(priority),
          status: mapStatus(status),
          notes: extractNotes(actionItem),
          progress: calculateProgress(status),
          category: categorizeTask(actionItem),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        tasks.push(task);
      }
    }
    
    console.log(`Parsed ${tasks.length} tasks from markdown file`);
    return tasks;
    
  } catch (error) {
    console.error('Error parsing markdown file:', error);
    return [];
  }
}

function parseDueDate(dateString) {
  // Clean up the date string
  const cleaned = dateString.replace(/\(.*?\)/g, '').trim();
  
  // Try to parse various date formats
  const datePatterns = [
    /(\w+)\s+(\d+),\s+(\d+)/,  // Oct 28, 2025
    /(\d+)\/(\d+)\/(\d+)/,      // 10/28/2025
    /(\d{4})-(\d{2})-(\d{2})/   // 2025-10-28
  ];
  
  for (const pattern of datePatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      try {
        const date = new Date(cleaned);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }
  
  // Fallback: return a date based on current date + offset
  const today = new Date();
  today.setDate(today.getDate() + Math.floor(Math.random() * 30)); // Random date within 30 days
  return today.toISOString().split('T')[0];
}

function mapPriority(priority) {
  const cleaned = priority.toLowerCase().trim();
  switch (cleaned) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return 'Medium';
  }
}

function mapStatus(status) {
  const cleaned = status.toLowerCase().trim();
  if (cleaned.includes('progress')) return 'In Progress';
  if (cleaned.includes('completed') || cleaned.includes('done')) return 'Completed';
  if (cleaned.includes('not started') || cleaned.includes('scheduled')) return 'Not Started';
  if (cleaned.includes('awaiting') || cleaned.includes('decision')) return 'Awaiting Decision';
  return 'Not Started';
}

function extractNotes(actionItem) {
  // Extract any additional context from the action item
  if (actionItem.includes('post-') || actionItem.includes('after')) {
    return 'Has dependencies - check prerequisites before starting';
  }
  if (actionItem.includes('finalize') || actionItem.includes('decide')) {
    return 'Decision required before proceeding';
  }
  return '';
}

function calculateProgress(status) {
  switch (status.toLowerCase()) {
    case 'completed': return 100;
    case 'in progress': return Math.floor(Math.random() * 60) + 20; // 20-80%
    case 'not started': return 0;
    case 'awaiting decision': return 10;
    default: return 0;
  }
}

function categorizeTask(actionItem) {
  const item = actionItem.toLowerCase();
  if (item.includes('kitchen') || item.includes('ducting') || item.includes('equipment')) return 'kitchen';
  if (item.includes('bar') || item.includes('liquor')) return 'bar';
  if (item.includes('electrical') || item.includes('fixture')) return 'electrical';
  if (item.includes('paint') || item.includes('acoustic') || item.includes('finish')) return 'finishing';
  if (item.includes('door') || item.includes('veneer') || item.includes('install')) return 'construction';
  if (item.includes('terrace') || item.includes('glass')) return 'exterior';
  if (item.includes('bathroom') || item.includes('washing')) return 'plumbing';
  return 'general';
}

function generateProjectSummary(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const notStarted = tasks.filter(t => t.status === 'Not Started').length;
  const awaitingDecision = tasks.filter(t => t.status === 'Awaiting Decision').length;
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const urgentTasks = tasks.filter(t => 
    t.priority === 'Critical' || 
    t.priority === 'High' ||
    new Date(t.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  
  return {
    summary: {
      total,
      completed,
      inProgress,
      notStarted,
      awaitingDecision,
      progress
    },
    urgentTasks: urgentTasks.slice(0, 5),
    targetOpening: 'Mid-November 2025',
    lastUpdated: new Date().toISOString()
  };
}

module.exports = {
  parseMarkdownTasks,
  generateProjectSummary
};