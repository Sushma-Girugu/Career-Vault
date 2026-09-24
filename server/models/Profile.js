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
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      ]
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit phone number"
      ]
    },

    college: {
      type: String,
      trim: true,
      maxlength: [100, "College name is too long"]
    },

    branch: {
      type: String,
      trim: true,
      maxlength: [100, "Branch name is too long"]
    },

    year: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location is too long"]
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"]
    },

    github: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    portfolio: {
      type: String,
      trim: true
    },

    profilePhoto: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);