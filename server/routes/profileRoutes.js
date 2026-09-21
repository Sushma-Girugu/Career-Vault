const express = require("express");
const Profile = require("../models/Profile");

console.log("PROFILE ROUTES FILE LOADED");

const router = express.Router();

// ===============================
// SAVE OR UPDATE PROFILE
// ===============================
router.post("/", async (req, res) => {
  try {
    const { name, email, college, branch, year } = req.body;

    const savedProfile = await Profile.findOneAndUpdate(
      { email: email },
      {
        name,
        email,
        college,
        branch,
        year
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      profile: savedProfile
    });
  } catch (error) {
    console.error("Profile save error:", error.message);

    res.status(500).json({
      message: "Failed to save profile",
      error: error.message
    });
  }
});

// ===============================
// GET ALL PROFILES
// ===============================
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();

    res.status(200).json(profiles);
  } catch (error) {
    console.error("Profile fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch profiles",
      error: error.message
    });
  }
});

// ===============================
// DELETE PROFILE BY ID
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE PROFILE REQUEST RECEIVED");
    console.log("Profile ID:", req.params.id);

    const deletedProfile = await Profile.findByIdAndDelete(
      req.params.id
    );

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