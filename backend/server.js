// backend/server.js
const express = require("express");
const cors = require("cors");
const tasksRouter = require("./src/routes/tasks");
const insightsRouter = require("./src/routes/insights");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/tasks", tasksRouter);
app.use("/insights", insightsRouter);

// test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// If running locally, start the server.
// If on Vercel, just export app.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`✅ Backend running on http://localhost:${PORT}`)
  );
} else {
  module.exports = app;
}
