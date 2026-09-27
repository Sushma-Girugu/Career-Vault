const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      default: "Internship",
    },

    applicationDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Rejected", "Selected"],
      default: "Applied",
    },

    jobLink: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);