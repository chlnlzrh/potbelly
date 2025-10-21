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
    
    // Get urgent tasks
    const urgentTasks = tasks.filter(t => 
      t.priority === 'Critical' || 
      t.priority === 'High' ||
      new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).slice(0, 8);
    
    // Get contractors with phone numbers
    const contractorPhones = {
      'Vishal': '+91-98765-43210',
      'Sabharwal': '+91-98765-43211', 
      'Arushi': '+91-98765-43212',
      'Sandeep': '+91-98765-43213',
      'Pradeep': '+91-98765-43214',
      'Bhargav': '+91-98765-43215'
    };
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Restaurant Build - Pooja's Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc; 
            line-height: 1.4;
        }
        
        /* Mobile First - iPhone 17 Pro Max */
        .container { 
            padding: 16px;
            max-width: 100%;
        }
        
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .header h1 { 
            font-size: 24px; 
            font-weight: 700; 
            margin-bottom: 8px;
        }
        
        .progress-overview {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }
        
        .progress-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .big-number {
            font-size: 36px;
            font-weight: bold;
            color: #1f2937;
            display: block;
        }
        
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .card h3 { 
            color: #1f2937; 
            margin-bottom: 16px; 
            font-size: 18px; 
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .task-item {
            background: #f8fafc;
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            position: relative;
        }
        
        .task-urgent { border-left-color: #ef4444; background: #fef2f2; }
        .task-critical { border-left-color: #dc2626; background: #fef2f2; }
        
        .task-title { 
            font-weight: 600; 
            margin-bottom: 8px;
            font-size: 16px;
            color: #1f2937;
        }
        
        .task-meta { 
            font-size: 14px; 
            color: #64748b; 
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            transition: width 0.3s;
        }
        
        .call-btn {
            background: #10b981;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 8px;
        }
        
        .call-btn:active {
            background: #059669;
            transform: scale(0.98);
        }
        
        .contractor-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .contractor-card {
            background: #f1f5f9;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }
        
        .contractor-name {
            font-weight: 600;
            margin-bottom: 4px;
            color: #1f2937;
        }
        
        .contractor-tasks {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
        }
        
        /* Desktop Styles */
        @media (min-width: 1024px) {
            .container { 
                max-width: 1200px;
                margin: 0 auto;
                padding: 24px;
            }
            
            .header h1 { font-size: 32px; }
            
            .main-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 24px;
            }
            
            .progress-overview {
                grid-template-columns: repeat(4, 1fr);
                margin-bottom: 32px;
            }
            
            .contractor-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .task-list {
                max-height: 600px;
                overflow-y: auto;
            }
        }
        
        .target-date {
            background: #fef3c7;
            color: #d97706;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Potbelly Restaurant Build</h1>
            <p>Your construction project dashboard</p>
            <div class="target-date">Target Opening: ${summary.targetOpening}</div>
        </div>

        <div class="progress-overview">
            <div class="progress-card">
                <span class="big-number">${summary.summary.total}</span>
                <div style="color: #64748b; font-size: 14px;">Total Tasks</div>
            </div>
            <div class="progress-card">
                <span class="big-number" style="color: #2563eb;">${summary.summary.inProgress}</span>
                <div style="color: #64748b; font-size: 14px;">In Progress</div>
            </div>
            <div class="progress-card">
                <span class="big-number" style="color: #d97706;">${summary.summary.awaitingDecision}</span>
                <div style="color: #64748b; font-size: 14px;">Need Decisions</div>
            </div>
            <div class="progress-card">
                <span class="big-number" style="color: #16a34a;">${summary.summary.completed}</span>
                <div style="color: #64748b; font-size: 14px;">Completed</div>
            </div>
        </div>

        <div class="main-grid">
            <div>
                <div class="card">
                    <h3>🚨 Urgent Tasks (${urgentTasks.length})</h3>
                    <div class="task-list">
                        ${urgentTasks.map(task => `
                            <div class="task-item ${task.priority.toLowerCase() === 'critical' ? 'task-critical' : task.priority.toLowerCase() === 'high' ? 'task-urgent' : ''}">
                                <div class="task-title">${task.title}</div>
                                <div class="task-meta">
                                    <span><strong>${task.owner}</strong> • Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                                    <span style="background: #${task.priority === 'Critical' ? 'dc2626' : task.priority === 'High' ? 'ea580c' : '2563eb'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${task.priority}</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                                </div>
                                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${task.progress}% Complete</div>
                                ${contractorPhones[task.owner] ? `<a href="tel:${contractorPhones[task.owner]}" class="call-btn">📞 Call ${task.owner}</a>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <h3>📋 All Tasks (${tasks.length})</h3>
                    <div class="task-list" style="max-height: 400px; overflow-y: auto;">
                        ${tasks.map(task => `
                            <div class="task-item">
                                <div class="task-title">${task.title}</div>
                                <div class="task-meta">
                                    <span><strong>${task.owner}</strong></span>
                                    <span style="background: #${task.status === 'Completed' ? '16a34a' : task.status === 'In Progress' ? '2563eb' : task.status === 'Awaiting Decision' ? 'ea580c' : '64748b'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${task.status}</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                                </div>
                                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${task.progress}% Complete</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <h3>👥 Your Contractors</h3>
                    <div class="contractor-grid">
                        ${Object.entries(contractorPhones).map(([name, phone]) => {
                            const contractorTasks = tasks.filter(t => t.owner === name);
                            const activeTasks = contractorTasks.filter(t => t.status === 'In Progress').length;
                            return `
                                <div class="contractor-card">
                                    <div class="contractor-name">${name}</div>
                                    <div class="contractor-tasks">${contractorTasks.length} tasks • ${activeTasks} active</div>
                                    <a href="tel:${phone}" class="call-btn">📞 Call</a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="card">
                    <h3>📊 Project Status</h3>
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                            ${summary.summary.progress}%
                        </div>
                        <div style="color: #64748b; margin-bottom: 16px;">Overall Progress</div>
                        <div class="progress-bar" style="height: 12px;">
                            <div class="progress-fill" style="width: ${summary.summary.progress}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `);
    
  } else if (req.method === 'GET' && req.url === '/api/tasks') {
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: tasks, total: tasks.length }));
    
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('🏗️ POOJA\'S RESTAURANT BUILD DASHBOARD');
  console.log(`📱 iPhone & 💻 Desktop: http://localhost:${PORT}`);
  console.log('📞 One-tap contractor calling enabled');
  console.log('✅ Real project data loaded');
});