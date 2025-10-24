// Complete embedded data for serverless function
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

  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/api/tasks') {
      return res.json(TASKS_DATA);
    }
    
    if (url.pathname === '/api/decisions') {
      return res.json(DECISIONS_DATA);
    }

    // Serve main HTML page
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏗️ POOJA'S BUILD MANAGEMENT</title>
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
        }
        
        .tab-pane {
            display: none;
        }
        
        .tab-pane.active {
            display: block;
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
        
        /* Optimized column widths */
        th:nth-child(1), td:nth-child(1) { width: 45%; font-size: 12px; } /* Decision */
        th:nth-child(2), td:nth-child(2) { width: 12%; font-size: 11px; } /* Assigned To */
        th:nth-child(3), td:nth-child(3) { width: 9%; font-size: 11px; } /* Priority */
        th:nth-child(4), td:nth-child(4) { width: 11%; font-size: 11px; } /* Due Date */
        th:nth-child(5), td:nth-child(5) { width: 9%; font-size: 11px; } /* Status */
        th:nth-child(6), td:nth-child(6) { width: 8%; font-size: 11px; } /* Contact */
        th:nth-child(7), td:nth-child(7) { width: 6%; font-size: 11px; } /* Delete */
        
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
            gap: 4px;
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
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .word-wrap {
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            max-width: 100%;
            line-height: 1.4;
        }
        
        @media (max-width: 768px) {
            body { padding: 10px; }
            .header h1 { font-size: 1.8rem; }
            .nav-tab { padding: 15px 10px; font-size: 14px; }
            .tab-content { padding: 20px 15px; }
            th, td { padding: 8px 6px; font-size: 12px; }
            .stats { grid-template-columns: repeat(2, 1fr); gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ POOJA'S BUILD MANAGEMENT</h1>
            <div class="subtitle">📱💻 Restaurant Construction & Decision Tracking Dashboard</div>
        </div>
        
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('tasks')">📋 All Tasks</button>
            <button class="nav-tab" onclick="showTab('decisions')">⚖️ All Decisions</button>
        </div>
        
        <div class="tab-content">
            <div id="tasks" class="tab-pane active">
                <div class="stats" id="taskStats"></div>
                <div class="loading" id="tasksLoading">Loading tasks...</div>
                <table id="tasksTable" style="display: none;">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Owner</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody id="tasksBody"></tbody>
                </table>
            </div>
            
            <div id="decisions" class="tab-pane">
                <div class="stats" id="decisionStats"></div>
                <div class="loading" id="decisionsLoading">Loading decisions...</div>
                <table id="decisionsTable" style="display: none;">
                    <thead>
                        <tr>
                            <th>Decision</th>
                            <th>Assigned To</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody id="decisionsBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        let tasks = [];
        let decisions = [];

        function showTab(tabName) {
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        async function loadTasks() {
            try {
                const response = await fetch('/api/tasks');
                tasks = await response.json();
                
                document.getElementById('tasksLoading').style.display = 'none';
                document.getElementById('tasksTable').style.display = 'table';
                
                renderTasks();
                renderTaskStats();
            } catch (error) {
                console.error('Error loading tasks:', error);
                document.getElementById('tasksLoading').textContent = 'Error loading tasks';
            }
        }

        async function loadDecisions() {
            try {
                const response = await fetch('/api/decisions');
                decisions = await response.json();
                
                document.getElementById('decisionsLoading').style.display = 'none';
                document.getElementById('decisionsTable').style.display = 'table';
                
                renderDecisions();
                renderDecisionStats();
            } catch (error) {
                console.error('Error loading decisions:', error);
                document.getElementById('decisionsLoading').textContent = 'Error loading decisions';
            }
        }

        function renderTasks() {
            const tbody = document.getElementById('tasksBody');
            tbody.innerHTML = tasks.map(task => \`
                <tr>
                    <td class="word-wrap">\${task.title}</td>
                    <td>\${task.owner}</td>
                    <td class="priority-\${task.priority.toLowerCase()}">\${task.priority}</td>
                    <td>\${new Date(task.dueDate).toLocaleDateString()}</td>
                    <td class="status-\${task.status.toLowerCase().replace(/\\s+/g, '-')}">\${task.status}</td>
                    <td><a href="#" class="btn btn-contact" onclick="contactOwner('\${task.owner}', '\${task.title}')">📞</a></td>
                    <td><button class="btn btn-delete" onclick="deleteTask(\${task.id})">×</button></td>
                </tr>
            \`).join('');
        }

        function renderDecisions() {
            const tbody = document.getElementById('decisionsBody');
            tbody.innerHTML = decisions.map(decision => \`
                <tr>
                    <td class="word-wrap">
                        <strong>\${decision.title}</strong><br>
                        <small style="color: #6c757d;">\${decision.description}</small>
                    </td>
                    <td>\${decision.assignedTo}</td>
                    <td class="priority-\${decision.priority.toLowerCase()}">\${decision.priority}</td>
                    <td>\${new Date(decision.dueDate).toLocaleDateString()}</td>
                    <td class="status-\${decision.status.toLowerCase()}">\${decision.status}</td>
                    <td><a href="#" class="btn btn-contact" onclick="contactOwner('\${decision.assignedTo}', '\${decision.title}')">📞</a></td>
                    <td><button class="btn btn-delete" onclick="deleteDecision(\${decision.id})">×</button></td>
                </tr>
            \`).join('');
        }

        function renderTaskStats() {
            const stats = {
                total: tasks.length,
                completed: tasks.filter(t => t.status === 'Completed').length,
                inProgress: tasks.filter(t => t.status === 'In Progress').length,
                critical: tasks.filter(t => t.priority === 'Critical').length
            };

            document.getElementById('taskStats').innerHTML = \`
                <div class="stat-card">
                    <div class="stat-number">\${stats.total}</div>
                    <div class="stat-label">Total Tasks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.completed}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.inProgress}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.critical}</div>
                    <div class="stat-label">Critical Priority</div>
                </div>
            \`;
        }

        function renderDecisionStats() {
            const stats = {
                total: decisions.length,
                pending: decisions.filter(d => d.status === 'Pending').length,
                high: decisions.filter(d => d.priority === 'High').length,
                overdue: decisions.filter(d => new Date(d.dueDate) < new Date()).length
            };

            document.getElementById('decisionStats').innerHTML = \`
                <div class="stat-card">
                    <div class="stat-number">\${stats.total}</div>
                    <div class="stat-label">Total Decisions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.pending}</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.high}</div>
                    <div class="stat-label">High Priority</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">\${stats.overdue}</div>
                    <div class="stat-label">Overdue</div>
                </div>
            \`;
        }

        function contactOwner(owner, title) {
            alert(\`Contact \${owner} about: \${title}\`);
        }

        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
                renderTaskStats();
            }
        }

        function deleteDecision(id) {
            if (confirm('Are you sure you want to delete this decision?')) {
                decisions = decisions.filter(d => d.id !== id);
                renderDecisions();
                renderDecisionStats();
            }
        }

        // Load data on page load
        loadTasks();
        loadDecisions();
    </script>
</body>
</html>`;

    return res.setHeader('Content-Type', 'text/html').send(html);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};