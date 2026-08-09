const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  college: {
    type: String,
    required: true
  },

  branch: {
    type: String,
    required: true
  },

  year: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Profile", profileSchema);