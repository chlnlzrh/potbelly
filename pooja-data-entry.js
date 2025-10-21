const http = require('http');
const url = require('url');
const { parseMarkdownTasks, generateProjectSummary } = require('./data-parser');
const { addTask, updateTask, addDecision, updateDecision, getAllData } = require('./data-manager');

const PORT = 3002;

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
    
    // Contact mapping function
    function getContactButtons(task) {
        const contactMap = {
            'Arushi': '9810312309',
            'Sabharwal': '9868226580', 
            'Vishal': '9310203344',
            'Sandeep': '9810165187',
            'Pradeep': '9540475132',
            'Sunil': '9810086477'
        };
        
        if (!task.owner) return '<span style="color: #9ca3af; font-size: 12px;">No owner</span>';
        
        // Find first owner that has a phone number
        const owners = task.owner.split(',').map(o => o.trim());
        const ownerWithPhone = owners.find(owner => contactMap[owner]);
        
        if (!ownerWithPhone) return '<span style="color: #9ca3af; font-size: 12px;">No contact</span>';
        
        const phoneNumber = contactMap[ownerWithPhone];
        const taskText = encodeURIComponent(`Task: ${task.title}\nDue: ${task.dueDate}\nStatus: ${task.status}`);
        
        return `
            <div style="display: flex; gap: 4px; align-items: center;">
                <a href="tel:${phoneNumber}" style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">📞</a>
                <a href="sms:${phoneNumber}&body=${taskText}" style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">💬</a>
            </div>
        `;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Restaurant Build - Data Entry v${Date.now()}</title>
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
            font-size: 12px;
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
            font-size: 12px;
        }
        
        .data-table td select,
        .data-table td input {
            font-size: 12px;
        }
        
        .data-table th:nth-child(2), 
        .data-table td:nth-child(2) {
            width: 140px; /* Owner column */
        }
        
        .data-table th:nth-child(3), 
        .data-table td:nth-child(3) {
            width: 140px; /* Status column - fits "Awaiting Decision" */
        }
        
        .data-table th:nth-child(4), 
        .data-table td:nth-child(4) {
            width: 140px; /* Due Date column */
        }
        
        .data-table input[type="range"] {
            margin: 0;
            padding: 0;
        }
        
        .multi-select-owner {
            font-size: 12px !important;
            line-height: 1.3 !important;
            overflow-y: auto;
        }
        
        .multi-select-owner option {
            padding: 2px 4px;
            font-size: 12px;
        }
        
        .custom-multi-select {
            position: relative;
        }
        
        .multi-select-display:hover {
            border-color: #3b82f6;
        }
        
        .multi-select-dropdown label:hover {
            background-color: #f3f4f6;
        }
        
        .multi-select-dropdown label {
            transition: background-color 0.2s;
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
            <button class="nav-tab" onclick="showTab('contacts')">📞 Contacts</button>
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
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.map(task => `
                                <tr data-task-id="${task.id}">
                                    <td style="max-width: 200px;">
                                        <input type="text" value="${task.title}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'title', this.value)"
                                               style="border: none; background: transparent; width: 100%;">
                                    </td>
                                    <td>
                                        <div class="custom-multi-select" data-task-id="${task.id}">
                                            <div class="multi-select-display" onclick="toggleMultiSelectDropdown(${task.id})" 
                                                 style="border: 1px solid #e5e7eb; padding: 6px 8px; border-radius: 4px; cursor: pointer; background: white; min-height: 20px; position: relative;">
                                                <span class="selected-owners" style="font-size: 12px;">${task.owner || 'Select owners...'}</span>
                                                <span style="float: right; color: #666;">▼</span>
                                            </div>
                                            <div class="multi-select-dropdown" id="dropdown-${task.id}" 
                                                 style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 200px; max-height: 200px; overflow-y: auto;">
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Arushi" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Arushi') ? 'checked' : ''}> Arushi
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Sabharwal" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Sabharwal') ? 'checked' : ''}> Sabharwal
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Vishal" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Vishal') ? 'checked' : ''}> Vishal
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Sandeep" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Sandeep') ? 'checked' : ''}> Sandeep
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Pradeep" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Pradeep') ? 'checked' : ''}> Pradeep
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="checkbox" value="Sunil" onchange="updateOwnerSelection(${task.id})" ${task.owner && (task.owner.includes('Sunil') || task.owner.includes('Kitchen Equipment Vendor')) ? 'checked' : ''}> Sunil
                                                </label>
                                                <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                                                    <input type="checkbox" value="Team" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Team') ? 'checked' : ''}> Team
                                                </label>
                                            </div>
                                        </div>
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
                                        ${getContactButtons(task)}
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
                                <th>Days Until Due</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.filter(t => t.status === 'Awaiting Decision').map(task => {
                                const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                                return `
                                    <tr data-task-id="${task.id}">
                                        <td style="max-width: 200px;">
                                            <input type="text" value="${task.title}" 
                                                   class="inline-edit" 
                                                   onchange="updateTaskField(${task.id}, 'title', this.value)"
                                                   style="border: none; background: transparent; width: 100%;">
                                        </td>
                                        <td>
                                            <div class="custom-multi-select" data-task-id="${task.id}">
                                                <div class="multi-select-display" onclick="toggleMultiSelectDropdown(${task.id})" 
                                                     style="border: 1px solid #e5e7eb; padding: 6px 8px; border-radius: 4px; cursor: pointer; background: white; min-height: 20px; position: relative;">
                                                    <span class="selected-owners" style="font-size: 12px;">${task.owner || 'Select owners...'}</span>
                                                    <span style="float: right; color: #666;">▼</span>
                                                </div>
                                                <div class="multi-select-dropdown" id="dropdown-${task.id}" 
                                                     style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 200px; max-height: 200px; overflow-y: auto;">
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Arushi" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Arushi') ? 'checked' : ''}> Arushi
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Sabharwal" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Sabharwal') ? 'checked' : ''}> Sabharwal
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Vishal" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Vishal') ? 'checked' : ''}> Vishal
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Sandeep" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Sandeep') ? 'checked' : ''}> Sandeep
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Pradeep" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Pradeep') ? 'checked' : ''}> Pradeep
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px; border-bottom: 1px solid #eee;">
                                                        <input type="checkbox" value="Sunil" onchange="updateOwnerSelection(${task.id})" ${task.owner && (task.owner.includes('Sunil') || task.owner.includes('Kitchen Equipment Vendor')) ? 'checked' : ''}> Sunil
                                                    </label>
                                                    <label style="display: block; padding: 4px 8px; cursor: pointer; font-size: 12px;">
                                                        <input type="checkbox" value="Team" onchange="updateOwnerSelection(${task.id})" ${task.owner && task.owner.includes('Team') ? 'checked' : ''}> Team
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="date" value="${task.dueDate}" 
                                                   class="inline-edit" 
                                                   onchange="updateTaskField(${task.id}, 'dueDate', this.value)"
                                                   style="border: none; background: transparent; width: 100%;">
                                        </td>
                                        <td style="color: ${daysLeft < 0 ? '#dc2626' : daysLeft < 3 ? '#ea580c' : '#16a34a'}; font-weight: 600;">
                                            ${daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : `${daysLeft} days`}
                                        </td>
                                        <td>
                                            ${getContactButtons(task)}
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


            <div class="card">
                <h3>📊 Project Status</h3>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                        ${summary.summary.progress}%
                    </div>
                    <div style="color: #64748b; margin-bottom: 16px;">Overall Progress</div>
                    <div style="background: #fef3c7; color: #d97706; padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; margin-top: 16px;">
                        Target Opening: ${summary.targetOpening}
                    </div>
                </div>
            </div>
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
                                <option value="Sunil">Sunil</option>
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

        <!-- Contacts Tab -->
        <div id="contacts" class="tab-content">
            <div class="card">
                
                <div class="contacts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">A</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Arushi</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Architect and Interior Design</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9810312309" style="color: #3b82f6; text-decoration: none;">9810312309</a>
                            </div>
                            <a href="sms:9810312309" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>

                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">S</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Sabharwal</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Wood Work</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9868226580" style="color: #3b82f6; text-decoration: none;">9868226580</a>
                            </div>
                            <a href="sms:9868226580" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>

                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">V</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Vishal</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">General Contractor</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9310203344" style="color: #3b82f6; text-decoration: none;">9310203344</a>
                            </div>
                            <a href="sms:9310203344" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>

                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">S</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Sandeep</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Tensile Structure</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9810165187" style="color: #3b82f6; text-decoration: none;">9810165187</a>
                            </div>
                            <a href="sms:9810165187" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>

                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">P</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Pradeep</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">HVAC & Exhaust</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9540475132" style="color: #3b82f6; text-decoration: none;">9540475132</a>
                            </div>
                            <a href="sms:9540475132" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>

                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 40px; height: 40px; background: #06b6d4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: white; font-weight: 600;">S</span>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">Sunil</h4>
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Kitchen & Equipment</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:9810086477" style="color: #3b82f6; text-decoration: none;">9810086477</a>
                            </div>
                            <a href="sms:9810086477" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
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

        // Toggle multi-select dropdown
        function toggleMultiSelectDropdown(taskId) {
            const dropdown = document.getElementById(\`dropdown-\${taskId}\`);
            const isVisible = dropdown.style.display === 'block';
            
            // Close all other dropdowns
            document.querySelectorAll('.multi-select-dropdown').forEach(d => {
                d.style.display = 'none';
            });
            
            // Toggle current dropdown
            dropdown.style.display = isVisible ? 'none' : 'block';
        }

        // Update owner selection when checkboxes change
        async function updateOwnerSelection(taskId) {
            const dropdown = document.getElementById(\`dropdown-\${taskId}\`);
            const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
            const selectedValues = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedValues.push(checkbox.value);
                }
            });
            
            const value = selectedValues.join(' + ');
            
            // Update display
            const displayElement = dropdown.parentElement.querySelector('.selected-owners');
            displayElement.textContent = value || 'Select owners...';
            
            // Save to server
            try {
                const response = await fetch('/api/tasks/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: taskId, 
                        field: 'owner', 
                        value: value 
                    })
                });
                
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message || 'Failed to update task');
                }
                
                console.log(\`Updated owner for task \${taskId} to \${value}\`);
            } catch (error) {
                console.error('Error updating task owner:', error);
                alert('Failed to update task owner: ' + error.message);
            }
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.custom-multi-select')) {
                document.querySelectorAll('.multi-select-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });

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