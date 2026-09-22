const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        default: ""
      },
      phone: {
        type: String,
        default: ""
      },
      location: {
        type: String,
        default: ""
      },
      linkedin: {
        type: String,
        default: ""
      },
      github: {
        type: String,
        default: ""
      }
    },

    education: [
      {
        institution: String,
        degree: String,
        year: String,
        cgpa: String
      }
    ],

    skills: [
      {
        name: String,
        level: String
      }
    ],

    projects: [
      {
        name: String,
        description: String,
        technologies: String,
        link: String
      }
    ],

    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String
      }
    ],

    achievements: [
      {
        title: String,
        description: String
      }
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        year: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);