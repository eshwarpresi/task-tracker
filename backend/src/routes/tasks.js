// backend/src/routes/tasks.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '../db/data.json');

// Helper functions
function readData() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data || '[]');
}

function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ➕ Add new task
router.post('/', (req, res) => {
  const { title, description, priority, due_date } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required' });
  }

  const tasks = readData();
  const newTask = {
    id: Date.now(),
    title,
    description: description || '',
    priority: priority || 'Medium',
    due_date,
    status: 'Open',
  };
  tasks.push(newTask);
  writeData(tasks);
  res.json({ message: 'Task added', task: newTask });
});

// 📋 Get all tasks with filters and sort
router.get('/', (req, res) => {
  const { status, priority, sort } = req.query;
  let tasks = readData();

  if (status) tasks = tasks.filter(t => t.status === status);
  if (priority) tasks = tasks.filter(t => t.priority === priority);

  if (sort === 'priority') {
    const order = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  } else {
    tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  }

  res.json(tasks);
});

// ✏️ Update status or priority
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;

  const tasks = readData();
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (status) {
    const valid = ['Open', 'In Progress', 'Completed'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    task.status = status;
  }

  if (priority) {
    const validP = ['Low', 'Medium', 'High'];
    if (!validP.includes(priority)) return res.status(400).json({ error: 'Invalid priority' });
    task.priority = priority;
  }

  writeData(tasks);
  res.json({ message: 'Task updated', task });
});

// ✅ Mark as completed
router.patch('/:id/complete', (req, res) => {
  const { id } = req.params;
  const tasks = readData();
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.status = 'Completed';
  writeData(tasks);
  res.json({ message: 'Task marked as completed' });
});

// 🗑️ Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readData();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id != id);
  if (tasks.length === initialLength) return res.status(404).json({ error: 'Task not found' });
  writeData(tasks);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
