const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "Available",
    },

    project: {
      type: String,
      default: "Unassigned",
    },

    workload: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);