const express = require("express");
const router = express.Router();

const Achievement = require("../models/Achievement");
const authMiddleware = require("../middleware/authMiddleware");

console.log("### NEW ACHIEVEMENT ROUTE LOADED ###");

// ============================================
// GET USER'S ACHIEVEMENTS
// ============================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log(
      "Fetching achievements for user:",
      req.user.id
    );

    const achievements = await Achievement.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    console.log(
      "Achievements found:",
      achievements.length
    );

    res.json(achievements);
  } catch (error) {
    console.error(
      "Achievement fetch error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch achievements",
      error: error.message
    });
  }
});

// ============================================
// CREATE ACHIEVEMENT
// ============================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      link
    } = req.body;

    const achievement = new Achievement({
      title,
      description,
      link,
      userId: req.user.id
    });

    const savedAchievement =
      await achievement.save();

    res.status(201).json(savedAchievement);
  } catch (error) {
    console.error(
      "Achievement create error:",
      error.message
    );

    res.status(400).json({
      message: "Failed to create achievement",
      error: error.message
    });
  }
});

// ============================================
// UPDATE ACHIEVEMENT
// ============================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const achievement =
      await Achievement.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.id
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found"
      });
    }

    res.json(achievement);
  } catch (error) {
    console.error(
      "Achievement update error:",
      error.message
    );

    res.status(400).json({
      message: "Failed to update achievement",
      error: error.message
    });
  }
});

// ============================================
// DELETE ACHIEVEMENT
// ============================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const achievement =
      await Achievement.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found"
      });
    }

    res.json({
      message: "Achievement deleted successfully"
    });
  } catch (error) {
    console.error(
      "Achievement delete error:",
      error.message
    );

    res.status(400).json({
      message: "Failed to delete achievement",
      error: error.message
    });
  }
});

module.exports = router;