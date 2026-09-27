const express = require("express");
const router = express.Router();

const JobApplication = require("../models/JobApplication");
const authMiddleware = require("../middleware/authMiddleware");

// ADD JOB APPLICATION
router.post("/", authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.create({
      ...req.body,
      userId: req.user.userId,
    });

    res.status(201).json(application);
  } catch (error) {
    console.log("Create application error:", error.message);

    res.status(500).json({
      message: "Failed to create application",
    });
  }
});

// GET ALL JOB APPLICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find({
      userId: req.user.userId,
    }).sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.log("Fetch applications error:", error.message);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

// UPDATE JOB APPLICATION
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.log("Update application error:", error.message);

    res.status(500).json({
      message: "Failed to update application",
    });
  }
});

// DELETE JOB APPLICATION
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.log("Delete application error:", error.message);

    res.status(500).json({
      message: "Failed to delete application",
    });
  }
});

module.exports = router;
