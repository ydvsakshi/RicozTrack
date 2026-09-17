const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const riskRoutes = require("./routes/riskRoutes");
const dependencyRoutes = require("./routes/dependencyRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "API route is working!",
  });
});

// Temporary Task Test API
app.get("/api/tasks-test", (req, res) => {
  res.json({
    message: "Task route area is working!",
  });
});

// Projects API
app.use("/api/projects", projectRoutes);

// Tasks API
app.use("/api/tasks", taskRoutes);

// Resources API
app.use("/api/resources", resourceRoutes);

app.use("/api/risks", riskRoutes);
app.use("/api/dependencies", dependencyRoutes);
app.use("/api/users", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "RicozTrack Backend is running successfully!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RicozTrack Backend running on http://localhost:${PORT}`);
});