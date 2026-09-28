const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ========================================
// ASK GEMINI
// POST /api/gemini/ask
// ========================================
router.post("/ask", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required"
      });
    }

    const response = await ai.models.generateContent({
     model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    res.status(200).json({
      answer: response.text
    });

    } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("===================================");

    res.status(500).json({
      message: "Failed to get response from Gemini",
      error: error.message
    });
  }
});

module.exports = router;