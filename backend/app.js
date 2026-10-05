const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Root API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Course Management API"
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running"
  });
});

// Database test
app.get("/api/db-test", async (req, res) => {
  try {
    const [result] = await db.pool.query("SELECT 1 AS connected");

    res.status(200).json({
      success: true,
      database: "MySQL",
      connected: result[0].connected === 1,
      message: "MySQL database connected successfully"
    });
  } catch (error) {
    console.error("Database Error:", error);

    res.status(500).json({
      success: false,
      database: "MySQL",
      connected: false,
      message: "MySQL database connection failed",
      error: error.message
    });
  }
});

// Table test
app.get("/api/db-tables", async (req, res) => {
  try {
    const [tables] = await db.pool.query("SHOW TABLES");

    res.status(200).json({
      success: true,
      database: process.env.DB_NAME,
      tableCount: tables.length,
      tables
    });
  } catch (error) {
    console.error("Table Error:", error);

    res.status(500).json({
      success: false,
      message: "Could not retrieve database tables",
      error: error.message
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
