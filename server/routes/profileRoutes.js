const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// Save profile
router.post("/", async (req, res) => {
    try {
        const { name, email, college, branch, year } = req.body;

        const profile = new Profile({
            name,
            email,
            college,
            branch,
            year
        });

        const savedProfile = await profile.save();

        res.status(201).json({
            message: "Profile saved successfully",
            profile: savedProfile
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to save profile"
        });
    }
});

// Get profile
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find();

        res.json(profiles);

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            message: "Failed to fetch profiles"
        });
    }
});

module.exports = router;