const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    personalInfo: {
      name: {
        type: String,
        required: true,
        trim: true
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

    // =====================================================
    // EDUCATION
    // =====================================================

    education: [
      {
        institution: {
          type: String,
          default: ""
        },

        degree: {
          type: String,
          default: ""
        },

        year: {
          type: String,
          default: ""
        },

        cgpa: {
          type: String,
          default: ""
        }
      }
    ],

    // =====================================================
    // SKILLS
    // =====================================================

    skills: [
      {
        name: {
          type: String,
          default: ""
        },

        level: {
          type: String,
          default: ""
        }
      }
    ],

    // =====================================================
    // PROJECTS
    // =====================================================

    projects: [
      {
        name: {
          type: String,
          default: ""
        },

        description: {
          type: String,
          default: ""
        },

        technologies: {
          type: String,
          default: ""
        },

        link: {
          type: String,
          default: ""
        }
      }
    ],

    // =====================================================
    // EXPERIENCE
    // =====================================================

    experience: [
      {
        company: {
          type: String,
          default: ""
        },

        role: {
          type: String,
          default: ""
        },

        duration: {
          type: String,
          default: ""
        },

        description: {
          type: String,
          default: ""
        }
      }
    ],

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================

    achievements: [
      {
        title: {
          type: String,
          default: ""
        },

        description: {
          type: String,
          default: ""
        }
      }
    ],

    // =====================================================
    // CERTIFICATIONS
    // =====================================================

    certifications: [
      {
        name: {
          type: String,
          default: ""
        },

        issuer: {
          type: String,
          default: ""
        },

        year: {
          type: String,
          default: ""
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);