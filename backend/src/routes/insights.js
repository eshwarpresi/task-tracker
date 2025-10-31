// backend/src/routes/insights.js
const express = require('express');
const router = express.Router();
const db = require('../db/connect');

router.get('/', (req, res) => {
  const totalRow = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  const total = totalRow.count || 0;

  const openRow = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'Open'`).get();
  const open = openRow.count || 0;

  const completedRow = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status = 'Completed'`).get();
  const completed = completedRow.count || 0;

  const priorityCounts = db.prepare('SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority').all();
  const priorityMap = {};
  priorityCounts.forEach(r => { priorityMap[r.priority] = r.count; });

  // tasks due in next 3 days (including today)
  const dueSoonRow = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE julianday(due_date) - julianday('now') <= 3 AND julianday(due_date) - julianday('now') >= 0").get();
  const dueSoon = dueSoonRow.count || 0;

  // busiest day (count by due_date)
  const busiest = db.prepare('SELECT due_date, COUNT(*) as cnt FROM tasks GROUP BY due_date ORDER BY cnt DESC LIMIT 1').get();
  const busiestDay = busiest ? { date: busiest.due_date, count: busiest.cnt } : null;

  // Determine dominant priority
  let dominantPriority = null;
  if (priorityCounts.length) {
    priorityCounts.sort((a,b) => b.count - a.count);
    dominantPriority = priorityCounts[0].priority;
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
    summary: summary.trim()
  });
});

module.exports = router;
