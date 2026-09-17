const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// =========================
// GET ALL RESOURCES
// =========================

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();

    res.json(resources);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching resources",
      error: error.message,
    });
  }
});

// =========================
// CREATE RESOURCE
// =========================

router.post("/", async (req, res) => {
  try {
    const resource = new Resource(req.body);

    const savedResource = await resource.save();

    res.status(201).json(savedResource);
  } catch (error) {
    res.status(500).json({
      message: "Error creating resource",
      error: error.message,
    });
  }
});

// =========================
// DELETE RESOURCE
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(
      req.params.id
    );

    if (!deletedResource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.json({
      message: "Resource deleted successfully",
      resource: deletedResource,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting resource",
      error: error.message,
    });
  }
});

// =========================
// EXPORT ROUTER
// =========================

module.exports = router;