// Phone number mapping functions for server-side rendering
function getOwnerPhone(owner) {
    const phoneMap = {
        'Pradeep': '+919810312309',
        'Vishal': '+919868226580',
        'Sunil': '+919310203344',
        'Arushi': '+919810165187',
        'Sandeep': '+919540475132',
        'Sabharwal': '+919810086477',
        'Team': '+919810312309',
        'Bhargav': '+919810312309'
    };
    return phoneMap[owner] || '+919810312309';
}

function getDecisionContactPhone(assignedTo) {
    const phoneMap = {
        'Pradeep': '+919810312309',
        'Vishal': '+919868226580',
        'Sunil': '+919310203344',
        'Arushi': '+919810165187',
        'Sandeep': '+919540475132',
        'Sabharwal': '+919810086477',
        'Team': '+919810312309',
        'Bhargav': '+919810312309'
    };
    return phoneMap[assignedTo] || '+919810312309';
}

// Complete embedded data for serverless function (matching local server)
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
  },
  {
    "id": 6,
    "title": "Finalize material selection for terrace glass frame (MS vs aluminum)",
    "owner": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "High",
    "status": "Awaiting Decision",
    "category": "Design",
    "notes": ""
  },
  {
    "id": 7,
    "title": "Finalize liquor storage room finishes",
    "owner": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "Medium",
    "status": "Awaiting Decision",
    "category": "Design",
    "notes": ""
  },
  {
    "id": 8,
    "title": "Decide terrace wall treatment (paint vs tiles)",
    "owner": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "Medium",
    "status": "Awaiting Decision",
    "category": "Design",
    "notes": ""
  },
  {
    "id": 9,
    "title": "Deliver kitchen equipment post-Diwali",
    "owner": "Sunil",
    "dueDate": "2025-11-05",
    "priority": "Critical",
    "status": "Awaiting Vendor",
    "category": "Kitchen",
    "notes": ""
  },
  {
    "id": 10,
    "title": "Coordinate kitchen equipment layout meeting",
    "owner": "Arushi + Vishal + Sunil + Team",
    "dueDate": "2025-10-23",
    "priority": "High",
    "status": "Not Started",
    "category": "Planning",
    "notes": ""
  },
  {
    "id": 11,
    "title": "Install electrical fixtures and final fittings",
    "owner": "Vishal",
    "dueDate": "2025-11-01",
    "priority": "High",
    "status": "Awaiting Site Readiness",
    "category": "Electrical",
    "notes": ""
  },
  {
    "id": 12,
    "title": "Submit reimbursement documentation for terrace repair to landlord",
    "owner": "Vishal",
    "dueDate": "2025-10-25",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Documentation",
    "notes": ""
  },
  {
    "id": 13,
    "title": "Complete terrace waterproofing and grouting",
    "owner": "Vishal",
    "dueDate": "2025-10-28",
    "priority": "High",
    "status": "Not Started",
    "category": "Waterproofing",
    "notes": ""
  },
  {
    "id": 14,
    "title": "Install terrace roofing (tensile fabric)",
    "owner": "Sandeep",
    "dueDate": "2025-10-31",
    "priority": "High",
    "status": "Design Approved",
    "category": "Roofing",
    "notes": ""
  },
  {
    "id": 15,
    "title": "Install signage at stairwell entrance",
    "owner": "Vishal & Bhargav",
    "dueDate": "2025-11-03",
    "priority": "Low",
    "status": "Not Started",
    "category": "Signage",
    "notes": ""
  },
  {
    "id": 16,
    "title": "Finalize stairwell wall treatment (wallpaper/photos)",
    "owner": "Arushi",
    "dueDate": "2025-10-25",
    "priority": "Medium",
    "status": "Awaiting Decision",
    "category": "Design",
    "notes": ""
  },
  {
    "id": 17,
    "title": "Complete floor grouting and machine buffing (terrace)",
    "owner": "Vishal",
    "dueDate": "2025-11-01",
    "priority": "Medium",
    "status": "Awaiting Prerequisites",
    "category": "Flooring",
    "notes": ""
  },
  {
    "id": 18,
    "title": "Install wallpaper for bar back",
    "owner": "Vishal",
    "dueDate": "2025-11-02",
    "priority": "Medium",
    "status": "Design in Progress",
    "category": "Interior",
    "notes": ""
  },
  {
    "id": 19,
    "title": "Install RO (reverse osmosis) system in terrace bathroom",
    "owner": "Vishal",
    "dueDate": "2025-10-30",
    "priority": "Low",
    "status": "Not Started",
    "category": "Plumbing",
    "notes": ""
  },
  {
    "id": 20,
    "title": "Apply waterproof texture paint on terrace walls",
    "owner": "Vishal",
    "dueDate": "2025-11-03",
    "priority": "Medium",
    "status": "Awaiting Prerequisites",
    "category": "Painting",
    "notes": ""
  },
  {
    "id": 21,
    "title": "Install wall fans for washing area ventilation (2 units)",
    "owner": "Pradeep + Vishal",
    "dueDate": "2025-10-30",
    "priority": "Low",
    "status": "Not Started",
    "category": "HVAC",
    "notes": ""
  },
  {
    "id": 22,
    "title": "Complete skirting work in terrace bathroom",
    "owner": "Vishal",
    "dueDate": "2025-10-30",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Interior",
    "notes": ""
  },
  {
    "id": 23,
    "title": "Install bison board enclosure for washing area",
    "owner": "Vishal",
    "dueDate": "2025-10-28",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Construction",
    "notes": ""
  },
  {
    "id": 24,
    "title": "Apply commercial tiles over bison board (washing area)",
    "owner": "Vishal",
    "dueDate": "2025-11-01",
    "priority": "Medium",
    "status": "Awaiting Prerequisites",
    "category": "Tiling",
    "notes": ""
  },
  {
    "id": 25,
    "title": "Recondition and integrate existing kitchen equipment",
    "owner": "Sunil",
    "dueDate": "2025-11-06",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Kitchen",
    "notes": ""
  },
  {
    "id": 26,
    "title": "Install stainless steel shelving in liquor storage room",
    "owner": "Vishal",
    "dueDate": "2025-11-05",
    "priority": "Low",
    "status": "Awaiting Design Approval",
    "category": "Storage",
    "notes": ""
  },
  {
    "id": 27,
    "title": "Complete fixed furniture installation (all areas)",
    "owner": "Sabharwal",
    "dueDate": "2025-11-03",
    "priority": "High",
    "status": "Not Started",
    "category": "Furniture",
    "notes": ""
  },
  {
    "id": 28,
    "title": "Repair and paint staircase (folding mechanism retained)",
    "owner": "Vishal",
    "dueDate": "2025-10-30",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Painting",
    "notes": ""
  },
  {
    "id": 29,
    "title": "Install electrical point for terrace signage",
    "owner": "Sandeep",
    "dueDate": "2025-10-28",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Electrical",
    "notes": ""
  },
  {
    "id": 30,
    "title": "Obtain restaurant license and food safety permits",
    "owner": "Arushi",
    "dueDate": "2025-11-10",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Legal",
    "notes": "FSSAI license, local municipal permits"
  },
  {
    "id": 31,
    "title": "Install fire safety equipment (extinguishers, smoke detectors)",
    "owner": "Sandeep",
    "dueDate": "2025-11-01",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Safety",
    "notes": "NOC from fire department required"
  },
  {
    "id": 32,
    "title": "Complete grease trap installation for kitchen drainage",
    "owner": "Vishal",
    "dueDate": "2025-10-29",
    "priority": "High",
    "status": "Not Started",
    "category": "Plumbing",
    "notes": "Required for restaurant wastewater compliance"
  },
  {
    "id": 33,
    "title": "Install commercial dishwasher and three-compartment sink",
    "owner": "Sunil + Vishal",
    "dueDate": "2025-11-05",
    "priority": "High",
    "status": "Not Started",
    "category": "Kitchen",
    "notes": "Health department requirement"
  },
  {
    "id": 34,
    "title": "Set up commercial refrigeration units (walk-in cooler/freezer)",
    "owner": "Sunil",
    "dueDate": "2025-11-07",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Kitchen",
    "notes": "Temperature logging required"
  },
  {
    "id": 35,
    "title": "Install POS system and payment processing equipment",
    "owner": "Team",
    "dueDate": "2025-11-08",
    "priority": "High",
    "status": "Not Started",
    "category": "Technology",
    "notes": "Credit card terminals, cash register"
  },
  {
    "id": 36,
    "title": "Complete staff handwashing stations installation",
    "owner": "Vishal",
    "dueDate": "2025-10-31",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Plumbing",
    "notes": "Health code requirement - hot/cold water, soap dispensers"
  },
  {
    "id": 37,
    "title": "Install commercial grade flooring in kitchen area",
    "owner": "Vishal",
    "dueDate": "2025-10-30",
    "priority": "High",
    "status": "Not Started",
    "category": "Flooring",
    "notes": "Non-slip, easy-to-clean material required"
  },
  {
    "id": 38,
    "title": "Set up liquor license and bar inventory system",
    "owner": "Arushi",
    "dueDate": "2025-11-15",
    "priority": "High",
    "status": "Not Started",
    "category": "Legal",
    "notes": "State liquor license, inventory tracking"
  },
  {
    "id": 39,
    "title": "Install emergency exit lighting and signage",
    "owner": "Sandeep",
    "dueDate": "2025-11-02",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Safety",
    "notes": "Fire code compliance"
  },
  {
    "id": 40,
    "title": "Complete kitchen exhaust hood and ventilation system",
    "owner": "Pradeep",
    "dueDate": "2025-10-27",
    "priority": "Critical",
    "status": "Not Started",
    "category": "HVAC",
    "notes": "Required for cooking operations"
  },
  {
    "id": 41,
    "title": "Install food storage shelving and dry goods storage",
    "owner": "Sunil",
    "dueDate": "2025-11-04",
    "priority": "High",
    "status": "Not Started",
    "category": "Storage",
    "notes": "NSF certified shelving 6 inches off floor"
  },
  {
    "id": 42,
    "title": "Set up employee break room and changing area",
    "owner": "Vishal",
    "dueDate": "2025-11-01",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Interior",
    "notes": "Labor law compliance"
  },
  {
    "id": 43,
    "title": "Install commercial water heater for kitchen operations",
    "owner": "Vishal",
    "dueDate": "2025-10-29",
    "priority": "High",
    "status": "Not Started",
    "category": "Plumbing",
    "notes": "High capacity for dishwashing and food prep"
  },
  {
    "id": 44,
    "title": "Complete final health department inspection",
    "owner": "Arushi + Team",
    "dueDate": "2025-11-12",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Legal",
    "notes": "Required before opening"
  },
  {
    "id": 45,
    "title": "Install security system (cameras, alarms)",
    "owner": "Sandeep",
    "dueDate": "2025-11-05",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Security",
    "notes": "Insurance requirement"
  },
  {
    "id": 46,
    "title": "Set up Wi-Fi network and internet connectivity",
    "owner": "Team",
    "dueDate": "2025-11-06",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Technology",
    "notes": "Guest and staff access"
  },
  {
    "id": 47,
    "title": "Complete final cleaning and sanitization",
    "owner": "Team",
    "dueDate": "2025-11-14",
    "priority": "High",
    "status": "Not Started",
    "category": "Cleaning",
    "notes": "Deep clean before opening"
  },
  {
    "id": 48,
    "title": "Install music and sound system",
    "owner": "Sandeep",
    "dueDate": "2025-11-04",
    "priority": "Low",
    "status": "Not Started",
    "category": "Technology",
    "notes": "Background music, announcements"
  },
  {
    "id": 49,
    "title": "Set up waste management and recycling system",
    "owner": "Vishal",
    "dueDate": "2025-11-03",
    "priority": "Medium",
    "status": "Not Started",
    "category": "Operations",
    "notes": "Garbage disposal, composting, recycling bins"
  },
  {
    "id": 50,
    "title": "Complete insurance documentation and coverage",
    "owner": "Arushi",
    "dueDate": "2025-11-10",
    "priority": "Critical",
    "status": "Not Started",
    "category": "Legal",
    "notes": "General liability, property, workers comp"
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
  },
  {
    "id": 3,
    "title": "Decide terrace wall treatment (paint vs tiles)",
    "description": "Choose between paint and tiles for terrace walls. Consider weather resistance, maintenance, cost, and aesthetic appeal.",
    "assignedTo": "Arushi",
    "dueDate": "2025-10-23",
    "priority": "Medium",
    "status": "Pending",
    "options": [
      {
        "option": "Waterproof texture paint",
        "pros": ["Lower cost", "Easier application", "Flexible design"],
        "cons": ["Requires regular maintenance", "Less durable", "Weather dependent"]
      },
      {
        "option": "Exterior tiles",
        "pros": ["Very durable", "Weather resistant", "Low maintenance"],
        "cons": ["Higher cost", "Complex installation", "Limited design flexibility"]
      }
    ],
    "impact": "Medium - affects durability and maintenance costs",
    "createdAt": "2025-10-22T00:00:00.000Z",
    "updatedAt": "2025-10-22T00:00:00.000Z"
  },
  {
    "id": 4,
    "title": "Finalize stairwell wall treatment (wallpaper/photos)",
    "description": "Decide on wall treatment for stairwell area. Consider branding, aesthetics, durability, and customer experience.",
    "assignedTo": "Arushi",
    "dueDate": "2025-10-25",
    "priority": "Medium",
    "status": "Pending",
    "options": [
      {
        "option": "Custom wallpaper with restaurant branding",
        "pros": ["Strong branding", "Professional look", "Customizable"],
        "cons": ["Higher cost", "Replacement complexity", "Design limitations"]
      },
      {
        "option": "Framed photos/artwork",
        "pros": ["Changeable content", "Personal touch", "Cost effective"],
        "cons": ["Maintenance required", "Fragility", "Less cohesive look"]
      }
    ],
    "impact": "Low - primarily aesthetic, affects customer experience",
    "createdAt": "2025-10-22T00:00:00.000Z",
    "updatedAt": "2025-10-22T00:00:00.000Z"
  }
];

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/api/tasks') {
      try {
        const taskData = req.body;
        const newTask = {
          id: Math.max(...TASKS_DATA.map(t => t.id)) + 1,
          title: taskData.title,
          owner: taskData.owner,
          dueDate: taskData.dueDate,
          priority: taskData.priority || 'Medium',
          status: taskData.status || 'Not Started',
          category: taskData.category || '',
          notes: taskData.notes || '',
          updatedAt: new Date().toISOString()
        };
        
        TASKS_DATA.push(newTask);
        return res.json({ success: true, message: 'Task added successfully', task: newTask });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to add task: ' + error.message });
      }
    }
    
    if (url.pathname === '/api/decisions') {
      try {
        const decisionData = req.body;
        const newDecision = {
          id: Math.max(...DECISIONS_DATA.map(d => d.id)) + 1,
          title: decisionData.title,
          description: decisionData.description || '',
          assignedTo: decisionData.assignedTo,
          dueDate: decisionData.dueDate,
          priority: decisionData.priority || 'Medium',
          status: decisionData.status || 'Pending',
          impact: 'TBD - impact assessment needed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          options: []
        };
        
        DECISIONS_DATA.push(newDecision);
        return res.json({ success: true, message: 'Decision added successfully', decision: newDecision });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to add decision: ' + error.message });
      }
    }
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname.startsWith('/api/tasks/')) {
      try {
        const taskId = parseInt(url.pathname.split('/').pop());
        const taskIndex = TASKS_DATA.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) {
          return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        TASKS_DATA.splice(taskIndex, 1);
        return res.json({ success: true, message: 'Task deleted successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete task: ' + error.message });
      }
    }
    
    if (url.pathname.startsWith('/api/decisions/')) {
      try {
        const decisionId = parseInt(url.pathname.split('/').pop());
        const decisionIndex = DECISIONS_DATA.findIndex(d => d.id === decisionId);
        
        if (decisionIndex === -1) {
          return res.status(404).json({ success: false, message: 'Decision not found' });
        }
        
        DECISIONS_DATA.splice(decisionIndex, 1);
        return res.json({ success: true, message: 'Decision deleted successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete decision: ' + error.message });
      }
    }
  }

  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/api/tasks') {
      return res.json(TASKS_DATA);
    }
    
    if (url.pathname === '/api/decisions') {
      return res.json(DECISIONS_DATA);
    }

    // Calculate summary statistics (matching local server)
    const total = TASKS_DATA.length;
    const completed = TASKS_DATA.filter(t => t.status === 'Completed').length;
    const inProgress = TASKS_DATA.filter(t => t.status.includes('Progress')).length;
    const critical = TASKS_DATA.filter(t => t.priority === 'Critical').length;
    const progress = Math.round((completed / total) * 100);

    // Serve main HTML page (matching local server design exactly)
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏗️ Potbelly Restaurant Build</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .nav-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }
        
        .nav-tab {
            flex: 1;
            padding: 20px;
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }
        
        .nav-tab.active {
            background: white;
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .nav-tab:hover {
            background: #e9ecef;
        }
        
        .tab-content {
            padding: 30px;
            min-height: 600px;
            display: none;
        }
        
        .tab-content.active {
            display: block;
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
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .progress-card:hover {
            transform: translateY(-2px);
        }
        
        .big-number {
            font-size: 36px;
            font-weight: bold;
            display: block;
        }
        
        .card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 24px;
        }
        
        .card h3 {
            margin-bottom: 16px;
            color: #2c3e50;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }
        
        /* Optimized column widths for tables */
        .data-table th:nth-child(1), .data-table td:nth-child(1) { width: 50%; font-size: 12px; }
        .data-table th:nth-child(2), .data-table td:nth-child(2) { width: 15%; font-size: 11px; }
        .data-table th:nth-child(3), .data-table td:nth-child(3) { width: 12%; font-size: 11px; }
        .data-table th:nth-child(4), .data-table td:nth-child(4) { width: 11%; font-size: 11px; }
        .data-table th:nth-child(5), .data-table td:nth-child(5) { width: 8%; font-size: 11px; }
        .data-table th:nth-child(6), .data-table td:nth-child(6) { width: 4%; font-size: 11px; }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .priority-high { color: #dc3545; font-weight: 600; }
        .priority-medium { color: #fd7e14; font-weight: 600; }
        .priority-critical { color: #dc3545; font-weight: 700; background: #ffe6e6; }
        .priority-low { color: #6c757d; }
        
        .status-completed { color: #28a745; font-weight: 600; }
        .status-in-progress { color: #007bff; font-weight: 600; }
        .status-not-started { color: #6c757d; }
        .status-pending { color: #fd7e14; font-weight: 600; }
        .status-awaiting-prerequisites { color: #6c757d; }
        .status-awaiting-decision { color: #fd7e14; font-weight: 600; }
        .status-design-approved { color: #28a745; font-weight: 600; }
        .status-awaiting-vendor { color: #fd7e14; font-weight: 600; }
        .status-awaiting-site-readiness { color: #6c757d; }
        .status-design-in-progress { color: #007bff; font-weight: 600; }
        .status-awaiting-design-approval { color: #fd7e14; font-weight: 600; }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-contact {
            background: #28a745;
            color: white;
        }
        
        .btn-contact:hover {
            background: #218838;
            transform: translateY(-1px);
        }
        
        .btn-delete {
            background: #dc3545;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        
        .btn-delete:hover {
            background: #c82333;
            transform: translateY(-1px);
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-size: 18px;
        }
        
        .word-wrap {
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            max-width: 100%;
            line-height: 1.4;
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
            font-size: 12px;
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
        
        .message {
            display: none;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-weight: 600;
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
        
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header h1 { font-size: 1.8rem; }
            .nav-tab { padding: 15px 10px; font-size: 14px; }
            .tab-content { padding: 20px 15px; }
            th, td { padding: 8px 6px; font-size: 12px; }
            .progress-overview { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Potbelly Restaurant Build</h1>
            <div class="subtitle">Task & Decision Management</div>
        </div>
        
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('dashboard')">🏠 Dashboard</button>
            <button class="nav-tab" onclick="showTab('contacts')">📞 Contacts</button>
            <button class="nav-tab" onclick="showTab('add-task')">➕ Task</button>
            <button class="nav-tab" onclick="showTab('decisions')">➕ Decisions</button>
        </div>
        
        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="progress-overview">
                <div class="progress-card" onclick="toggleDetails('all-tasks')">
                    <span class="big-number" style="color: #1f2937;">${total}</span>
                    <div style="color: #64748b; font-size: 14px;">Total Tasks</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card" onclick="toggleDetails('in-progress')">
                    <span class="big-number" style="color: #2563eb;">${inProgress}</span>
                    <div style="color: #64748b; font-size: 14px;">In Progress</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card" onclick="toggleDetails('decisions')">
                    <span class="big-number" style="color: #d97706;">${DECISIONS_DATA.length}</span>
                    <div style="color: #64748b; font-size: 14px;">Total Decisions</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
                <div class="progress-card" onclick="toggleDetails('completed')">
                    <span class="big-number" style="color: #16a34a;">${completed}</span>
                    <div style="color: #64748b; font-size: 14px;">Completed</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 4px;">Click for details</div>
                </div>
            </div>
            <div class="card">
                <h3>📊 Project Status</h3>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                        ${progress}%
                    </div>
                    <div style="color: #64748b; margin-bottom: 16px;">Overall Progress</div>
                    <div style="background: #fef3c7; color: #d97706; padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; margin-top: 16px;">
                        Target Opening: Mid November 2025
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Contacts Tab -->
        <div id="contacts" class="tab-content">
            <div class="card">
                <h3>📞 Contacts</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 20px;">
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">👷</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Pradeep</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">HVAC & Electrical</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919810312309" style="color: #3b82f6; text-decoration: none;">+91 9810312309</a>
                            </div>
                            <a href="sms:+919810312309" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">🔨</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Vishal</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">General Construction</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919868226580" style="color: #3b82f6; text-decoration: none;">+91 9868226580</a>
                            </div>
                            <a href="sms:+919868226580" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">🍽️</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Sunil</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Kitchen Equipment</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919310203344" style="color: #3b82f6; text-decoration: none;">+91 9310203344</a>
                            </div>
                            <a href="sms:+919310203344" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">🎨</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Arushi</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Design & Permits</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919810165187" style="color: #3b82f6; text-decoration: none;">+91 9810165187</a>
                            </div>
                            <a href="sms:+919810165187" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">⚡</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Sandeep</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Electrical & Safety</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919540475132" style="color: #3b82f6; text-decoration: none;">+91 9540475132</a>
                            </div>
                            <a href="sms:+919540475132" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                    <div class="contact-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="margin-right: 8px; font-size: 24px;">🪑</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Sabharwal</h4>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">Furniture & Fixtures</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📱</span>
                                <a href="tel:+919810086477" style="color: #3b82f6; text-decoration: none;">+91 9810086477</a>
                            </div>
                            <a href="sms:+919810086477" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">💬 Text</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Task Tab -->
        <div id="add-task" class="tab-content">
            <div class="card">
                <h3>➕ New Task</h3>
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
                                <option value="Pradeep">Pradeep (HVAC & Electrical)</option>
                                <option value="Sunil">Sunil (Kitchen Equipment)</option>
                                <option value="Sandeep">Sandeep (Electrical & Safety)</option>
                                <option value="Team">Team (Multiple)</option>
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
                        <label class="form-label">Category</label>
                        <select class="form-select" name="category">
                            <option value="">Select Category</option>
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
                            <option value="Construction">Construction</option>
                            <option value="Tiling">Tiling</option>
                            <option value="Storage">Storage</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Safety">Safety</option>
                            <option value="Legal">Legal</option>
                            <option value="Technology">Technology</option>
                            <option value="Security">Security</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Operations">Operations</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="form-textarea" name="notes" placeholder="Additional details, requirements, or dependencies..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">➕ Create Task</button>
                </form>
            </div>
        </div>
        
        <!-- Decisions Tab -->
        <div id="decisions" class="tab-content">
            <div class="card">
                <h3>➕ Decisions</h3>
                <div id="decision-message" class="message"></div>
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
                                <option value="Arushi">Arushi (Architect & Interior Design)</option>
                                <option value="Vishal">Vishal (General Contractor)</option>
                                <option value="Sabharwal">Sabharwal (Wood Work)</option>
                                <option value="Pradeep">Pradeep (HVAC & Electrical)</option>
                                <option value="Sunil">Sunil (Kitchen Equipment)</option>
                                <option value="Sandeep">Sandeep (Electrical & Safety)</option>
                                <option value="Team">Team (Multiple)</option>
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
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Due Date *</label>
                            <input type="date" class="form-input" name="dueDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-select" name="status">
                                <option value="Pending" selected>Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Decided">Decided</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" name="description" placeholder="Details about the decision needed, options to consider, impact on project..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn">➕ Create Decision</button>
                </form>
            </div>
        </div>
        
        <!-- Detail Views (hidden by default) -->
        <div id="task-details" style="display: none;">
            <div class="card">
                <button style="float: right; background: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-bottom: 16px;" onclick="hideDetails()">✕ Close</button>
                <h4 style="margin-bottom: 16px;">All Tasks (${total})</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">Task</th>
                            <th style="width: 15%;">Owner</th>
                            <th style="width: 12%;">Due Date</th>
                            <th style="width: 11%;">Status</th>
                            <th style="width: 8%;">Contact</th>
                            <th style="width: 4%;">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${TASKS_DATA.map(task => `
                            <tr>
                                <td class="word-wrap" style="width: 50%; max-width: 400px;">${task.title}</td>
                                <td style="width: 15%;">${task.owner}</td>
                                <td style="width: 12%;">${new Date(task.dueDate).toLocaleDateString()}</td>
                                <td class="status-${task.status.toLowerCase().replace(/\s+/g, '-')}" style="width: 11%;">${task.status}</td>
                                <td style="width: 8%; white-space: nowrap;">
                                    <a href="tel:${getOwnerPhone(task.owner)}" style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px; margin-right: 2px;">📞</a>
                                    <a href="sms:${getOwnerPhone(task.owner)}&body=${encodeURIComponent(`Task: ${task.title}\nDue: ${task.dueDate}\nStatus: ${task.status}`)}" style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">💬</a>
                                </td>
                                <td style="width: 4%;"><button class="btn btn-delete" onclick="deleteTask(${task.id})">×</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div id="decision-details" style="display: none;">
            <div class="card">
                <button style="float: right; background: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-bottom: 16px;" onclick="hideDetails()">✕ Close</button>
                <h4 style="margin-bottom: 16px;">All Decisions (${DECISIONS_DATA.length})</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">Decision</th>
                            <th style="width: 15%;">Assigned To</th>
                            <th style="width: 12%;">Due Date</th>
                            <th style="width: 11%;">Status</th>
                            <th style="width: 8%;">Contact</th>
                            <th style="width: 4%;">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${DECISIONS_DATA.map(decision => `
                            <tr>
                                <td class="word-wrap" style="width: 50%; max-width: 400px;">
                                    <strong>${decision.title}</strong><br>
                                    <small style="color: #6c757d;">${decision.description}</small>
                                </td>
                                <td style="width: 15%;">${decision.assignedTo}</td>
                                <td style="width: 12%;">${new Date(decision.dueDate).toLocaleDateString()}</td>
                                <td class="status-${decision.status.toLowerCase()}" style="width: 11%;">${decision.status}</td>
                                <td style="width: 8%; white-space: nowrap;">
                                    <a href="tel:${getDecisionContactPhone(decision.assignedTo)}" style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px; margin-right: 2px;">📞</a>
                                    <a href="sms:${getDecisionContactPhone(decision.assignedTo)}&body=${encodeURIComponent(`Decision: ${decision.title}\nDue: ${decision.dueDate}`)}" style="background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; text-decoration: none; font-size: 10px;">💬</a>
                                </td>
                                <td style="width: 4%;"><button class="btn btn-delete" onclick="deleteDecision(${decision.id})">×</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            
            // Hide details views when switching tabs
            hideDetails();
        }

        function toggleDetails(type) {
            hideDetails();
            
            if (type === 'all-tasks') {
                document.getElementById('task-details').style.display = 'block';
            } else if (type === 'decisions') {
                document.getElementById('decision-details').style.display = 'block';
            }
            // Add other detail views as needed
        }

        function hideDetails() {
            document.getElementById('task-details').style.display = 'none';
            document.getElementById('decision-details').style.display = 'none';
        }

        // Phone number mapping functions
        function getOwnerPhone(owner) {
            const phoneMap = {
                'Pradeep': '+919810312309',
                'Vishal': '+919868226580',
                'Sunil': '+919310203344',
                'Arushi': '+919810165187',
                'Sandeep': '+919540475132',
                'Sabharwal': '+919810086477',
                'Team': '+919810312309',
                'Bhargav': '+919810312309'
            };
            return phoneMap[owner] || '+919810312309';
        }
        
        function getDecisionContactPhone(assignedTo) {
            const phoneMap = {
                'Pradeep': '+919810312309',
                'Vishal': '+919868226580',
                'Sunil': '+919310203344',
                'Arushi': '+919810165187',
                'Sandeep': '+919540475132',
                'Sabharwal': '+919810086477',
                'Team': '+919810312309',
                'Bhargav': '+919810312309'
            };
            return phoneMap[assignedTo] || '+919810312309';
        }
        
        function contactOwner(owner, title) {
            alert('Contact ' + owner + ' about: ' + title);
        }

        async function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    const response = await fetch('/api/tasks/' + id, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('✅ Task deleted successfully! Page will refresh.');
                        location.reload();
                    } else {
                        alert('❌ Error: ' + result.message);
                    }
                } catch (error) {
                    alert('❌ Error deleting task: ' + error.message);
                }
            }
        }

        async function deleteDecision(id) {
            if (confirm('Are you sure you want to delete this decision?')) {
                try {
                    const response = await fetch('/api/decisions/' + id, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('✅ Decision deleted successfully! Page will refresh.');
                        location.reload();
                    } else {
                        alert('❌ Error: ' + result.message);
                    }
                } catch (error) {
                    alert('❌ Error deleting decision: ' + error.message);
                }
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
                
                const result = await response.json();
                const messageEl = document.getElementById('task-message');
                
                if (result.success) {
                    messageEl.className = 'message success';
                    messageEl.textContent = '✅ Task added successfully! Page will refresh in 3 seconds...';
                    messageEl.style.display = 'block';
                    messageEl.style.fontSize = '14px';
                    messageEl.style.fontWeight = 'bold';
                    e.target.reset();
                    
                    // Refresh page after 3 seconds
                    setTimeout(() => location.reload(), 3000);
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
                    messageEl.textContent = '✅ Decision added successfully! Page will refresh in 3 seconds...';
                    messageEl.style.display = 'block';
                    messageEl.style.fontSize = '14px';
                    messageEl.style.fontWeight = 'bold';
                    e.target.reset();
                    
                    // Refresh page after 3 seconds
                    setTimeout(() => location.reload(), 3000);
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
    </script>
</body>
</html>`;

    return res.setHeader('Content-Type', 'text/html').send(html);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};