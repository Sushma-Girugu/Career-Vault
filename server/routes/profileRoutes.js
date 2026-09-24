const express = require("express");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

console.log("PROFILE ROUTES FILE LOADED");

const router = express.Router();


// ======================================================
// GET MY PROFILE
// GET /api/profile
// ======================================================

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
      message: "Failed to fetch profile"
    });
  }
});


// ======================================================
// CREATE / UPDATE MY PROFILE
// POST /api/profile
// ======================================================

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
      github,
      linkedin,
      portfolio,
      profilePhoto
    } = req.body;


    // -------------------------------
    // BASIC VALIDATION
    // -------------------------------

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters"
      });
    }


    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }


    if (phone) {

      const phoneRegex =
        /^[6-9]\d{9}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit phone number"
        });
      }
    }


    if (bio && bio.length > 500) {
      return res.status(400).json({
        message: "Bio cannot exceed 500 characters"
      });
    }


    // -------------------------------
    // SAVE / UPDATE PROFILE
    // -------------------------------

    const profile = await Profile.findOneAndUpdate(

      {
        userId: req.user.userId
      },

      {
        userId: req.user.userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        college: college ? college.trim() : "",
        branch: branch ? branch.trim() : "",
        year: year ? year.trim() : "",
        location: location ? location.trim() : "",
        bio: bio ? bio.trim() : "",
        github: github ? github.trim() : "",
        linkedin: linkedin ? linkedin.trim() : "",
        portfolio: portfolio ? portfolio.trim() : "",
        profilePhoto: profilePhoto || ""
      },

      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );


    res.status(200).json({
      message: "Profile saved successfully",
      profile
    });

  } catch (error) {

    console.error(
      "Profile save error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save profile",
      error: error.message
    });
  }
});


// ======================================================
// UPDATE PROFILE
// PUT /api/profile
// ======================================================

router.put("/", authMiddleware, async (req, res) => {
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
      github,
      linkedin,
      portfolio,
      profilePhoto
    } = req.body;


    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters"
      });
    }


    const updatedProfile =
      await Profile.findOneAndUpdate(

        {
          userId: req.user.userId
        },

        {
          name: name.trim(),
          email: email?.trim().toLowerCase(),
          phone: phone?.trim() || "",
          college: college?.trim() || "",
          branch: branch?.trim() || "",
          year: year?.trim() || "",
          location: location?.trim() || "",
          bio: bio?.trim() || "",
          github: github?.trim() || "",
          linkedin: linkedin?.trim() || "",
          portfolio: portfolio?.trim() || "",
          profilePhoto: profilePhoto || ""
        },

        {
          new: true,
          runValidators: true
        }
      );


    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }


    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {

    console.error(
      "Profile update error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
});


// ======================================================
// DELETE MY PROFILE
// DELETE /api/profile
// ======================================================

router.delete("/", authMiddleware, async (req, res) => {
  try {

    const deletedProfile =
      await Profile.findOneAndDelete({
        userId: req.user.userId
      });


    if (!deletedProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }


    res.status(200).json({
      message: "Profile deleted successfully"
    });

  } catch (error) {

    console.error(
      "Profile delete error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete profile"
    });
  }
});


module.exports = router;