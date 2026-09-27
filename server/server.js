const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const questionRoutes = require("./routes/questionRoutes");const projectRoutes = require("./routes/projectRoutes");

// Models
const Skill = require("./models/Skill");

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
// API ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Skills
app.use("/api/skills", skillRoutes);

// Job Applications
app.use(
  "/api/job-applications",
  jobApplicationRoutes
);
app.use("/api/questions", questionRoutes);

app.use("/api/projects", projectRoutes);


// ==========================================
// JOB APPLICATION TEST ROUTE
// ==========================================

app.get("/api/job-test", (req, res) => {
    console.log("JOB TEST ROUTE HIT");

    res.json({
        message: "Job application route connection is working"
    });
});

// ==========================================
// BASIC TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.send("CareerVault Backend is Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working"
    });
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
        // Connect to MongoDB
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
            console.log(
                `CareerVault server running on port ${PORT}`
            );

            console.log(
                `Profile API: http://localhost:${PORT}/api/profile`
            );

            console.log(
                `Skills API: http://localhost:${PORT}/api/skills`
            );

            console.log(
                `Job Applications API: http://localhost:${PORT}/api/job-applications`
            );

            console.log(
                `Projects API: http://localhost:${PORT}/api/projects`
            );

            console.log(
                `Job Test API: http://localhost:${PORT}/api/job-test`
            );

            console.log(
                `Protected API: http://localhost:${PORT}/api/protected`
            );

            console.log(
                `Auth API: http://localhost:${PORT}/api/auth`
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