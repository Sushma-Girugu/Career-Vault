const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// CREATE project
router.post("/", async (req, res) => {
  try {
    const { name, description, technologies, githubUrl, demoUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Project name and description are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      technologies: technologies || [],
      githubUrl: githubUrl || "",
      demoUrl: demoUrl || "",
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

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

// UPDATE project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
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

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
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