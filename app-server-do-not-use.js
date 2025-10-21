const http = require('http');
const fs = require('fs');
const { parseMarkdownTasks, generateProjectSummary } = require('./data-parser');

const PORT = 8080;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getMainAppHTML());
  } else if (req.method === 'GET' && req.url === '/api/tasks') {
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: tasks,
      total: tasks.length
    }));
  } else if (req.method === 'GET' && req.url === '/api/project/summary') {
    const tasks = parseMarkdownTasks('./PB Build - Action Items.md');
    const summary = generateProjectSummary(tasks);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: summary
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function getMainAppHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Build Management</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.5;
            font-size: 12px;
        }
        
        /* Mobile PWA Styles */
        .mobile-app {
            display: block;
            height: 100vh;
            max-width: 100vw;
        }
        
        .desktop-app {
            display: none;
        }
        
        @media (min-width: 1024px) {
            .mobile-app { display: none; }
            .desktop-app { display: flex; }
        }
        
        /* Header */
        .header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 16px;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .header h1 {
            font-size: 12px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 4px;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
        }
        
        /* Tabs */
        .tab-bar {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            padding: 0;
        }
        
        .tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 11px;
            color: #64748b;
            border-bottom: 2px solid transparent;
        }
        
        .tab.active {
            color: #3b82f6;
            border-bottom-color: #3b82f6;
            background: #f8fafc;
        }
        
        /* Content */
        .content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            padding-bottom: 80px;
        }
        
        .card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .card h3 {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #1e293b;
        }
        
        /* Progress Bar */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            margin: 8px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        /* Task List */
        .task-item {
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 8px;
            background: white;
        }
        
        .task-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 4px;
            color: #1e293b;
        }
        
        .task-meta {
            display: flex;
            gap: 8px;
            font-size: 10px;
            color: #64748b;
            margin-bottom: 8px;
        }
        
        .priority-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .priority-critical { background: #fee2e2; color: #dc2626; }
        .priority-high { background: #fef3c7; color: #d97706; }
        .priority-medium { background: #dbeafe; color: #2563eb; }
        .priority-low { background: #f0fdf4; color: #16a34a; }
        
        .status-badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .status-completed { background: #f0fdf4; color: #16a34a; }
        .status-in-progress { background: #dbeafe; color: #2563eb; }
        .status-not-started { background: #f1f5f9; color: #64748b; }
        .status-awaiting { background: #fef3c7; color: #d97706; }
        
        /* Contact Buttons */
        .contact-btn {
            padding: 8px 12px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 10px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-right: 8px;
            margin-top: 8px;
        }
        
        .contact-btn:hover {
            background: #2563eb;
        }
        
        /* Desktop Command Center */
        .desktop-app {
            height: 100vh;
        }
        
        .sidebar {
            width: 300px;
            background: white;
            border-right: 1px solid #e2e8f0;
            padding: 24px;
            overflow-y: auto;
        }
        
        .main-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
        }
        
        .contractor-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }
        
        .contractor-card {
            text-align: center;
            padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
        }
        
        .contractor-name {
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .contractor-role {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <!-- Mobile PWA Interface -->
    <div class="mobile-app">
        <div class="header">
            <h1>MY RESTAURANT BUILD</h1>
            <div class="text-xs text-gray-500" id="current-date"></div>
            <div class="status-indicator">
                <div class="status-dot"></div>
                <span style="font-size: 11px; color: #10b981; font-weight: bold;">ON TRACK</span>
            </div>
        </div>
        
        <div class="tab-bar">
            <button class="tab active" onclick="showTab('home')">🏠 Home</button>
            <button class="tab" onclick="showTab('tasks')">📋 Tasks</button>
            <button class="tab" onclick="showTab('team')">👥 Team</button>
        </div>
        
        <div class="content">
            <!-- Home Tab -->
            <div id="home-tab" class="tab-content">
                <div class="card">
                    <h3>PROJECT OVERVIEW</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 11px; color: #64748b;">Progress</span>
                        <span style="font-size: 11px; font-weight: bold;" id="progress-text">Loading...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; margin-top: 12px;">
                        <div>
                            <div style="font-size: 11px; font-weight: bold;" id="total-tasks">-</div>
                            <div style="font-size: 10px; color: #64748b;">Total</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: bold; color: #16a34a;" id="completed-tasks">-</div>
                            <div style="font-size: 10px; color: #64748b;">Done</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: bold; color: #2563eb;" id="active-tasks">-</div>
                            <div style="font-size: 10px; color: #64748b;">Active</div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>URGENT TASKS</h3>
                    <div id="urgent-tasks-list">Loading...</div>
                </div>
            </div>
            
            <!-- Tasks Tab -->
            <div id="tasks-tab" class="tab-content" style="display: none;">
                <div class="card">
                    <h3>ALL TASKS</h3>
                    <div id="all-tasks-list">Loading tasks...</div>
                </div>
            </div>
            
            <!-- Team Tab -->
            <div id="team-tab" class="tab-content" style="display: none;">
                <div class="card">
                    <h3>CONTRACTOR TEAM</h3>
                    <div class="contractor-grid">
                        <div class="contractor-card">
                            <div class="contractor-name">👷‍♂️ Vishal</div>
                            <div class="contractor-role">Lead Contractor</div>
                            <a href="tel:+919876543210" class="contact-btn">📞 Call</a>
                        </div>
                        <div class="contractor-card">
                            <div class="contractor-name">👩‍💼 Arushi</div>
                            <div class="contractor-role">Project Manager</div>
                            <a href="tel:+919876543212" class="contact-btn">📞 Call</a>
                        </div>
                        <div class="contractor-card">
                            <div class="contractor-name">⚡ Sabharwal</div>
                            <div class="contractor-role">Electrical</div>
                            <a href="tel:+919876543211" class="contact-btn">📞 Call</a>
                        </div>
                        <div class="contractor-card">
                            <div class="contractor-name">🔧 Sandeep</div>
                            <div class="contractor-role">Plumbing</div>
                            <a href="tel:+919876543213" class="contact-btn">📞 Call</a>
                        </div>
                        <div class="contractor-card">
                            <div class="contractor-name">🍳 Pradeep</div>
                            <div class="contractor-role">Kitchen Specialist</div>
                            <a href="tel:+919876543214" class="contact-btn">📞 Call</a>
                        </div>
                        <div class="contractor-card">
                            <div class="contractor-name">🎨 Bhargav</div>
                            <div class="contractor-role">Finishing</div>
                            <a href="tel:+919876543215" class="contact-btn">📞 Call</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Desktop Command Center -->
    <div class="desktop-app">
        <div class="sidebar">
            <h1 style="font-size: 12px; font-weight: bold; margin-bottom: 24px;">POTBELLY BUILD COMMAND CENTER</h1>
            
            <div class="card" style="margin-bottom: 16px;">
                <h3>PROJECT STATUS</h3>
                <div id="desktop-progress" style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 11px;">Progress</span>
                        <span style="font-size: 11px; font-weight: bold;" id="desktop-progress-text">Loading...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="desktop-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>QUICK STATS</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10px;">
                    <div style="text-align: center; padding: 8px;">
                        <div style="font-weight: bold;" id="desktop-total">-</div>
                        <div style="color: #64748b;">Total Tasks</div>
                    </div>
                    <div style="text-align: center; padding: 8px;">
                        <div style="font-weight: bold; color: #dc2626;" id="desktop-urgent">-</div>
                        <div style="color: #64748b;">Urgent</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="main-content">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 24px;">Project Dashboard</h2>
            
            <div class="grid">
                <div class="card">
                    <h3>HIGH PRIORITY TASKS</h3>
                    <div id="desktop-urgent-tasks">Loading...</div>
                </div>
                
                <div class="card">
                    <h3>TEAM OVERVIEW</h3>
                    <div style="font-size: 11px; color: #64748b;">6 Active Contractors</div>
                    <div style="margin-top: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 10px;">Vishal (Lead)</span>
                            <span style="font-size: 10px; color: #16a34a;">✓ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 10px;">Arushi (PM)</span>
                            <span style="font-size: 10px; color: #16a34a;">✓ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-size: 10px;">Sabharwal (Electrical)</span>
                            <span style="font-size: 10px; color: #16a34a;">✓ Active</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-size: 10px;">Sandeep (Plumbing)</span>
                            <span style="font-size: 10px; color: #16a34a;">✓ Active</span>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>RECENT ACTIVITY</h3>
                    <div id="desktop-recent-tasks">Loading...</div>
                </div>
                
                <div class="card">
                    <h3>UPCOMING DEADLINES</h3>
                    <div id="desktop-upcoming">Loading...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Set current date
        document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric', 
            year: 'numeric'
        });
        
        // Tab switching
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName + '-tab').style.display = 'block';
            event.target.classList.add('active');
        }
        
        // Load data
        async function loadData() {
            try {
                // Load project summary
                const summaryResponse = await fetch('/api/project/summary');
                const summaryData = await summaryResponse.json();
                const summary = summaryData.data.summary;
                
                // Update progress
                const progress = summary.progress || 0;
                document.getElementById('progress-text').textContent = progress + '% Complete';
                document.getElementById('progress-fill').style.width = progress + '%';
                document.getElementById('desktop-progress-text').textContent = progress + '% Complete';
                document.getElementById('desktop-progress-fill').style.width = progress + '%';
                
                // Update stats
                document.getElementById('total-tasks').textContent = summary.total || 0;
                document.getElementById('completed-tasks').textContent = summary.completed || 0;
                document.getElementById('active-tasks').textContent = summary.inProgress || 0;
                document.getElementById('desktop-total').textContent = summary.total || 0;
                
                // Load tasks
                const tasksResponse = await fetch('/api/tasks');
                const tasksData = await tasksResponse.json();
                const tasks = tasksData.data || [];
                
                // Get urgent tasks
                const urgentTasks = tasks.filter(task => 
                    task.priority === 'Critical' || task.priority === 'High'
                ).slice(0, 5);
                
                document.getElementById('desktop-urgent').textContent = urgentTasks.length;
                
                // Display urgent tasks
                displayUrgentTasks(urgentTasks);
                displayAllTasks(tasks);
                displayDesktopTasks(urgentTasks, tasks);
                
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
        
        function displayUrgentTasks(tasks) {
            const container = document.getElementById('urgent-tasks-list');
            if (tasks.length === 0) {
                container.innerHTML = '<div style="color: #16a34a; font-size: 11px;">🎉 No urgent tasks!</div>';
                return;
            }
            
            container.innerHTML = tasks.map(task => \`
                <div class="task-item">
                    <div class="task-title">\${task.title}</div>
                    <div class="task-meta">
                        <span>\${task.owner}</span>
                        <span>•</span>
                        <span>\${task.dueDate}</span>
                    </div>
                    <span class="priority-badge priority-\${task.priority.toLowerCase()}">\${task.priority}</span>
                    <span class="status-badge status-\${task.status.toLowerCase().replace(' ', '-')}">\${task.status}</span>
                </div>
            \`).join('');
        }
        
        function displayAllTasks(tasks) {
            const container = document.getElementById('all-tasks-list');
            container.innerHTML = tasks.slice(0, 10).map(task => \`
                <div class="task-item">
                    <div class="task-title">\${task.title}</div>
                    <div class="task-meta">
                        <span>\${task.owner}</span>
                        <span>•</span>
                        <span>\${task.dueDate}</span>
                        <span>•</span>
                    </div>
                    <div style="margin-top: 8px;">
                        <span class="priority-badge priority-\${task.priority.toLowerCase()}">\${task.priority}</span>
                        <span class="status-badge status-\${task.status.toLowerCase().replace(' ', '-')}">\${task.status}</span>
                    </div>
                </div>
            \`).join('') + (tasks.length > 10 ? \`<div style="text-align: center; margin-top: 16px; color: #64748b; font-size: 11px;">... and \${tasks.length - 10} more tasks</div>\` : '');
        }
        
        function displayDesktopTasks(urgentTasks, allTasks) {
            // Desktop urgent tasks
            const urgentContainer = document.getElementById('desktop-urgent-tasks');
            urgentContainer.innerHTML = urgentTasks.slice(0, 3).map(task => \`
                <div style="margin-bottom: 12px; padding: 8px; background: #fef2f2; border-radius: 4px; border-left: 3px solid #dc2626;">
                    <div style="font-size: 10px; font-weight: bold; margin-bottom: 4px;">\${task.title}</div>
                    <div style="font-size: 9px; color: #64748b;">\${task.owner} • \${task.dueDate}</div>
                </div>
            \`).join('');
            
            // Recent tasks
            const recentContainer = document.getElementById('desktop-recent-tasks');
            recentContainer.innerHTML = allTasks.slice(0, 4).map(task => \`
                <div style="margin-bottom: 8px; font-size: 10px;">
                    <div style="font-weight: bold;">\${task.title.substring(0, 40)}...</div>
                    <div style="color: #64748b;">\${task.owner}</div>
                </div>
            \`).join('');
            
            // Upcoming deadlines
            const upcomingContainer = document.getElementById('desktop-upcoming');
            const upcoming = allTasks
                .filter(task => new Date(task.dueDate) > new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 4);
            
            upcomingContainer.innerHTML = upcoming.map(task => \`
                <div style="margin-bottom: 8px; font-size: 10px;">
                    <div style="font-weight: bold;">\${task.title.substring(0, 40)}...</div>
                    <div style="color: #64748b;">\${task.dueDate}</div>
                </div>
            \`).join('');
        }
        
        // Load data on page load
        loadData();
        
        // Reload data every 30 seconds
        setInterval(loadData, 30000);
    </script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log('🏗️ Potbelly Build Management System');
  console.log(`📱 Mobile PWA for Pooja: http://localhost:${PORT}`);
  console.log(`💻 Desktop Command Center for Arushi: http://localhost:${PORT}`);
  console.log('');
  console.log('✅ System Status: RUNNING');
  console.log('📊 Real Data Integration: ACTIVE');
  console.log('🚀 Full Functional Interface: READY');
});

module.exports = server;