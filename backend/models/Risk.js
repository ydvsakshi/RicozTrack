const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    project: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    probability: {
      type: String,
      default: "Low",
    },

    impact: {
      type: String,
      default: "Low",
    },

    severity: {
      type: String,
      default: "Low",
    },

    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Risk", riskSchema);