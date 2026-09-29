const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");

router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      createdAt: -1
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch achievements",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const achievement = new Achievement({
      title,
      description,
      link
    });

    const savedAchievement = await achievement.save();

    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create achievement",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
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
    res.status(400).json({
      message: "Failed to update achievement",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(
      req.params.id
    );

    if (!achievement) {
      return res.status(404).json({
        message: "Achievement not found"
      });
    }

    res.json({
      message: "Achievement deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete achievement",
      error: error.message
    });
  }
});

module.exports = router;