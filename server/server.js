const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("./config/db");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Models
const Skill = require("./models/Skill");

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const documentRoutes = require("./routes/documentRoutes");

dotenv.config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// REQUEST LOGGER
// ==========================================

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// ==========================================
// BASIC TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.status(200).send("CareerVault Backend is Running");
});

app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working",
  });
});

// ==========================================
// SERVE UPLOADED DOCUMENTS
// ==========================================

app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "uploads",
    req.params.filename
  );

  console.log("Trying to send file:");
  console.log(filePath);

  res.sendFile(filePath, (error) => {
    if (error) {
      console.error("File send error:", error);

      if (!res.headersSent) {
        res.status(404).json({
          message: "File not found",
          path: filePath,
        });
      }
    }
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Skills
app.use("/api/skills", skillRoutes);

// Projects
app.use("/api/projects", projectRoutes);

// Job Applications
app.use("/api/job-applications", jobApplicationRoutes);

// Documents
app.use("/api/documents", documentRoutes);

// Resume
app.use("/api/resumes", resumeRoutes);

// ==========================================
// PROTECTED TEST ROUTE
// ==========================================

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    user: req.user,
  });
});

// ==========================================
// JOB APPLICATION TEST ROUTE
// ==========================================

app.get("/api/job-test", (req, res) => {
  console.log("JOB TEST ROUTE HIT");

  res.json({
    message: "Job application route connection is working",
  });
});

// ==========================================
// RESUME TEST ROUTE
// ==========================================

app.get("/api/resumes-test", (req, res) => {
  res.status(200).send("SERVER RESUME TEST WORKING");
});

// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // ==========================================
    // TEST SKILL MODEL
    // ==========================================

    console.log("Testing Skill model connection...");

    console.log(
      "Mongoose readyState:",
      mongoose.connection.readyState
    );

    console.log(
      "Skill model readyState:",
      Skill.db.readyState
    );

    const testSkills = await Skill.find().limit(1);

    console.log(
      "Skill model test successful. Documents found:",
      testSkills.length
    );

    // ==========================================
    // START EXPRESS SERVER
    // ==========================================

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("CareerVault server running");
      console.log(`Port: ${PORT}`);
      console.log("=================================");

      console.log(
        `Auth API: http://localhost:${PORT}/api/auth`
      );

      console.log(
        `Profile API: http://localhost:${PORT}/api/profile`
      );

      console.log(
        `Skills API: http://localhost:${PORT}/api/skills`
      );

      console.log(
        `Projects API: http://localhost:${PORT}/api/projects`
      );

      console.log(
        `Job Applications API: http://localhost:${PORT}/api/job-applications`
      );

      console.log(
        `Documents API: http://localhost:${PORT}/api/documents`
      );

      console.log(
        `Resume API: http://localhost:${PORT}/api/resumes`
      );

      console.log(
        `Resume Test: http://localhost:${PORT}/api/resumes-test`
      );

      console.log(
        `Uploads: http://localhost:${PORT}/uploads`
      );

      console.log(
        `Protected API: http://localhost:${PORT}/api/protected`
      );
    });
  } catch (error) {
    console.log("Server startup failed");
    console.log(error.message);

    process.exit(1);
  }
};

// ==========================================
// RUN SERVER
// ==========================================

startServer();