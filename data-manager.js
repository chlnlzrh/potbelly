const fs = require('fs');
const path = require('path');

const DATA_FILE = './project-data.json';

// Initialize data file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      tasks: [],
      decisions: [],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read current data
function readData() {
  initializeDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { tasks: [], decisions: [], lastUpdated: new Date().toISOString() };
  }
}

// Write data to file
function writeData(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Add new task
function addTask(taskData) {
  const data = readData();
  const newTask = {
    id: Date.now(), // Simple ID generation
    title: taskData.title,
    owner: taskData.owner,
    dueDate: taskData.dueDate,
    priority: taskData.priority || 'Medium',
    status: taskData.status || 'Not Started',
    category: taskData.category || 'general',
    progress: taskData.progress || 0,
    notes: taskData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'user_added'
  };
  
  data.tasks.push(newTask);
  
  if (writeData(data)) {
    console.log(`Added new task: ${newTask.title}`);
    return newTask;
  }
  return null;
}

// Update task
function updateTask(taskId, updates) {
  const data = readData();
  const taskIndex = data.tasks.findIndex(task => task.id == taskId);
  
  if (taskIndex !== -1) {
    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    if (writeData(data)) {
      console.log(`Updated task ${taskId}: ${data.tasks[taskIndex].title}`);
      return data.tasks[taskIndex];
    }
  }
  return null;
}

// Add decision
function addDecision(decisionData) {
  const data = readData();
  const newDecision = {
    id: Date.now(),
    title: decisionData.title,
    description: decisionData.description,
    priority: decisionData.priority || 'Medium',
    status: decisionData.status || 'Pending',
    assignedTo: decisionData.assignedTo || 'Arushi',
    dueDate: decisionData.dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.decisions.push(newDecision);
  
  if (writeData(data)) {
    console.log(`Added new decision: ${newDecision.title}`);
    return newDecision;
  }
  return null;
}

// Update decision
function updateDecision(decisionId, updates) {
  const data = readData();
  const decisionIndex = data.decisions.findIndex(decision => decision.id == decisionId);
  
  if (decisionIndex !== -1) {
    data.decisions[decisionIndex] = {
      ...data.decisions[decisionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    if (writeData(data)) {
      console.log(`Updated decision ${decisionId}: ${data.decisions[decisionIndex].title}`);
      return data.decisions[decisionIndex];
    }
  }
  return null;
}

// Get all data
function getAllData() {
  return readData();
}

module.exports = {
  addTask,
  updateTask,
  addDecision,
  updateDecision,
  getAllData,
  readData,
  writeData
};