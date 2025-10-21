const http = require('http');
const url = require('url');
const { parseMarkdownTasks, generateProjectSummary } = require('./data-parser');
const { addTask, updateTask, addDecision, updateDecision, getAllData } = require('./data-manager');

const PORT = 8080;

function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && path === '/') {
    // Parse real data from corrected markdown + user data
    const markdownTasks = parseMarkdownTasks('./PB Build - Action Items - CORRECTED.md');
    const userData = getAllData();
    const allTasks = [...markdownTasks, ...userData.tasks];
    const summary = generateProjectSummary(allTasks);
    
    // Get urgent tasks
    const urgentTasks = allTasks.filter(t => 
      t.priority === 'Critical' || 
      t.priority === 'High' ||
      new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).slice(0, 8);
    
    // Get pending decisions
    const pendingDecisions = userData.decisions.filter(d => d.status === 'Pending').slice(0, 5);
    
    // Real contractor phone numbers from phone numbers.md
    const contractorPhones = {
      'Arushi': '+91-9810312309',     // Architect and Interior Design
      'Sabharwal': '+91-9868226580',  // Wood Work
      'Vishal': '+91-9310203344',     // General Contractor
      'Sandeep': '+91-9810165187',    // Tensile Structure
      'Pradeep': '+91-9540475132',    // HVAC & Exhaust
      'Sunil': '+91-9810086477',      // Kitchen
      'Bhargav': '+91-9999999999'     // (No number in file, using placeholder)
    };
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Restaurant Build - Data Entry</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc; 
            line-height: 1.4;
        }
        
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
        
        .nav-tabs {
            display: flex;
            background: white;
            border-radius: 12px;
            padding: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .nav-tab {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            background: transparent;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .nav-tab.active {
            background: #3b82f6;
            color: white;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
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
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 600;
            color: #374151;
        }
        
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
        }
        
        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .btn {
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }
        
        .btn:hover {
            background: #059669;
        }
        
        .btn:active {
            transform: scale(0.98);
        }
        
        .btn-secondary {
            background: #6b7280;
        }
        
        .btn-secondary:hover {
            background: #4b5563;
        }
        
        .task-item {
            background: #f8fafc;
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
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
        
        .update-form {
            margin-top: 12px;
            padding: 12px;
            background: #f1f5f9;
            border-radius: 6px;
            display: none;
        }
        
        .update-form.active {
            display: block;
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
        
        .edit-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 8px;
        }
        
        .clickable-card {
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .clickable-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .details-section {
            margin-top: 20px;
            display: none;
            animation: slideDown 0.3s ease;
        }
        
        .details-section.active {
            display: block;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .data-table th {
            background: #f8fafc;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            font-size: 14px;
        }
        
        .data-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            vertical-align: top;
        }
        
        .data-table tr:hover {
            background: #f8fafc;
        }
        
        .data-table tr:last-child td {
            border-bottom: none;
        }
        
        .status-badge-table {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .priority-badge-table {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .progress-mini {
            width: 60px;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }
        
        .progress-mini-fill {
            height: 100%;
            background: #10b981;
        }
        
        .close-details {
            float: right;
            background: #6b7280;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-bottom: 16px;
        }
        
        .close-details:hover {
            background: #4b5563;
        }
        
        .message {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            display: none;
        }
        
        .message.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #10b981;
        }
        
        .message.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #ef4444;
        }
        
        .inline-edit {
            border: 1px solid transparent;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
            font-size: 14px;
        }
        
        .inline-edit:hover {
            border-color: #e5e7eb;
            background: #f9fafb;
        }
        
        .inline-edit:focus {
            outline: none;
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .data-table td .inline-edit {
            width: 100%;
            min-width: 100px;
        }
        
        .data-table input[type="range"] {
            margin: 0;
            padding: 0;
        }
        
        @media (min-width: 768px) {
            .container { 
                max-width: 1200px;
                margin: 0 auto;
                padding: 24px;
            }
            
            .header h1 { font-size: 32px; }
            
            .form-row {
                grid-template-columns: 1fr 1fr 1fr;
            }
            
            .btn {
                width: auto;
                min-width: 120px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Potbelly Restaurant Build</h1>
            <p>Task & Decision Management</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('dashboard')">🏠 Dashboard</button>
            <button class="nav-tab" onclick="showTab('overview')">📊 Tasks</button>
            <button class="nav-tab" onclick="showTab('add-task')">➕ Add Task</button>
            <button class="nav-tab" onclick="showTab('decisions')">⚖️ Decisions</button>
            <button class="nav-tab" onclick="showTab('update')">✏️ Update</button>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="progress-overview" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                <div class="progress-card clickable-card" onclick="toggleDetails('all-tasks')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #1f2937; display: block;">${summary.summary.total}</span>
                    <div style="color: #64748b; font-size: 14px;">Total Tasks</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card clickable-card" onclick="toggleDetails('in-progress')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #2563eb; display: block;">${summary.summary.inProgress}</span>
                    <div style="color: #64748b; font-size: 14px;">In Progress</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card clickable-card" onclick="toggleDetails('decisions')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #d97706; display: block;">${summary.summary.awaitingDecision}</span>
                    <div style="color: #64748b; font-size: 14px;">Need Decisions</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card clickable-card" onclick="toggleDetails('completed')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #16a34a; display: block;">${summary.summary.completed}</span>
                    <div style="color: #64748b; font-size: 14px;">Completed</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
            </div>
            
            <!-- Task Details Sections -->
            <div id="all-tasks-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('all-tasks');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">All Tasks (${allTasks.length})</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Progress</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.map(task => `
                                <tr data-task-id="${task.id}">
                                    <td style="max-width: 200px;">
                                        <input type="text" value="${task.title}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'title', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-weight: bold;">
                                    </td>
                                    <td>
                                        <select class="inline-edit" 
                                                onchange="updateTaskField(${task.id}, 'owner', this.value)"
                                                style="border: none; background: transparent; width: 100%;">
                                            <option value="Arushi" ${task.owner === 'Arushi' ? 'selected' : ''}>Arushi</option>
                                            <option value="Sabharwal" ${task.owner === 'Sabharwal' ? 'selected' : ''}>Sabharwal</option>
                                            <option value="Vishal" ${task.owner === 'Vishal' ? 'selected' : ''}>Vishal</option>
                                            <option value="Sandeep" ${task.owner === 'Sandeep' ? 'selected' : ''}>Sandeep</option>
                                            <option value="Pradeep" ${task.owner === 'Pradeep' ? 'selected' : ''}>Pradeep</option>
                                            <option value="Sunil" ${task.owner === 'Sunil' ? 'selected' : ''}>Sunil</option>
                                            <option value="Sunil + Kitchen Equipment Vendor" ${task.owner === 'Sunil + Kitchen Equipment Vendor' ? 'selected' : ''}>Sunil + Kitchen Equipment Vendor</option>
                                            <option value="Arushi + Vishal + Sunil + Team" ${task.owner === 'Arushi + Vishal + Sunil + Team' ? 'selected' : ''}>Arushi + Vishal + Sunil + Team</option>
                                            <option value="Pradeep + Vishal" ${task.owner === 'Pradeep + Vishal' ? 'selected' : ''}>Pradeep + Vishal</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="inline-edit" 
                                                onchange="updateTaskField(${task.id}, 'status', this.value)"
                                                style="border: none; background: transparent; width: 100%;">
                                            <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                                            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                            <option value="Awaiting Decision" ${task.status === 'Awaiting Decision' ? 'selected' : ''}>Awaiting Decision</option>
                                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="date" value="${task.dueDate}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'dueDate', this.value)"
                                               style="border: none; background: transparent; width: 100%;">
                                    </td>
                                    <td>
                                        <input type="range" value="${task.progress}" min="0" max="100" step="5"
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'progress', this.value)"
                                               style="width: 70px; margin-right: 8px;">
                                        <span>${task.progress}%</span>
                                    </td>
                                    <td>
                                        <select class="inline-edit" 
                                                onchange="updateTaskField(${task.id}, 'category', this.value)"
                                                style="border: none; background: transparent; width: 100%;">
                                            <option value="kitchen" ${task.category === 'kitchen' ? 'selected' : ''}>Kitchen</option>
                                            <option value="bar" ${task.category === 'bar' ? 'selected' : ''}>Bar</option>
                                            <option value="electrical" ${task.category === 'electrical' ? 'selected' : ''}>Electrical</option>
                                            <option value="finishing" ${task.category === 'finishing' ? 'selected' : ''}>Finishing</option>
                                            <option value="construction" ${task.category === 'construction' ? 'selected' : ''}>Construction</option>
                                            <option value="exterior" ${task.category === 'exterior' ? 'selected' : ''}>Exterior</option>
                                            <option value="plumbing" ${task.category === 'plumbing' ? 'selected' : ''}>Plumbing</option>
                                            <option value="general" ${task.category === 'general' ? 'selected' : ''}>General</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div id="in-progress-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('in-progress');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">In Progress Tasks (${allTasks.filter(t => t.status === 'In Progress').length})</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Owner</th>
                                <th>Due Date</th>
                                <th>Progress</th>
                                <th>Days Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.filter(t => t.status === 'In Progress').map(task => {
                                const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                                return `
                                    <tr>
                                        <td style="max-width: 200px;"><strong>${task.title}</strong></td>
                                        <td>${task.owner}</td>
                                        <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <div class="progress-mini">
                                                <div class="progress-mini-fill" style="width: ${task.progress}%"></div>
                                            </div>
                                            ${task.progress}%
                                        </td>
                                        <td style="color: ${daysLeft < 0 ? '#dc2626' : daysLeft < 3 ? '#ea580c' : '#16a34a'}; font-weight: 600;">
                                            ${daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : `${daysLeft} days`}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div id="decisions-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('decisions');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">Awaiting Decision Tasks (${allTasks.filter(t => t.status === 'Awaiting Decision').length})</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Owner</th>
                                <th>Due Date</th>
                                <th>Category</th>
                                <th>Days Until Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.filter(t => t.status === 'Awaiting Decision').map(task => {
                                const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                                return `
                                    <tr>
                                        <td style="max-width: 200px;"><strong>${task.title}</strong></td>
                                        <td>${task.owner}</td>
                                        <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td style="text-transform: capitalize;">${task.category}</td>
                                        <td style="color: ${daysLeft < 0 ? '#dc2626' : daysLeft < 3 ? '#ea580c' : '#16a34a'}; font-weight: 600;">
                                            ${daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : `${daysLeft} days`}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div id="completed-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('completed');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">Completed Tasks (${allTasks.filter(t => t.status === 'Completed').length})</h4>
                    ${allTasks.filter(t => t.status === 'Completed').length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Owner</th>
                                    <th>Category</th>
                                    <th>Completed Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allTasks.filter(t => t.status === 'Completed').map(task => `
                                    <tr>
                                        <td style="max-width: 200px;"><strong>${task.title}</strong></td>
                                        <td>${task.owner}</td>
                                        <td style="text-transform: capitalize;">${task.category}</td>
                                        <td>${new Date(task.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div style="text-align: center; padding: 40px; color: #9ca3af;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
                            <p>No tasks completed yet</p>
                            <p style="font-size: 14px; margin-top: 8px;">Tasks will appear here once marked as completed</p>
                        </div>
                    `}
                </div>
            </div>

            <div class="card clickable-card" onclick="toggleDetails('contractors')">
                <h3>👥 Your Contractors <span style="float: right; font-size: 12px; color: #64748b;">Click for details</span></h3>
                <div class="contractor-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    ${Object.entries(contractorPhones).map(([name, phone]) => {
                        const contractorTasks = allTasks.filter(t => t.owner === name);
                        const activeTasks = contractorTasks.filter(t => t.status === 'In Progress').length;
                        return `
                            <div class="contractor-card" style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center;">
                                <div style="font-weight: 600; margin-bottom: 4px; color: #1f2937;">${name}</div>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${contractorTasks.length} tasks • ${activeTasks} active</div>
                                <a href="tel:${phone}" class="call-btn" onclick="event.stopPropagation();">📞 Call</a>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div id="contractors-details" class="details-section">
                    <button class="close-details" onclick="event.stopPropagation(); toggleDetails('contractors');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">Contractor Task Details</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Contractor</th>
                                <th>Phone</th>
                                <th>Total Tasks</th>
                                <th>Active</th>
                                <th>Completed</th>
                                <th>Pending</th>
                                <th>Next Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(contractorPhones).map(([name, phone]) => {
                                const contractorTasks = allTasks.filter(t => t.owner === name);
                                const activeTasks = contractorTasks.filter(t => t.status === 'In Progress').length;
                                const completedTasks = contractorTasks.filter(t => t.status === 'Completed').length;
                                const pendingTasks = contractorTasks.filter(t => t.status === 'Not Started' || t.status === 'Awaiting Decision').length;
                                const nextDue = contractorTasks
                                    .filter(t => t.status !== 'Completed')
                                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
                                return `
                                    <tr>
                                        <td><strong>${name}</strong></td>
                                        <td><a href="tel:${phone}" style="color: #10b981; text-decoration: none;">${phone}</a></td>
                                        <td>${contractorTasks.length}</td>
                                        <td><span style="color: #2563eb; font-weight: 600;">${activeTasks}</span></td>
                                        <td><span style="color: #16a34a; font-weight: 600;">${completedTasks}</span></td>
                                        <td><span style="color: #d97706; font-weight: 600;">${pendingTasks}</span></td>
                                        <td>${nextDue ? new Date(nextDue.dueDate).toLocaleDateString() : 'None'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
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
                    <div style="background: #fef3c7; color: #d97706; padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; margin-top: 16px;">
                        Target Opening: ${summary.targetOpening}
                    </div>
                </div>
            </div>
        </div>

        <!-- Overview Tab -->
        <div id="overview" class="tab-content">
            <div class="card">
                <h3>🚨 Urgent Tasks (${urgentTasks.length})</h3>
                ${urgentTasks.map(task => `
                    <div class="task-item">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            <span><strong>${task.owner}</strong> • Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${task.progress}%"></div>
                        </div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${task.progress}% Complete</div>
                        ${contractorPhones[task.owner] ? `<a href="tel:${contractorPhones[task.owner]}" class="call-btn">📞 Call ${task.owner}</a>` : ''}
                        ${task.source === 'user_added' ? `<button class="edit-btn" onclick="editTask(${task.id})">✏️ Edit</button>` : ''}
                    </div>
                `).join('')}
            </div>

            ${pendingDecisions.length > 0 ? `
            <div class="card">
                <h3>⚖️ Pending Decisions (${pendingDecisions.length})</h3>
                ${pendingDecisions.map(decision => `
                    <div class="task-item">
                        <div class="task-title">${decision.title}</div>
                        <div class="task-meta">
                            <span><strong>${decision.assignedTo}</strong> • Due: ${new Date(decision.dueDate).toLocaleDateString()}</span>
                            <span style="background: #ea580c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${decision.priority}</span>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-top: 8px;">${decision.description}</p>
                        <button class="edit-btn" onclick="editDecision(${decision.id})">✏️ Update</button>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>

        <!-- Add Task Tab -->
        <div id="add-task" class="tab-content">
            <div class="card">
                <h3>➕ Add New Task</h3>
                <div id="task-message" class="message"></div>
                <form id="taskForm">
                    <div class="form-group">
                        <label class="form-label">Task Title *</label>
                        <input type="text" class="form-input" name="title" required placeholder="e.g., Install new kitchen equipment">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Assigned To *</label>
                            <select class="form-select" name="owner" required>
                                <option value="">Select Contractor</option>
                                <option value="Arushi">Arushi (Architect & Interior Design)</option>
                                <option value="Vishal">Vishal (General Contractor)</option>
                                <option value="Sabharwal">Sabharwal (Wood Work)</option>
                                <option value="Sandeep">Sandeep (Tensile Structure)</option>
                                <option value="Pradeep">Pradeep (HVAC & Exhaust)</option>
                                <option value="Sunil">Sunil (Kitchen)</option>
                                <option value="Bhargav">Bhargav</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select class="form-select" name="priority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select class="form-select" name="category">
                                <option value="general">General</option>
                                <option value="kitchen">Kitchen</option>
                                <option value="bar">Bar</option>
                                <option value="electrical">Electrical</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="construction">Construction</option>
                                <option value="finishing">Finishing</option>
                                <option value="exterior">Exterior</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Due Date *</label>
                            <input type="date" class="form-input" name="dueDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-select" name="status">
                                <option value="Not Started" selected>Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Awaiting Decision">Awaiting Decision</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="form-textarea" name="notes" placeholder="Additional details, requirements, or dependencies..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">➕ Add Task</button>
                </form>
            </div>
        </div>

        <!-- Decisions Tab -->
        <div id="decisions" class="tab-content">
            <div class="card">
                <h3>⚖️ Add New Decision Item</h3>
                <div id="decision-message" class="message"></div>
                <form id="decisionForm">
                    <div class="form-group">
                        <label class="form-label">Decision Title *</label>
                        <input type="text" class="form-input" name="title" required placeholder="e.g., Choose bar countertop material">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description *</label>
                        <textarea class="form-textarea" name="description" required placeholder="Describe the decision that needs to be made, options available, and any constraints..."></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Assigned To</label>
                            <select class="form-select" name="assignedTo">
                                <option value="Arushi" selected>Arushi</option>
                                <option value="Pooja">Pooja</option>
                                <option value="Team">Team</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select class="form-select" name="priority">
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Due Date *</label>
                            <input type="date" class="form-input" name="dueDate" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn">⚖️ Add Decision</button>
                </form>
            </div>
        </div>

        <!-- Update Tab -->
        <div id="update" class="tab-content">
            <div class="card">
                <h3>✏️ Update Tasks & Progress</h3>
                <p style="color: #64748b; margin-bottom: 16px;">Click on any task in the Overview tab to update its progress, status, or details.</p>
                <div id="update-form-container">
                    <p style="text-align: center; color: #9ca3af; padding: 40px;">Select a task from the Overview tab to update it here.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Tab switching
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            
            // Activate corresponding nav tab
            event.target.classList.add('active');
        }

        // Toggle details sections
        function toggleDetails(sectionName) {
            const detailsSection = document.getElementById(sectionName + '-details');
            const isActive = detailsSection.classList.contains('active');
            
            // Hide all other details sections
            document.querySelectorAll('.details-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Toggle current section
            if (!isActive) {
                detailsSection.classList.add('active');
                detailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // Add task form submission
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const taskData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
                
                const result = await response.json();
                const messageEl = document.getElementById('task-message');
                
                if (result.success) {
                    messageEl.className = 'message success';
                    messageEl.textContent = 'Task added successfully!';
                    messageEl.style.display = 'block';
                    e.target.reset();
                    
                    // Refresh page after 2 seconds
                    setTimeout(() => location.reload(), 2000);
                } else {
                    throw new Error(result.message || 'Failed to add task');
                }
            } catch (error) {
                const messageEl = document.getElementById('task-message');
                messageEl.className = 'message error';
                messageEl.textContent = 'Error: ' + error.message;
                messageEl.style.display = 'block';
            }
        });

        // Add decision form submission
        document.getElementById('decisionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const decisionData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/decisions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(decisionData)
                });
                
                const result = await response.json();
                const messageEl = document.getElementById('decision-message');
                
                if (result.success) {
                    messageEl.className = 'message success';
                    messageEl.textContent = 'Decision added successfully!';
                    messageEl.style.display = 'block';
                    e.target.reset();
                    
                    // Refresh page after 2 seconds
                    setTimeout(() => location.reload(), 2000);
                } else {
                    throw new Error(result.message || 'Failed to add decision');
                }
            } catch (error) {
                const messageEl = document.getElementById('decision-message');
                messageEl.className = 'message error';
                messageEl.textContent = 'Error: ' + error.message;
                messageEl.style.display = 'block';
            }
        });

        // Edit task function
        function editTask(taskId) {
            showTab('update');
            document.querySelector('[onclick="showTab(\\'update\\')"]').classList.add('active');
            
            // Load task edit form
            loadTaskEditForm(taskId);
        }

        // Edit decision function
        function editDecision(decisionId) {
            showTab('update');
            document.querySelector('[onclick="showTab(\\'update\\')"]').classList.add('active');
            
            // Load decision edit form
            loadDecisionEditForm(decisionId);
        }

        // Update task field function for inline editing
        async function updateTaskField(taskId, field, value) {
            try {
                const response = await fetch('/api/tasks/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: taskId, 
                        field: field, 
                        value: value 
                    })
                });
                
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Failed to update task');
                }
                
                // Update progress display if progress was changed
                if (field === 'progress') {
                    const row = document.querySelector(\`[data-task-id="\${taskId}"]\`);
                    const progressSpan = row.querySelector('span');
                    if (progressSpan) {
                        progressSpan.textContent = value + '%';
                    }
                }
                
                console.log(\`Updated \${field} for task \${taskId} to \${value}\`);
            } catch (error) {
                console.error('Error updating task:', error);
                alert('Failed to update task: ' + error.message);
            }
        }

        // Update decision field function for inline editing
        async function updateDecisionField(decisionId, field, value) {
            try {
                const response = await fetch('/api/decisions/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: decisionId, 
                        field: field, 
                        value: value 
                    })
                });
                
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Failed to update decision');
                }
                
                console.log(\`Updated \${field} for decision \${decisionId} to \${value}\`);
            } catch (error) {
                console.error('Error updating decision:', error);
                alert('Failed to update decision: ' + error.message);
            }
        }

        async function loadTaskEditForm(taskId) {
            const container = document.getElementById('update-form-container');
            container.innerHTML = '<p>Loading task details...</p>';
            
            try {
                const response = await fetch(\`/api/tasks/\${taskId}\`);
                const result = await response.json();
                
                if (result.success) {
                    const task = result.data;
                    container.innerHTML = \`
                        <h4>Update Task: \${task.title}</h4>
                        <form id="updateTaskForm" data-task-id="\${task.id}">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" name="status">
                                        <option value="Not Started" \${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                                        <option value="In Progress" \${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Awaiting Decision" \${task.status === 'Awaiting Decision' ? 'selected' : ''}>Awaiting Decision</option>
                                        <option value="Completed" \${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Progress (%)</label>
                                    <input type="number" class="form-input" name="progress" min="0" max="100" value="\${task.progress}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Notes</label>
                                <textarea class="form-textarea" name="notes">\${task.notes || ''}</textarea>
                            </div>
                            
                            <button type="submit" class="btn">💾 Update Task</button>
                        </form>
                    \`;
                    
                    // Add form submission handler
                    document.getElementById('updateTaskForm').addEventListener('submit', handleTaskUpdate);
                }
            } catch (error) {
                container.innerHTML = '<p style="color: #ef4444;">Error loading task details</p>';
            }
        }

        async function handleTaskUpdate(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updateData = Object.fromEntries(formData.entries());
            const taskId = e.target.dataset.taskId;
            
            try {
                const response = await fetch(\`/api/tasks/\${taskId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Task updated successfully!');
                    location.reload();
                } else {
                    throw new Error(result.message || 'Failed to update task');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = tomorrow.toISOString().split('T')[0];
        });
    </script>
</body>
</html>
    `);
    
  } else if (req.method === 'POST' && path === '/api/tasks') {
    try {
      const taskData = await parsePostData(req);
      const newTask = addTask(taskData);
      
      if (newTask) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newTask }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Failed to add task' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
    
  } else if (req.method === 'POST' && path === '/api/decisions') {
    try {
      const decisionData = await parsePostData(req);
      const newDecision = addDecision(decisionData);
      
      if (newDecision) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newDecision }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Failed to add decision' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
    
  } else if (req.method === 'GET' && path.startsWith('/api/tasks/')) {
    const taskId = path.split('/')[3];
    const userData = getAllData();
    const task = userData.tasks.find(t => t.id == taskId);
    
    if (task) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: task }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Task not found' }));
    }
    
  } else if (req.method === 'PUT' && path.startsWith('/api/tasks/')) {
    try {
      const taskId = path.split('/')[3];
      const updateData = await parsePostData(req);
      const updatedTask = updateTask(taskId, updateData);
      
      if (updatedTask) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: updatedTask }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Task not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
    
  } else if (req.method === 'PUT' && path === '/api/tasks/update') {
    try {
      const { id, field, value } = await parsePostData(req);
      const userData = getAllData();
      const taskIndex = userData.tasks.findIndex(t => t.id == id);
      
      if (taskIndex !== -1) {
        // Update specific field
        userData.tasks[taskIndex][field] = value;
        
        // Update timestamp
        userData.tasks[taskIndex].updatedAt = new Date().toISOString();
        
        // Save updated data
        saveData(userData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          data: userData.tasks[taskIndex],
          message: `Task ${field} updated successfully`
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Task not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
    
  } else if (req.method === 'PUT' && path === '/api/decisions/update') {
    try {
      const { id, field, value } = await parsePostData(req);
      const userData = getAllData();
      const decisionIndex = userData.decisions.findIndex(d => d.id == id);
      
      if (decisionIndex !== -1) {
        // Update specific field
        userData.decisions[decisionIndex][field] = value;
        
        // Update timestamp
        userData.decisions[decisionIndex].updatedAt = new Date().toISOString();
        
        // Save updated data
        saveData(userData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          data: userData.decisions[decisionIndex],
          message: `Decision ${field} updated successfully`
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Decision not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: error.message }));
    }
    
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('🏗️ POOJA\'S BUILD MANAGEMENT - WITH DATA ENTRY');
  console.log(`📱💻 Dashboard: http://localhost:${PORT}`);
  console.log('✅ Task creation enabled');
  console.log('⚖️ Decision tracking enabled');
  console.log('✏️ Progress updates enabled');
});