// backend/src/routes/insights.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '../db/data.json');

function readData() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data || '[]');
}

router.get('/', (req, res) => {
  try {
    const tasks = readData();
    const total = tasks.length;
    const open = tasks.filter(t => t.status === 'Open').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    
    // Priority counts
    const priorityMap = {};
    tasks.forEach(task => {
      priorityMap[task.priority] = (priorityMap[task.priority] || 0) + 1;
    });
    
    // Tasks due in next 3 days
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    const dueSoon = tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate <= threeDaysLater;
    }).length;
    
    // Busiest day
    const dateCounts = {};
    tasks.forEach(task => {
      dateCounts[task.due_date] = (dateCounts[task.due_date] || 0) + 1;
    });
    
    let busiestDay = null;
    Object.entries(dateCounts).forEach(([date, count]) => {
      if (!busiestDay || count > busiestDay.count) {
        busiestDay = { date, count };
      }
    });
    
    // Determine dominant priority
    let dominantPriority = null;
    if (Object.keys(priorityMap).length) {
      dominantPriority = Object.entries(priorityMap)
        .sort((a, b) => b[1] - a[1])[0][0];
    }
    
    // Build readable summary
    let summary = `You have ${total} task${total === 1 ? '' : 's'}. `;
    if (open) summary += `${open} open. `;
    if (completed) summary += `${completed} completed. `;
    if (dominantPriority) summary += `Most tasks are ${dominantPriority} priority. `;
    if (dueSoon) summary += `${dueSoon} due within 3 days. `;
    if (busiestDay) summary += `Busiest day: ${busiestDay.date} (${busiestDay.count}).`;
    
    res.json({
      total,
      open,
      completed,
      priority: priorityMap,
      dueSoon,
      busiestDay,
      summary: summary.trim() || "No tasks yet. Add your first task!"
    });
    
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ 
      summary: "Error loading insights",
      error: error.message 
    });
  }
});

module.exports = router;