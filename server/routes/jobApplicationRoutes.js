const express = require("express");
const JobApplication = require("../models/JobApplication");

console.log("JOB APPLICATION ROUTES FILE LOADED");

const router = express.Router();

// ========================================
// ADD JOB APPLICATION
// POST /api/job-applications
// ========================================

router.post("/", async (req, res) => {
  console.log("POST JOB APPLICATION ROUTE HIT");

  try {
    const {
      company,
      role,
      status,
      appliedDate,
      jobLink
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required"
      });
    }

    const application = new JobApplication({
      company: company,
      role: role,
      status: status || "Applied",
      appliedDate: appliedDate || Date.now(),
      jobLink: jobLink || ""
    });

    const savedApplication = await application.save();

    res.status(201).json({
      message: "Job application added successfully",
      application: savedApplication
    });

  } catch (error) {
    console.log(
      "Job application save error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save job application",
      error: error.message
    });
  }
});


// ========================================
// GET ALL JOB APPLICATIONS
// GET /api/job-applications
// ========================================

router.get("/", async (req, res) => {
  console.log("GET JOB APPLICATIONS ROUTE HIT");

  try {
    const applications = await JobApplication.find()
      .sort({ createdAt: -1 });

    console.log(
      "Applications found:",
      applications.length
    );

    res.status(200).json(applications);

  } catch (error) {
    console.log(
      "Job application fetch error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message
    });
  }
});


// ========================================
// UPDATE JOB APPLICATION
// PUT /api/job-applications/:id
// ========================================

router.put("/:id", async (req, res) => {
  console.log("UPDATE JOB APPLICATION ROUTE HIT");
  console.log("Application ID:", req.params.id);

  try {
    const updatedApplication =
      await JobApplication.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Job application not found"
      });
    }

    res.status(200).json({
      message: "Job application updated successfully",
      application: updatedApplication
    });

  } catch (error) {
    console.log(
      "Job application update error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update job application",
      error: error.message
    });
  }
});


// ========================================
// DELETE JOB APPLICATION
// DELETE /api/job-applications/:id
// ========================================

router.delete("/:id", async (req, res) => {
  console.log("DELETE JOB APPLICATION ROUTE HIT");
  console.log("Application ID:", req.params.id);

  try {
    const deletedApplication =
      await JobApplication.findByIdAndDelete(
        req.params.id
      );

    if (!deletedApplication) {
      return res.status(404).json({
        message: "Job application not found"
      });
    }

    res.status(200).json({
      message: "Job application deleted successfully",
      application: deletedApplication
    });

  } catch (error) {
    console.log(
      "Job application delete error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete job application",
      error: error.message
    });
  }
});


module.exports = router;