const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    manager: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Planning",
    },

    progress: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);