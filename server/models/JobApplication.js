const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Applied",
        "Interview",
        "Selected",
        "Rejected"
      ],
      default: "Applied"
    },

    appliedDate: {
      type: Date,
      required: true,
      default: Date.now
    },

    jobLink: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);