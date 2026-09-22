const express = require("express");
const Resume = require("../models/Resume");

const router = express.Router();

// CREATE RESUME
router.post("/", async (req, res) => {
  try {
    const resume = new Resume(req.body);
    const savedResume = await resume.save();

    res.status(201).json({
      message: "Resume created successfully",
      resume: savedResume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message
    });
  }
});

// GET ALL RESUMES
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message
    });
  }
});

// GET RESUME BY ID
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resume",
      error: error.message
    });
  }
});

// UPDATE RESUME
router.put("/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.status(200).json({
      message: "Resume updated successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update resume",
      error: error.message
    });
  }
});

// DELETE RESUME
router.delete("/:id", async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    res.status(200).json({
      message: "Resume deleted successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message
    });
  }
});

module.exports = router;