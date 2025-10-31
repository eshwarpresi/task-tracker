const db = require('../db/connect');

function getInsights() {
  const total = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
  const open = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status='Open'").get().count;
  const high = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE priority='High'").get().count;
  const dueSoon = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE julianday(due_date) - julianday('now') <= 3").get().count;

  let summary = `You have ${total} total tasks. ${open} are still open.`;
  if (high > 0) summary += ` High priority tasks: ${high}.`;
  if (dueSoon > 0) summary += ` ${dueSoon} tasks are due soon.`;
  if (open === 0) summary += ` Great job! All tasks completed.`;

  return { total, open, high, dueSoon, summary };
}

module.exports = getInsights;
