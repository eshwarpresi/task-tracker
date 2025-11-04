// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/', (req, res) => res.send('✅ Task Tracker API is running successfully!'));

// --- Route mounts ---
const tasksRouter = require('./src/routes/tasks');
app.use('/tasks', tasksRouter);

// Insights route
app.get('/insights', (req, res) => {
  const getInsights = require('./src/services/insights');
  try {
    const data = getInsights();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Insights error' });
  }
});

// --- Port binding for Render ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
