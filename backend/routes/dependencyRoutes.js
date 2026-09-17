const express = require("express");
const router = express.Router();
const Dependency = require("../models/Dependency");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// =========================
// GET ALL DEPENDENCIES
// =========================

router.get("/", async (req, res) => {
  try {
    const dependencies = await Dependency.find();

    res.json(dependencies);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dependencies",
      error: error.message,
    });
  }
});

// =========================
// CREATE DEPENDENCY
// =========================

router.post("/", async (req, res) => {
  try {
    const dependency = new Dependency(req.body);

    const savedDependency = await dependency.save();

    res.status(201).json(savedDependency);
  } catch (error) {
    res.status(500).json({
      message: "Error creating dependency",
      error: error.message,
    });
  }
});

// =========================
// DELETE DEPENDENCY
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedDependency =
      await Dependency.findByIdAndDelete(req.params.id);

    if (!deletedDependency) {
      return res.status(404).json({
        message: "Dependency not found",
      });
    }

    res.json({
      message: "Dependency deleted successfully",
      dependency: deletedDependency,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting dependency",
      error: error.message,
    });
  }
});

// =========================
// EXPORT ROUTER
// =========================

module.exports = router;