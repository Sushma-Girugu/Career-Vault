const express = require("express");
const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// ADD A SKILL
// POST /api/skills
// ========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({
        message: "Skill name and level are required"
      });
    }

    const skill = new Skill({
      userId: req.user.userId,
      name,
      level
    });

    const savedSkill = await skill.save();

    res.status(201).json(savedSkill);
  } catch (error) {
    console.log("Skill save error:", error.message);

    res.status(500).json({
      message: "Failed to save skill",
      error: error.message
    });
  }
});

// ========================================
// GET ALL SKILLS FOR LOGGED-IN USER
// GET /api/skills
// ========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({
      userId: req.user.userId
    }).sort({
      createdAt: -1
    });

    res.status(200).json(skills);
  } catch (error) {
    console.log("Skill fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message
    });
  }
});

// ========================================
// UPDATE A SKILL
// PUT /api/skills/:id
// ========================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({
        message: "Skill name and level are required"
      });
    }

    const updatedSkill = await Skill.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      {
        name,
        level
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedSkill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.status(200).json(updatedSkill);
  } catch (error) {
    console.log("Skill update error:", error.message);

    res.status(500).json({
      message: "Failed to update skill",
      error: error.message
    });
  }
});

// ========================================
// DELETE A SKILL
// DELETE /api/skills/:id
// ========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedSkill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedSkill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
      skill: deletedSkill
    });
  } catch (error) {
    console.log("Skill delete error:", error.message);

    res.status(500).json({
      message: "Failed to delete skill",
      error: error.message
    });
  }
});

module.exports = router;