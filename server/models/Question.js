const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    optionA: {
      type: String,
      required: true
    },

    optionB: {
      type: String,
      required: true
    },

    optionC: {
      type: String,
      required: true
    },

    optionD: {
      type: String,
      required: true
    },

    correctAnswer: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      default: "Easy"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Question", questionSchema);