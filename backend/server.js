// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

const tasksRouter = require('./src/routes/tasks');
const insightsRouter = require('./src/routes/insights');

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/insights', insightsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
