// backend/src/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../db/connect');

// Add new task
router.post('/', (req, res) => {
  const { title, description, priority, due_date } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title, description || '', priority || 'Medium', due_date, 'Open');
  res.json({ id: info.lastInsertRowid, message: 'Task added' });
});

// Get all tasks with filters and sort
// supports: ?status=Open&priority=High&sort=due_date|priority
router.get('/', (req, res) => {
  const { status, priority, sort } = req.query;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (priority) { query += ' AND priority = ?'; params.push(priority); }

  // Basic sorting options (by due_date default)
  if (sort === 'priority') {
    query += ' ORDER BY CASE priority WHEN "High" THEN 1 WHEN "Medium" THEN 2 WHEN "Low" THEN 3 END ASC, due_date ASC';
  } else {
    query += ' ORDER BY due_date ASC';
  }

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

// Update status or priority (generic)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;
  const updates = [];
  const values = [];

  if (status) {
    const valid = ['Open', 'In Progress', 'Completed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    updates.push('status = ?');
    values.push(status);
  }

  if (priority) {
    const validP = ['Low', 'Medium', 'High'];
    if (!validP.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }
    updates.push('priority = ?');
    values.push(priority);
  }

  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });

  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  db.prepare(sql).run(...values);
  res.json({ message: 'Task updated' });
});

// Mark task as completed (helper route)
router.patch('/:id/complete', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('Completed', id);
  res.json({ message: 'Task marked as completed' });
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
