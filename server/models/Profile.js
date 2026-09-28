const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    college: {
      type: String,
      required: true,
      trim: true
    },

    branch: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    bio: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    github: {
      type: String,
      trim: true
    },

    portfolio: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);