const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

// Add a skill
router.post("/", async (req, res) => {
  try {
    const { name, level } = req.body;

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

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json(skills);
  } catch (error) {
    console.log("Skill fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message
    });
  }
});

// Delete a skill
router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Skill deleted successfully"
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