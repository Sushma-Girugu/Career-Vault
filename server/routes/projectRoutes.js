const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------
// Every project API requires a logged-in user.
router.use(authMiddleware);


// ----------------------------------------------------
// CREATE PROJECT
// POST /api/projects
// ----------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      technologies,
      githubUrl,
      demoUrl,
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Project description is required",
      });
    }

    // Convert technologies into an array
    let technologyList = [];

    if (Array.isArray(technologies)) {
      technologyList = technologies
        .map((tech) => String(tech).trim())
        .filter((tech) => tech.length > 0);
    } else if (typeof technologies === "string") {
      technologyList = technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);
    }

    // Create project for the logged-in user
    const project = await Project.create({
      userId: req.user.id,

      name: name.trim(),

      description: description.trim(),

      technologies: technologyList,

      githubUrl: githubUrl ? githubUrl.trim() : "",

      demoUrl: demoUrl ? demoUrl.trim() : "",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);

    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});


// ----------------------------------------------------
// GET USER'S PROJECTS
// GET /api/projects
// ----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    // IMPORTANT:
    // Only return projects belonging to logged-in user.
    const projects = await Project.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});


// ----------------------------------------------------
// UPDATE PROJECT
// PUT /api/projects/:id
// ----------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      technologies,
      githubUrl,
      demoUrl,
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Project description is required",
      });
    }

    // Convert technologies into an array
    let technologyList = [];

    if (Array.isArray(technologies)) {
      technologyList = technologies
        .map((tech) => String(tech).trim())
        .filter((tech) => tech.length > 0);
    } else if (typeof technologies === "string") {
      technologyList = technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);
    }

    // IMPORTANT:
    // Update only if this project belongs to logged-in user.
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        name: name.trim(),

        description: description.trim(),

        technologies: technologyList,

        githubUrl: githubUrl ? githubUrl.trim() : "",

        demoUrl: demoUrl ? demoUrl.trim() : "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you do not have permission to update it",
      });
    }

    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);

    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
});


// ----------------------------------------------------
// DELETE PROJECT
// DELETE /api/projects/:id
// ----------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    // IMPORTANT:
    // Delete only if this project belongs to logged-in user.
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you do not have permission to delete it",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);

    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
});


module.exports = router;