// backend/src/db/connect.js
const Database = require('better-sqlite3');
const db = new Database('task_tracker.db');

// Create tasks table (allow Completed status and default to Open)
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low','Medium','High')) NOT NULL DEFAULT 'Medium',
    due_date TEXT NOT NULL,
    status TEXT CHECK(status IN ('Open','In Progress','Completed')) NOT NULL DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
