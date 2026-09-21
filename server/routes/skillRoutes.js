const express = require("express");
const mongoose = require("mongoose");
const Skill = require("../models/Skill");

const router = express.Router();

// ========================================
// ADD A SKILL
// POST /api/skills
// ========================================
router.post("/", async (req, res) => {
  try {
    const { name, level } = req.body;

    // Validate input
    if (!name || !level) {
      return res.status(400).json({
        message: "Skill name and level are required"
      });
    }

    const skill = new Skill({
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
// GET ALL SKILLS
// GET /api/skills
// ========================================
router.get("/", async (req, res) => {
  console.log("========== GET /api/skills ==========");
  console.log("Mongoose connection state:", mongoose.connection.readyState);
  console.log("Skill model connection state:", Skill.db.readyState);

  try {
    const skills = await Skill.find().sort({
      createdAt: -1
    });

    console.log("Skills fetched successfully:", skills.length);

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
// DELETE A SKILL
// DELETE /api/skills/:id
// ========================================
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE SKILL REQUEST RECEIVED");
    console.log("Skill ID:", req.params.id);

    const deletedSkill = await Skill.findByIdAndDelete(
      req.params.id
    );

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