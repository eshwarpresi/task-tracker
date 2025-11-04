// backend/server.js - UPDATED
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Simple health check route
app.get('/', (req, res) => res.send('✅ Task Tracker API is running successfully!'));

// --- Route mounts with /api prefix ---
const tasksRouter = require('./src/routes/tasks');
app.use('/api/tasks', tasksRouter);

// Insights route with /api prefix
const insightsRouter = require('./src/routes/insights');
app.use('/api/insights', insightsRouter);  // ✅ Use the router

// --- Port binding for Render ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));