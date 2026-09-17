const mongoose = require("mongoose");

const dependencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    project: {
      type: String,
      required: true,
    },

    task: {
      type: String,
      default: "",
    },

    dependsOn: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "Finish-to-Start",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dependency", dependencySchema);