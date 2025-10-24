// Embedded data for serverless function
const TASKS_DATA = [
  {
    "id": 1,
    "title": "Complete kitchen ducting to terrace",
    "owner": "Pradeep",
    "dueDate": "2025-10-25",
    "priority": "High",
    "status": "Completed",
    "category": "HVAC",
    "notes": "",
    "updatedAt": "2025-10-23T15:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Commence painting (main floor + upstairs)",
    "owner": "Vishal",
    "dueDate": "2025-10-25",
    "priority": "Critical",
    "status": "Completed",
    "category": "Painting",
    "notes": "",
    "updatedAt": "2025-10-24T00:53:00.000Z"
  },
  {
    "id": 3,
    "title": "Install acoustic panels post-painting",
    "owner": "Vishal",
    "dueDate": "2025-11-01",
    "priority": "High",
    "status": "Awaiting Prerequisites",
    "category": "Interior",
    "notes": ""
  },
  {
    "id": 4,
    "title": "Complete bathroom fixture installation (upstairs)",
    "owner": "Vishal",
    "dueDate": "2025-10-28",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Plumbing",
    "notes": ""
  },
  {
    "id": 5,
    "title": "Order and install Kota stone flooring (washing area)",
    "owner": "Vishal",
    "dueDate": "2025-10-30",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Flooring",
    "notes": ""
  }
];

const DECISIONS_DATA = [
  {
    "id": 1,
    "title": "Finalize material selection for terrace glass frame (MS vs aluminum)",
    "description": "Choose between mild steel (MS) and aluminum for terrace glass frame construction. Consider durability, cost, maintenance, and aesthetic requirements.",
    "assignedTo": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "High",
    "status": "Pending",
    "options": [
      {
        "option": "Mild Steel (MS)",
        "pros": ["Stronger", "More durable", "Better security"],
        "cons": ["Requires regular maintenance", "Higher cost", "Rust potential"]
      },
      {
        "option": "Aluminum",
        "pros": ["Lightweight", "Corrosion resistant", "Lower maintenance"],
        "cons": ["Less secure", "Higher material cost", "Limited strength"]
      }
    ],
    "impact": "High - affects structural integrity and long-term maintenance",
    "createdAt": "2025-10-22T00:00:00.000Z",
    "updatedAt": "2025-10-22T00:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Finalize liquor storage room finishes",
    "description": "Decide on wall finishes, flooring, lighting, and storage solutions for the liquor storage room. Consider regulations, security, and accessibility.",
    "assignedTo": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "Medium",
    "status": "Pending",
    "options": [
      {
        "option": "Premium finishes with specialized storage",
        "pros": ["Professional appearance", "Better organization", "Climate control"],
        "cons": ["Higher cost", "Longer installation time"]
      },
      {
        "option": "Standard finishes with basic storage",
        "pros": ["Cost effective", "Faster installation", "Easy maintenance"],
        "cons": ["Basic appearance", "Limited organization options"]
      }
    ],
    "impact": "Medium - affects functionality and compliance",
    "createdAt": "2025-10-22T00:00:00.000Z",
    "updatedAt": "2025-10-22T00:00:00.000Z"
  }
];

// Load tasks from embedded data
function loadTasks() {
  return TASKS_DATA;
}

// Load decisions from embedded data
function loadDecisions() {
  return DECISIONS_DATA;
}

// Simple project summary generator
function generateProjectSummary(tasks) {
  const summary = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    awaitingDecision: tasks.filter(t => t.status === 'Awaiting Decision').length,
    notStarted: tasks.filter(t => t.status === 'Not Started').length
  };
  
  return { summary };
}

// Parse POST data
function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method === 'GET' && req.url === '/') {
      // Load data from embedded sources
      const allTasks = loadTasks();
      const allDecisions = loadDecisions();
      const summary = generateProjectSummary(allTasks);
      
      // Get urgent tasks
      const urgentTasks = allTasks.filter(t => 
        t.priority === 'Critical' || t.priority === 'High' ||
        new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ).slice(0, 8);
      
      // Get pending decisions
      const pendingDecisions = allDecisions.filter(d => d.status === 'Pending').slice(0, 5);
      
      // Contact mapping function
      function getContactButtons(task) {
          const contactMap = {
              'Arushi': '+919810312309',
              'Sabharwal': '+919868226580', 
              'Vishal': '+919310203344',
              'Sandeep': '+919810165187',
              'Pradeep': '+919540475132',
              'Sunil': '+919810086477'
          };
          
          if (!task.owner) return '<span style="color: #9ca3af; font-size: 12px;">No owner</span>';
          
          // Handle multiple owners (comma or + separated)
          const owners = task.owner.split(/[,+&]/).map(o => o.trim());
          const buttons = owners.map(owner => {
              const phone = contactMap[owner];
              if (!phone) return '';
              
              return `
                  <a href="tel:${phone}" style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px; margin-right: 4px;">📞</a>
                  <a href="sms:${phone}&body=${encodeURIComponent(`Task: ${task.title}\\nDue: ${task.dueDate}\\nPriority: ${task.priority}`)}" style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">💬</a>
              `;
          }).join('');
          
          return `
              <div style="display: flex; flex-wrap: wrap; gap: 2px;">
                  ${buttons}
              </div>
          `;
      }
      
      // Get phone number for decision contacts
      function getDecisionContactPhone(assignedTo) {
          const contactMap = {
              'Arushi': '+919810312309',
              'Sabharwal': '+919868226580', 
              'Vishal': '+919310203344',
              'Sandeep': '+919810165187',
              'Pradeep': '+919540475132',
              'Sunil': '+919810086477',
              'Team': '+919810312309' // Default to Arushi for team decisions
          };
          return contactMap[assignedTo] || '+919810312309';
      }
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏗️ Pooja's Restaurant Build Management</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-size: 12px;
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .header h1 { 
            color: #1f2937; 
            margin-bottom: 10px; 
            font-size: 28px;
            font-weight: 700;
        }
        
        .header p { 
            color: #6b7280; 
            font-size: 14px;
        }
        
        .nav-tabs {
            display: flex;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 5px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .nav-tab {
            flex: 1;
            padding: 12px 20px;
            border: none;
            background: transparent;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: #6b7280;
            font-size: 12px;
        }
        
        .nav-tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .nav-tab:hover:not(.active) {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .progress-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        
        .progress-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .progress-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        
        .clickable-card {
            cursor: pointer;
        }
        
        .clickable-card:hover {
            background: rgba(255, 255, 255, 1);
        }
        
        .big-number { 
            display: block; 
            font-size: 42px; 
            font-weight: 800; 
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card { 
            background: rgba(255, 255, 255, 0.95); 
            padding: 30px; 
            border-radius: 20px; 
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card h3 { 
            color: #1f2937; 
            margin-bottom: 16px; 
            font-size: 12px; 
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .data-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px;
        }
        
        .data-table th, .data-table td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
        }
        
        .data-table th { 
            background: #f9fafb; 
            font-weight: 600; 
            color: #374151;
        }
        
        .data-table tr:hover { 
            background: #f9fafb; 
        }
        
        .form-group { margin-bottom: 20px; }
        
        .form-label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            color: #374151;
            font-size: 12px;
        }
        
        .form-input, .form-select, .form-textarea { 
            width: 100%; 
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 12px;
            transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus { 
            outline: none; 
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-textarea { 
            min-height: 100px; 
            resize: vertical; 
        }
        
        .form-row { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
        }
        
        .btn { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: #6b7280;
        }
        
        .btn-secondary:hover {
            background: #4b5563;
            box-shadow: 0 8px 25px rgba(75, 85, 99, 0.3);
        }
        
        .message { 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            font-weight: 500;
            font-size: 12px;
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
        
        .task-item { 
            background: white; 
            border-radius: 12px; 
            padding: 20px; 
            margin-bottom: 15px;
            border: 1px solid #e5e7eb;
            transition: all 0.2s;
        }
        
        .task-item:hover { 
            border-color: #667eea;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
        }
        
        .task-title { 
            font-weight: 600; 
            margin-bottom: 8px;
            font-size: 12px;
            color: #1f2937;
        }
        
        .task-meta { 
            color: #6b7280; 
            font-size: 11px;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .priority-high { color: #dc2626; font-weight: 600; }
        .priority-medium { color: #d97706; font-weight: 600; }
        .priority-low { color: #059669; font-weight: 600; }
        .priority-critical { color: #7c2d12; font-weight: 600; background: #fed7aa; padding: 2px 6px; border-radius: 4px; }
        
        .status-completed { color: #059669; font-weight: 600; }
        .status-in-progress { color: #0891b2; font-weight: 600; }
        .status-pending { color: #d97706; font-weight: 600; }
        .status-blocked { color: #dc2626; font-weight: 600; }
        
        .details-section {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            padding: 20px;
            overflow-y: auto;
        }
        
        .details-section.active {
            display: block;
        }
        
        .details-section .card {
            max-width: 95%;
            margin: 20px auto;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close-details {
            position: absolute;
            top: 15px;
            right: 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .inline-edit {
            background: transparent;
            border: 1px solid transparent;
            padding: 2px 4px;
            border-radius: 4px;
            transition: all 0.2s;
            width: 100%;
            font-size: 12px;
        }
        
        .inline-edit:hover {
            background: #f9fafb;
            border-color: #d1d5db;
        }
        
        .inline-edit:focus {
            background: white;
            border-color: #667eea;
            outline: none;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
        
        @media (max-width: 768px) {
            .container { padding: 15px; }
            
            .header { padding: 20px; }
            .header h1 { font-size: 24px; }
            
            .nav-tabs { flex-wrap: wrap; }
            .nav-tab { 
                min-width: 120px; 
                margin: 2px;
            }
            
            .progress-grid { 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 15px; 
            }
            
            .form-row { 
                grid-template-columns: 1fr; 
            }
            
            .data-table { 
                font-size: 11px; 
            }
            
            .data-table th, .data-table td { 
                padding: 8px; 
            }
            
            .details-section .card {
                max-width: 100%;
                margin: 10px auto;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Pooja's Restaurant Build Management</h1>
            <p>Real-time project tracking & team coordination • Updated ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('dashboard')">🏠 Dashboard</button>
            <button class="nav-tab" onclick="showTab('contacts')">📞 Contacts</button>
            <button class="nav-tab" onclick="showTab('add-task')">➕ Add Task</button>
            <button class="nav-tab" onclick="showTab('decisions')">➕ Add Decisions</button>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="progress-grid">
                <div class="progress-card clickable-card" onclick="toggleDetails('urgent')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #dc2626; display: block;">${summary.summary.total}</span>
                    <div style="color: #64748b; font-size: 14px;">Total Tasks</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card clickable-card" onclick="toggleDetails('decisions')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #d97706; display: block;">${allDecisions.length}</span>
                    <div style="color: #64748b; font-size: 14px;">Total Decisions</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card clickable-card" onclick="toggleDetails('completed')" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; cursor: pointer;">
                    <span class="big-number" style="font-size: 36px; font-weight: bold; color: #059669; display: block;">${summary.summary.completed}</span>
                    <div style="color: #64748b; font-size: 14px;">Completed</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
            </div>
            
            <!-- Details sections will be populated here -->
            ${allTasks.length > 0 ? `
            <div id="urgent-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('urgent');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">All Tasks (${allTasks.length})</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Owner</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Contact</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allTasks.map(task => `
                                <tr data-task-id="${task.id}">
                                    <td style="max-width: 200px;">
                                        <input type="text" value="${task.title}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'title', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-weight: 600; font-size: 12px;">
                                    </td>
                                    <td>
                                        <input type="text" value="${task.owner || ''}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'owner', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 12px;">
                                    </td>
                                    <td>
                                        <input type="text" value="${task.category || 'General'}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'category', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 12px;">
                                    </td>
                                    <td>
                                        <select class="inline-edit" 
                                                onchange="updateTaskField(${task.id}, 'priority', this.value)"
                                                style="border: none; background: transparent; width: 100%; font-size: 12px;">
                                            <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                                            <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                            <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                                            <option value="Critical" ${task.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="inline-edit" 
                                                onchange="updateTaskField(${task.id}, 'status', this.value)"
                                                style="border: none; background: transparent; width: 100%; font-size: 12px;">
                                            <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                                            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                            <option value="Awaiting Decision" ${task.status === 'Awaiting Decision' ? 'selected' : ''}>Awaiting Decision</option>
                                            <option value="Awaiting Prerequisites" ${task.status === 'Awaiting Prerequisites' ? 'selected' : ''}>Awaiting Prerequisites</option>
                                            <option value="Awaiting Vendor" ${task.status === 'Awaiting Vendor' ? 'selected' : ''}>Awaiting Vendor</option>
                                            <option value="Awaiting Site Readiness" ${task.status === 'Awaiting Site Readiness' ? 'selected' : ''}>Awaiting Site Readiness</option>
                                            <option value="Design in Progress" ${task.status === 'Design in Progress' ? 'selected' : ''}>Design in Progress</option>
                                            <option value="Design Approved" ${task.status === 'Design Approved' ? 'selected' : ''}>Design Approved</option>
                                            <option value="Awaiting Design Approval" ${task.status === 'Awaiting Design Approval' ? 'selected' : ''}>Awaiting Design Approval</option>
                                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="date" value="${task.dueDate}" 
                                               class="inline-edit" 
                                               onchange="updateTaskField(${task.id}, 'dueDate', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 12px;">
                                    </td>
                                    <td>
                                        ${getContactButtons(task)}
                                    </td>
                                    <td>
                                        <button onclick="deleteTask(${task.id})" 
                                                style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 4px; border-radius: 4px; hover: background-color: #fef2f2;" 
                                                title="Delete task">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
            
            ${allDecisions.length > 0 ? `
            <div id="decisions-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('decisions');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">All Decisions (${allDecisions.length})</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 45%;">Decision</th>
                                <th style="width: 12%;">Assigned To</th>
                                <th style="width: 9%;">Priority</th>
                                <th style="width: 11%;">Due Date</th>
                                <th style="width: 9%;">Status</th>
                                <th style="width: 8%;">Contact</th>
                                <th style="width: 6%;">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allDecisions.map(decision => `
                                <tr data-decision-id="${decision.id}">
                                    <td style="width: 45%; max-width: 400px; word-wrap: break-word; white-space: normal;">
                                        <textarea 
                                               class="inline-edit" 
                                               onchange="updateDecisionField(${decision.id}, 'title', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-weight: 600; font-size: 12px; resize: none; overflow: hidden; min-height: 20px; word-wrap: break-word;"
                                               oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';">${decision.title}</textarea>
                                        ${decision.description ? `<br><textarea 
                                               class="inline-edit" 
                                               onchange="updateDecisionField(${decision.id}, 'description', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 11px; color: #6b7280; resize: none; overflow: hidden; min-height: 18px; word-wrap: break-word;"
                                               placeholder="Add description..."
                                               oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';">${decision.description}</textarea>` : 
                                               `<br><textarea 
                                               class="inline-edit" 
                                               onchange="updateDecisionField(${decision.id}, 'description', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 11px; color: #6b7280; resize: none; overflow: hidden; min-height: 18px; word-wrap: break-word;"
                                               placeholder="Add description..."
                                               oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"></textarea>`}
                                    </td>
                                    <td style="width: 12%;">
                                        <select class="inline-edit" 
                                                onchange="updateDecisionField(${decision.id}, 'assignedTo', this.value)"
                                                style="border: none; background: transparent; width: 100%; font-size: 11px;">
                                            <option value="Arushi" ${decision.assignedTo === 'Arushi' ? 'selected' : ''}>Arushi</option>
                                            <option value="Vishal" ${decision.assignedTo === 'Vishal' ? 'selected' : ''}>Vishal</option>
                                            <option value="Sabharwal" ${decision.assignedTo === 'Sabharwal' ? 'selected' : ''}>Sabharwal</option>
                                            <option value="Sandeep" ${decision.assignedTo === 'Sandeep' ? 'selected' : ''}>Sandeep</option>
                                            <option value="Pradeep" ${decision.assignedTo === 'Pradeep' ? 'selected' : ''}>Pradeep</option>
                                            <option value="Sunil" ${decision.assignedTo === 'Sunil' ? 'selected' : ''}>Sunil</option>
                                            <option value="Team" ${decision.assignedTo === 'Team' ? 'selected' : ''}>Team</option>
                                        </select>
                                    </td>
                                    <td style="width: 9%;">
                                        <select class="inline-edit" 
                                                onchange="updateDecisionField(${decision.id}, 'priority', this.value)"
                                                style="border: none; background: transparent; width: 100%; font-size: 11px;">
                                            <option value="Low" ${decision.priority === 'Low' ? 'selected' : ''}>Low</option>
                                            <option value="Medium" ${decision.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                            <option value="High" ${decision.priority === 'High' ? 'selected' : ''}>High</option>
                                            <option value="Critical" ${decision.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                                        </select>
                                    </td>
                                    <td style="width: 11%;">
                                        <input type="date" value="${decision.dueDate}" 
                                               class="inline-edit" 
                                               onchange="updateDecisionField(${decision.id}, 'dueDate', this.value)"
                                               style="border: none; background: transparent; width: 100%; font-size: 11px;">
                                    </td>
                                    <td style="width: 9%;">
                                        <select class="inline-edit" 
                                                onchange="updateDecisionField(${decision.id}, 'status', this.value)"
                                                style="border: none; background: transparent; width: 100%; font-size: 11px;">
                                            <option value="Pending" ${decision.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                            <option value="In Progress" ${decision.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                            <option value="Decided" ${decision.status === 'Decided' ? 'selected' : ''}>Decided</option>
                                            <option value="On Hold" ${decision.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                                        </select>
                                    </td>
                                    <td style="width: 8%;">
                                        <div style="display: flex; gap: 2px; align-items: center;">
                                            <a href="tel:${getDecisionContactPhone(decision.assignedTo)}" 
                                               style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">📞</a>
                                            <a href="sms:${getDecisionContactPhone(decision.assignedTo)}&body=${encodeURIComponent(`Decision: ${decision.title}\\nDue: ${decision.dueDate}\\nPriority: ${decision.priority}`)}" 
                                               style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">💬</a>
                                        </div>
                                    </td>
                                    <td style="width: 6%;">
                                        <button onclick="deleteDecision(${decision.id})" 
                                                style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px; padding: 2px; border-radius: 4px; hover: background-color: #fef2f2;" 
                                                title="Delete decision">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
            
            ${allTasks.filter(t => t.status === 'Completed').length > 0 ? `
            <div id="completed-details" class="details-section">
                <div class="card">
                    <button class="close-details" onclick="toggleDetails('completed');">✕ Close</button>
                    <h4 style="margin-bottom: 16px;">Completed Tasks (${allTasks.filter(t => t.status === 'Completed').length})</h4>
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
                                    <td>${task.category || 'General'}</td>
                                    <td>${task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
        </div>

        <!-- Contacts Tab -->
        <div id="contacts" class="tab-content">
            <div class="card">
                <h3>📞 Project Team Contacts</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">
                        <h4 style="color: #1e293b; margin-bottom: 10px; font-size: 14px;">🏗️ Site Management</h4>
                        <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                            <strong>Vishal - Site Manager</strong><br>
                            📱 +91 9310203344<br>
                            <a href="tel:+919310203344" class="btn" style="font-size: 10px; padding: 6px 12px; margin-top: 8px; margin-right: 8px;">Call</a>
                            <a href="sms:+919310203344" class="btn btn-secondary" style="font-size: 10px; padding: 6px 12px; margin-top: 8px;">SMS</a>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                        <h4 style="color: #1e293b; margin-bottom: 10px; font-size: 14px;">🎨 Design & Decisions</h4>
                        <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                            <strong>Arushi - Design Lead</strong><br>
                            📱 +91 9810312309<br>
                            <a href="tel:+919810312309" class="btn" style="font-size: 10px; padding: 6px 12px; margin-top: 8px; margin-right: 8px;">Call</a>
                            <a href="sms:+919810312309" class="btn btn-secondary" style="font-size: 10px; padding: 6px 12px; margin-top: 8px;">SMS</a>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                        <h4 style="color: #1e293b; margin-bottom: 10px; font-size: 14px;">🔧 Specialized Work</h4>
                        <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                            <strong>Sabharwal - Contractor</strong><br>
                            📱 +91 9868226580<br>
                            <strong>Sandeep - Electrical/Roofing</strong><br>
                            📱 +91 9810165187<br>
                            <strong>Pradeep - HVAC</strong><br>
                            📱 +91 9540475132<br>
                        </div>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                        <h4 style="color: #1e293b; margin-bottom: 10px; font-size: 14px;">🍽️ Kitchen Equipment</h4>
                        <div style="color: #64748b; font-size: 12px; line-height: 1.5;">
                            <strong>Sunil - Equipment Vendor</strong><br>
                            📱 +91 9810086477<br>
                            <a href="tel:+919810086477" class="btn" style="font-size: 10px; padding: 6px 12px; margin-top: 8px; margin-right: 8px;">Call</a>
                            <a href="sms:+919810086477" class="btn btn-secondary" style="font-size: 10px; padding: 6px 12px; margin-top: 8px;">SMS</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Task Tab -->
        <div id="add-task" class="tab-content">
            <div class="card">
                <h3>➕ Add New Task</h3>
                <div id="task-message" class="message" style="display: none;"></div>
                <form id="taskForm">
                    <div class="form-group">
                        <label class="form-label">Task Title *</label>
                        <input type="text" class="form-input" name="title" required placeholder="e.g., Install kitchen exhaust system">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Owner/Contractor *</label>
                            <input type="text" class="form-input" name="owner" required placeholder="e.g., Vishal, Sabharwal">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select class="form-select" name="category">
                                <option value="General">General</option>
                                <option value="HVAC">HVAC</option>
                                <option value="Painting">Painting</option>
                                <option value="Interior">Interior</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Flooring">Flooring</option>
                                <option value="Design">Design</option>
                                <option value="Kitchen">Kitchen</option>
                                <option value="Planning">Planning</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Waterproofing">Waterproofing</option>
                                <option value="Roofing">Roofing</option>
                                <option value="Signage">Signage</option>
                                <option value="Tiling">Tiling</option>
                                <option value="Storage">Storage</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Safety">Safety</option>
                                <option value="Legal">Legal</option>
                                <option value="Security">Security</option>
                                <option value="Technology">Technology</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Operations">Operations</option>
                                <option value="Construction">Construction</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select class="form-select" name="priority">
                                <option value="Medium" selected>Medium</option>
                                <option value="Low">Low</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="date" class="form-input" name="dueDate" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="form-textarea" name="notes" placeholder="Additional details, requirements, or constraints..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">Add Task</button>
                </form>
            </div>
        </div>

        <!-- Add Decisions Tab -->
        <div id="decisions" class="tab-content">
            <div class="card">
                <h3>➕ Add New Decision</h3>
                <div id="decision-message" class="message" style="display: none;"></div>
                <form id="decisionForm">
                    <div class="form-group">
                        <label class="form-label">Decision Title *</label>
                        <input type="text" class="form-input" name="title" required placeholder="e.g., Choose flooring material for dining area">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Assigned To *</label>
                            <select class="form-select" name="assignedTo" required>
                                <option value="">Select Person</option>
                                <option value="Arushi">Arushi</option>
                                <option value="Vishal">Vishal</option>
                                <option value="Sabharwal">Sabharwal</option>
                                <option value="Sandeep">Sandeep</option>
                                <option value="Pradeep">Pradeep</option>
                                <option value="Sunil">Sunil</option>
                                <option value="Team">Team</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Priority</label>
                            <select class="form-select" name="priority">
                                <option value="Medium" selected>Medium</option>
                                <option value="Low">Low</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Due Date</label>
                        <input type="date" class="form-input" name="dueDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" name="description" placeholder="Describe the decision needed, options available, constraints, etc."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">Add Decision</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Tab functionality
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // Details toggle functionality
        function toggleDetails(section) {
            const detailsEl = document.getElementById(section + '-details');
            if (detailsEl) {
                detailsEl.classList.toggle('active');
            }
        }

        // Form submission handlers
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
                
                if (response.ok) {
                    document.getElementById('task-message').innerHTML = '✅ Task added successfully!';
                    document.getElementById('task-message').className = 'message success';
                    document.getElementById('task-message').style.display = 'block';
                    e.target.reset();
                    setTimeout(() => location.reload(), 1500);
                } else {
                    throw new Error('Failed to add task');
                }
            } catch (error) {
                document.getElementById('task-message').innerHTML = '❌ Error adding task. Please try again.';
                document.getElementById('task-message').className = 'message error';
                document.getElementById('task-message').style.display = 'block';
            }
        });

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
                
                if (response.ok) {
                    document.getElementById('decision-message').innerHTML = '✅ Decision added successfully!';
                    document.getElementById('decision-message').className = 'message success';
                    document.getElementById('decision-message').style.display = 'block';
                    e.target.reset();
                    setTimeout(() => location.reload(), 1500);
                } else {
                    throw new Error('Failed to add decision');
                }
            } catch (error) {
                document.getElementById('decision-message').innerHTML = '❌ Error adding decision. Please try again.';
                document.getElementById('decision-message').className = 'message error';
                document.getElementById('decision-message').style.display = 'block';
            }
        });

        // Update functions for inline editing
        async function updateTaskField(taskId, field, value) {
            try {
                const response = await fetch(\`/api/tasks/\${taskId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [field]: value })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update task');
                }
            } catch (error) {
                alert('Error updating task: ' + error.message);
            }
        }

        async function updateDecisionField(decisionId, field, value) {
            try {
                const response = await fetch(\`/api/decisions/\${decisionId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [field]: value })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update decision');
                }
            } catch (error) {
                alert('Error updating decision: ' + error.message);
            }
        }

        async function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    const response = await fetch(\`/api/tasks/\${taskId}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        location.reload();
                    } else {
                        throw new Error('Failed to delete task');
                    }
                } catch (error) {
                    alert('Error deleting task: ' + error.message);
                }
            }
        }

        async function deleteDecision(decisionId) {
            if (confirm('Are you sure you want to delete this decision?')) {
                try {
                    const response = await fetch(\`/api/decisions/\${decisionId}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        location.reload();
                    } else {
                        throw new Error('Failed to delete decision');
                    }
                } catch (error) {
                    alert('Error deleting decision: ' + error.message);
                }
            }
        }
    </script>
</body>
</html>
      `);
      return;
    }

    // API endpoints would be handled here
    res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};