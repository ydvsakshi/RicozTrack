const express = require("express");
const router = express.Router();
const Risk = require("../models/Risk");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// =========================
// GET ALL RISKS
// =========================

router.get("/", async (req, res) => {
  try {
    const risks = await Risk.find();

    res.json(risks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching risks",
      error: error.message,
    });
  }
});

// =========================
// CREATE RISK
// =========================

router.post("/", async (req, res) => {
  try {
    const risk = new Risk(req.body);

    const savedRisk = await risk.save();

    res.status(201).json(savedRisk);
  } catch (error) {
    res.status(500).json({
      message: "Error creating risk",
      error: error.message,
    });
  }
});

// =========================
// DELETE RISK
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedRisk = await Risk.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRisk) {
      return res.status(404).json({
        message: "Risk not found",
      });
    }

    res.json({
      message: "Risk deleted successfully",
      risk: deletedRisk,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting risk",
      error: error.message,
    });
  }
});

// =========================
// EXPORT ROUTER
// =========================

module.exports = router;