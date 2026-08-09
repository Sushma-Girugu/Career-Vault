const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Profile = require("./models/Profile");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("CareerVault Backend is Running!");
});

// TEST API ROUTE
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working"
    });
});

// Save profile
app.post("/api/profile", async (req, res) => {
    try {
        const profile = new Profile(req.body);

        const savedProfile = await profile.save();

        res.status(201).json(savedProfile);
    } catch (error) {
        console.log("Save Error:", error.message);

        res.status(500).json({
            message: "Failed to save profile",
            error: error.message
        });
    }
});

// Get profiles
app.get("/api/profile", async (req, res) => {
    try {
        const profiles = await Profile.find();

        res.status(200).json(profiles);
    } catch (error) {
        console.log("Fetch Error:", error.message);

        res.status(500).json({
            message: "Failed to fetch profiles",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CareerVault server running on port ${PORT}`);
    console.log(`Profile API: http://localhost:${PORT}/api/profile`);
});