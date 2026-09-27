const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET all questions
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const questions = await Question.find(filter);

    res.json(questions);
  } catch (error) {
    console.log("Question fetch error:", error.message);

    res.status(500).json({
      message: "Failed to fetch questions"
    });
  }
});

module.exports = router;