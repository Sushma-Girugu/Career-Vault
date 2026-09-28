const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const models = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite"
];

router.post("/ask", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required"
      });
    }

    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await ai.models.generateContent({
          model,
          contents: prompt
        });

        console.log(`Gemini response received from: ${model}`);

        return res.status(200).json({
          answer: response.text,
          model
        });

      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model ${model} failed:`,
          error.message
        );

        if (error.status !== 503) {
          break;
        }
      }
    }

    console.error("All Gemini models failed.");

    return res.status(503).json({
      message: "Gemini is temporarily unavailable. Please try again shortly.",
      error: lastError?.message || "Unknown Gemini error"
    });

  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("===================================");

    return res.status(500).json({
      message: "Failed to get response from Gemini",
      error: error.message
    });
  }
});

module.exports = router;