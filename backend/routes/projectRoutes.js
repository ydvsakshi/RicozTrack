const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// =========================
// GET ALL PROJECTS
// =========================

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching projects",
      error: error.message,
    });
  }
});

// =========================
// CREATE PROJECT
// =========================

router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({
      message: "Error creating project",
      error: error.message,
    });
  }
});

// =========================
// UPDATE PROJECT
// =========================

router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({
      message: "Error updating project",
      error: error.message,
    });
  }
});

// =========================
// DELETE PROJECT
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting project",
      error: error.message,
    });
  }
});

// =========================
// EXPORT ROUTER
// =========================

module.exports = router;