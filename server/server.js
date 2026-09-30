require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const questionRoutes = require("./routes/questionRoutes");

const analyticsRoutes = require("./routes/analytics");
const notificationRoutes = require("./routes/notifications");

const projectRoutes = require("./routes/projectRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const socialLinkRoutes = require("./routes/socialLinkRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// =====================================================
// MODELS
// =====================================================

const Skill = require("./models/Skill");

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {
    console.log(
        "REQUEST:",
        req.method,
        req.originalUrl
    );

    next();
});

// =====================================================
// API ROUTES
// =====================================================

// -----------------------------------------------------
// Authentication
// -----------------------------------------------------

app.use(
    "/api/auth",
    authRoutes
);

// -----------------------------------------------------
// Profile
// -----------------------------------------------------

app.use(
    "/api/profile",
    profileRoutes
);

// -----------------------------------------------------
// Skills
// -----------------------------------------------------

app.use(
    "/api/skills",
    skillRoutes
);

// -----------------------------------------------------
// Gemini AI
// -----------------------------------------------------

app.use(
    "/api/gemini",
    geminiRoutes
);

// -----------------------------------------------------
// Job Applications
// -----------------------------------------------------

app.use(
    "/api/job-applications",
    jobApplicationRoutes
);

// -----------------------------------------------------
// Questions
// -----------------------------------------------------

app.use(
    "/api/questions",
    questionRoutes
);

// -----------------------------------------------------
// Projects
// -----------------------------------------------------

app.use(
    "/api/projects",
    projectRoutes
);

// -----------------------------------------------------
// Achievements
// -----------------------------------------------------

app.use(
    "/api/achievements",
    achievementRoutes
);

// -----------------------------------------------------
// Social Links
// -----------------------------------------------------

app.use(
    "/api/social-links",
    socialLinkRoutes
);

// =====================================================
// RESUME ROUTES
// =====================================================

app.use(
    "/api/resumes",
    (req, res, next) => {

        console.log(
            "### RESUME MOUNT HIT ###",
            req.method,
            req.originalUrl
        );

        next();
    },
    resumeRoutes
);

// -----------------------------------------------------
// Analytics
// -----------------------------------------------------

app.use(
    "/api/analytics",
    analyticsRoutes
);

// -----------------------------------------------------
// Notifications
// -----------------------------------------------------

app.use(
    "/api/notifications",
    notificationRoutes
);

// =====================================================
// JOB APPLICATION TEST ROUTE
// =====================================================

app.get(
    "/api/job-test",
    (req, res) => {

        console.log(
            "JOB TEST ROUTE HIT"
        );

        res.json({
            message:
                "Job application route connection is working"
        });
    }
);

// =====================================================
// BASIC TEST ROUTES
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.send(
            "CareerVault Backend is Running"
        );
    }
);

app.get(
    "/api/test",
    (req, res) => {

        res.json({
            message:
                "API is working"
        });
    }
);

// =====================================================
// PORT
// =====================================================

const PORT =
    process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {

    try {

        // -------------------------------------------------
        // Connect MongoDB
        // -------------------------------------------------

        await connectDB();

        // -------------------------------------------------
        // Test Skill Model
        // -------------------------------------------------

        console.log(
            "Testing Skill model connection..."
        );

        console.log(
            "Mongoose readyState:",
            mongoose.connection.readyState
        );

        console.log(
            "Skill model readyState:",
            Skill.db.readyState
        );

        const testSkills =
            await Skill.find().limit(1);

        console.log(
            "Skill model test successful. Documents found:",
            testSkills.length
        );

        // -------------------------------------------------
        // Start Server
        // -------------------------------------------------

        app.listen(
            PORT,
            () => {

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
                    `Projects API: http://localhost:${PORT}/api/projects`
                );

                console.log(
                    `Job Applications API: http://localhost:${PORT}/api/job-applications`
                );

                console.log(
                    `Questions API: http://localhost:${PORT}/api/questions`
                );

                console.log(
                    `Achievements API: http://localhost:${PORT}/api/achievements`
                );

                console.log(
                    `Social Links API: http://localhost:${PORT}/api/social-links`
                );

                console.log(
                    `Resume API: http://localhost:${PORT}/api/resumes`
                );

                console.log(
                    `Analytics API: http://localhost:${PORT}/api/analytics`
                );

                console.log(
                    `Notifications API: http://localhost:${PORT}/api/notifications`
                );

                console.log(
                    `Job Test API: http://localhost:${PORT}/api/job-test`
                );

                console.log(
                    `Auth API: http://localhost:${PORT}/api/auth`
                );

                console.log(
                    `Gemini API: http://localhost:${PORT}/api/gemini`
                );

                console.log(
                    `Protected API: http://localhost:${PORT}/api/protected`
                );
            }
        );

    } catch (error) {

        console.log(
            "Server startup failed"
        );

        console.log(
            error.message
        );

        process.exit(1);
    }
};

// =====================================================
// RUN SERVER
// =====================================================

startServer();