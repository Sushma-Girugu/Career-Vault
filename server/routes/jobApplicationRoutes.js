const express = require("express");
const JobApplication = require("../models/JobApplication");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("JOB APPLICATION ROUTES FILE LOADED");

// =====================================================
// ADD APPLICATION
// POST /api/job-applications
// =====================================================

router.post("/", authMiddleware, async (req, res) => {
  console.log("POST JOB APPLICATION ROUTE HIT");
  console.log("Request body:", req.body);
  console.log("User:", req.user);

  try {
    const {
      company,
      role,
      jobTitle,
      status,
      appliedDate,
      applicationDate,
      jobLink,
      location,
      jobType,
      notes
    } = req.body;

    // Validate company
    if (!company || !company.trim()) {
      return res.status(400).json({
        message: "Company name is required"
      });
    }

    // Support both role and jobTitle
    const finalJobTitle = (role || jobTitle || "").trim();

    if (!finalJobTitle) {
      return res.status(400).json({
        message: "Job role is required"
      });
    }

    // Support both appliedDate and applicationDate
    const finalApplicationDate =
      appliedDate || applicationDate;

    const application = new JobApplication({
      // IMPORTANT: authMiddleware provides req.user.userId
      userId: req.user.userId,

      company: company.trim(),

      jobTitle: finalJobTitle,

      location: location || "",

      jobType: jobType || "Internship",

      applicationDate: finalApplicationDate
        ? new Date(finalApplicationDate)
        : new Date(),

      status: status || "Applied",

      jobLink: jobLink || "",

      notes: notes || ""
    });

    console.log(
      "Application before save:",
      application
    );

    const savedApplication =
      await application.save();

    console.log(
      "Application saved successfully:",
      savedApplication._id
    );

    res.status(201).json({
      message: "Job application added successfully",
      application: savedApplication
    });

  } catch (error) {
    console.error(
      "Create application error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create application",
      error: error.message
    });
  }
});


// =====================================================
// GET APPLICATIONS
// GET /api/job-applications
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications =
      await JobApplication.find({
        userId: req.user.userId
      }).sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    console.error(
      "Fetch applications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
});


// =====================================================
// UPDATE APPLICATION
// PUT /api/job-applications/:id
// =====================================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedApplication =
      await JobApplication.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.userId
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      message: "Application updated successfully",
      application: updatedApplication
    });

  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    res.status(500).json({
      message: "Failed to update application",
      error: error.message
    });
  }
});


// =====================================================
// DELETE APPLICATION
// DELETE /api/job-applications/:id
// =====================================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedApplication =
      await JobApplication.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });

    if (!deletedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      message: "Application deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete application error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete application",
      error: error.message
    });
  }
});


module.exports = router;