const express = require("express");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET LOGGED-IN USER PROFILE
// GET /api/profile
// ========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user.userId
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json(profile);

  } catch (error) {
    console.error("Profile fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
});


// ========================================
// CREATE OR UPDATE LOGGED-IN USER PROFILE
// POST /api/profile
// ========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      branch,
      year,
      location,
      bio,
      linkedin,
      github,
      portfolio
    } = req.body;

    // Required fields
    if (!name || !email || !college || !branch || !year) {
      return res.status(400).json({
        message: "Name, email, college, branch and year are required"
      });
    }

    const profile = await Profile.findOneAndUpdate(
      {
        userId: req.user.userId
      },
      {
        userId: req.user.userId,
        name,
        email,
        phone,
        college,
        branch,
        year,
        location,
        bio,
        linkedin,
        github,
        portfolio
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      profile
    });

  } catch (error) {
    console.error("Profile save error:", error.message);

    res.status(500).json({
      message: "Failed to save profile",
      error: error.message
    });
  }
});


// ========================================
// DELETE LOGGED-IN USER PROFILE
// DELETE /api/profile
// ========================================
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const deletedProfile = await Profile.findOneAndDelete({
      userId: req.user.userId
    });

    if (!deletedProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile deleted successfully",
      profile: deletedProfile
    });

  } catch (error) {
    console.error("Profile delete error:", error.message);

    res.status(500).json({
      message: "Failed to delete profile",
      error: error.message
    });
  }
});


module.exports = router;