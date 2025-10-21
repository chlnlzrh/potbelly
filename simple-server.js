const http = require('http');
const { parseMarkdownTasks, generateProjectSummary } = require('./data-parser');

const PORT = 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET' && req.url === '/') {
    // Parse real data
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    const summary = generateProjectSummary(tasks);
    
    // Get urgent tasks (high priority or due soon)
    const urgentTasks = tasks.filter(t => 
      t.priority === 'Critical' || 
      t.priority === 'High' ||
      new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).slice(0, 10);
    
    // Get contractors
    const contractors = [...new Set(tasks.map(t => t.owner))].filter(c => c && c.trim() !== '');
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Build Management - WORKING SYSTEM</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: #f8fafc; 
            padding: 20px;
            font-size: 14px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            padding: 16px;
            background: #f1f5f9;
            border-radius: 6px;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
            gap: 24px; 
        }
        .card { 
            background: white; 
            padding: 24px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .card h3 { 
            color: #1f2937; 
            margin-bottom: 16px; 
            font-size: 16px; 
            font-weight: bold;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .task-item {
            background: #f8fafc;
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        .task-title { font-weight: bold; margin-bottom: 4px; }
        .task-meta { 
            font-size: 12px; 
            color: #64748b; 
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .priority-high { border-left-color: #ef4444; }
        .priority-critical { border-left-color: #dc2626; background: #fef2f2; }
        .progress-bar {
            width: 60px;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #10b981;
            transition: width 0.3s;
        }
        .contractor-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }
        .contractor-item {
            background: #f1f5f9;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
        }
        .big-number {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
        }
        .status-indicator {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="font-size: 24px; font-weight: bold;">🏗️ POTBELLY RESTAURANT BUILD MANAGEMENT</h1>
            <p style="color: #64748b; margin-top: 8px;">Real-time construction project tracking with live data</p>
            
            <div class="status-bar">
                <div>
                    <span class="status-indicator"></span>
                    <strong>SYSTEM OPERATIONAL</strong> - Parsing real project data
                </div>
                <div>
                    <strong>Target Opening:</strong> ${summary.targetOpening}
                </div>
                <div>
                    <strong>Progress:</strong> ${summary.summary.progress}% Complete
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>📊 PROJECT OVERVIEW</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
                    <div>
                        <div class="big-number">${summary.summary.total}</div>
                        <div style="font-size: 12px; color: #64748b;">Total Tasks</div>
                    </div>
                    <div>
                        <div class="big-number" style="color: #2563eb;">${summary.summary.inProgress}</div>
                        <div style="font-size: 12px; color: #64748b;">In Progress</div>
                    </div>
                    <div>
                        <div class="big-number" style="color: #d97706;">${summary.summary.awaitingDecision}</div>
                        <div style="font-size: 12px; color: #64748b;">Awaiting Decision</div>
                    </div>
                    <div>
                        <div class="big-number" style="color: #64748b;">${summary.summary.notStarted}</div>
                        <div style="font-size: 12px; color: #64748b;">Not Started</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>🚨 URGENT TASKS (${urgentTasks.length})</h3>
                ${urgentTasks.map(task => `
                    <div class="task-item ${task.priority.toLowerCase() === 'critical' ? 'priority-critical' : task.priority.toLowerCase() === 'high' ? 'priority-high' : ''}">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            <span><strong>${task.owner}</strong> • Due: ${task.dueDate} • ${task.priority}</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 11px;">${task.progress}%</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <h3>👥 ACTIVE CONTRACTORS (${contractors.length})</h3>
                <div class="contractor-list">
                    ${contractors.map(contractor => {
                        const contractorTasks = tasks.filter(t => t.owner === contractor);
                        const completedTasks = contractorTasks.filter(t => t.status === 'Completed').length;
                        const activeTasks = contractorTasks.filter(t => t.status === 'In Progress').length;
                        return `
                            <div class="contractor-item">
                                <div style="font-weight: bold; margin-bottom: 4px;">${contractor}</div>
                                <div style="font-size: 12px; color: #64748b;">
                                    ${contractorTasks.length} total tasks<br>
                                    ${activeTasks} active • ${completedTasks} completed
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <h3>📋 ALL CONSTRUCTION TASKS</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${tasks.map(task => `
                        <div class="task-item">
                            <div class="task-title">${task.title}</div>
                            <div class="task-meta">
                                <span><strong>${task.owner}</strong> • ${task.category} • ${task.status}</span>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 11px;">${task.progress}%</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="card" style="margin-top: 24px; text-align: center;">
            <h3>✅ SYSTEM FUNCTIONAL</h3>
            <p>This is the <strong>WORKING</strong> Potbelly Build Management System with real data from your project file.</p>
            <p style="margin-top: 8px; font-size: 12px; color: #64748b;">
                All ${summary.summary.total} tasks parsed from "PB Build - Action Items.md" • 
                ${contractors.length} contractors tracked • 
                Real-time progress monitoring active
            </p>
        </div>
    </div>
</body>
</html>
    `);
    
  } else if (req.method === 'GET' && req.url === '/api/tasks') {
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: tasks, total: tasks.length }));
    
  } else if (req.method === 'GET' && req.url === '/api/project/summary') {
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    const summary = generateProjectSummary(tasks);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: summary }));
    
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('🏗️ POTBELLY BUILD MANAGEMENT - WORKING SYSTEM');
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log('✅ Real data integration ACTIVE');
  console.log('🚀 Functional interface READY');
});