// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// (Optional) simple health route for Render and debugging
app.get('/', (req, res) => res.send('Task Tracker API is running'));

// --- Your existing route mounts (keep these if you already have them) ---
const tasksRouter = require('./src/routes/tasks');
const insightsRouter = require('./src/routes/insights'); // or service import used earlier

app.use('/tasks', tasksRouter);
// If you have /insights route module, use it; if you use a service, keep your existing endpoint:
app.get('/insights', (req, res) => {
  const getInsights = require('./src/services/insights');
  try {
    const data = getInsights();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Insights error' });
  }
});
// ---------------------------------------------------------

// Use Render/Heroku style port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
