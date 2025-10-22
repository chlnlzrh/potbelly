// Simple Vercel serverless function for Potbelly Build Management
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Serve the main HTML for GET requests
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(getMainHTML());
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

function getMainHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potbelly Restaurant Build - Management Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
        }
        .nav-tabs {
            display: flex;
            background: white;
            border-radius: 8px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .nav-tab {
            flex: 1;
            padding: 16px 24px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            border-right: 1px solid #f1f5f9;
        }
        .nav-tab:last-child { border-right: none; }
        .nav-tab.active {
            background: #3b82f6;
            color: white;
        }
        .nav-tab:hover:not(.active) {
            background: #f8fafc;
        }
        .tab-content {
            display: none;
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .tab-content.active { display: block; }
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .contact-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .contacts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
        }
        .contact-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .contact-role {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 12px;
        }
        .contact-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .btn-call {
            background: #3b82f6;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .btn-text {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .status-coming-soon {
            text-align: center;
            padding: 40px;
            color: #64748b;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Potbelly Restaurant Build Management</h1>
            <p>Project Dashboard & Team Coordination</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('dashboard')">🏠 Dashboard</button>
            <button class="nav-tab" onclick="showTab('contacts')">📞 Contacts</button>
            <button class="nav-tab" onclick="showTab('tasks')">📋 Tasks</button>
            <button class="nav-tab" onclick="showTab('decisions')">⚖️ Decisions</button>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="card">
                <h3>📊 Project Overview</h3>
                <p>Welcome to the Potbelly Restaurant Build Management Dashboard. This is a simplified version deployed on Vercel.</p>
                <p style="margin-top: 16px; padding: 16px; background: #fef3c7; border-radius: 6px; color: #92400e;">
                    <strong>Note:</strong> Full task management features are available when running locally with the Node.js server.
                </p>
            </div>
        </div>

        <!-- Contacts Tab -->
        <div id="contacts" class="tab-content">
            <div class="contacts-grid">
                <div class="contact-card">
                    <div class="contact-name">👩‍🎨 Arushi</div>
                    <div class="contact-role">Architect and Interior Design</div>
                    <div class="contact-buttons">
                        <a href="tel:9810312309" class="btn-call">📞 Call</a>
                        <a href="sms:9810312309" class="btn-text">💬 Text</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <div class="contact-name">🪵 Sabharwal</div>
                    <div class="contact-role">Wood Work</div>
                    <div class="contact-buttons">
                        <a href="tel:9868226580" class="btn-call">📞 Call</a>
                        <a href="sms:9868226580" class="btn-text">💬 Text</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <div class="contact-name">🔨 Vishal</div>
                    <div class="contact-role">General Contractor</div>
                    <div class="contact-buttons">
                        <a href="tel:9310203344" class="btn-call">📞 Call</a>
                        <a href="sms:9310203344" class="btn-text">💬 Text</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <div class="contact-name">🏗️ Sandeep</div>
                    <div class="contact-role">Tensile Structure</div>
                    <div class="contact-buttons">
                        <a href="tel:9810165187" class="btn-call">📞 Call</a>
                        <a href="sms:9810165187" class="btn-text">💬 Text</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <div class="contact-name">❄️ Pradeep</div>
                    <div class="contact-role">HVAC & Exhaust</div>
                    <div class="contact-buttons">
                        <a href="tel:9540475132" class="btn-call">📞 Call</a>
                        <a href="sms:9540475132" class="btn-text">💬 Text</a>
                    </div>
                </div>
                
                <div class="contact-card">
                    <div class="contact-name">🍳 Sunil</div>
                    <div class="contact-role">Kitchen & Equipment</div>
                    <div class="contact-buttons">
                        <a href="tel:9810086477" class="btn-call">📞 Call</a>
                        <a href="sms:9810086477" class="btn-text">💬 Text</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tasks Tab -->
        <div id="tasks" class="tab-content">
            <div class="card">
                <h3>📋 Task Management</h3>
                <div class="status-coming-soon">
                    <p>Interactive task management is available when running the full Node.js server locally.</p>
                    <p style="margin-top: 12px;">Run <code>node pooja-data-entry.js</code> for complete functionality.</p>
                </div>
            </div>
        </div>

        <!-- Decisions Tab -->
        <div id="decisions" class="tab-content">
            <div class="card">
                <h3>⚖️ Decision Tracking</h3>
                <div class="status-coming-soon">
                    <p>Decision tracking is available when running the full Node.js server locally.</p>
                    <p style="margin-top: 12px;">Run <code>node pooja-data-entry.js</code> for complete functionality.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked nav tab
            event.target.classList.add('active');
        }
    </script>
</body>
</html>`;
}