const express = require("express");
const router = express.Router();

const SocialLink = require("../models/SocialLink");
const authMiddleware = require("../middleware/authMiddleware");

console.log("### NEW SOCIAL LINK ROUTE LOADED ###");

// ============================================
// GET USER'S SOCIAL LINKS
// ============================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log(
      "Fetching social links for user:",
      req.user.id
    );

    const socialLinks = await SocialLink.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    console.log(
      "Social links found:",
      socialLinks.length
    );

    res.json(socialLinks);
  } catch (error) {
    console.error(
      "Social link fetch error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch social links",
      error: error.message
    });
  }
});

// ============================================
// CREATE SOCIAL LINK
// ============================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      platform,
      url
    } = req.body;

    const socialLink = new SocialLink({
      platform,
      url,
      userId: req.user.id
    });

    const savedSocialLink =
      await socialLink.save();

    res.status(201).json(savedSocialLink);
  } catch (error) {
    console.error(
      "Social link create error:",
      error.message
    );

    res.status(400).json({
      message: "Failed to create social link",
      error: error.message
    });
  }
});

// ============================================
// UPDATE SOCIAL LINK
// ============================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const socialLink =
      await SocialLink.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.id
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!socialLink) {
      return res.status(404).json({
        message: "Social link not found"
      });
    }

    res.json(socialLink);
  } catch (error) {
    console.error(
      "Social link update error:",
      error.message
    );

    res.status(400).json({
      message: "Failed to update social link",
      error: error.message
    });
  }
});

// ============================================
// DELETE SOCIAL LINK
// ============================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const socialLink =
        await SocialLink.findOneAndDelete({
          _id: req.params.id,
          userId: req.user.id
        });

      if (!socialLink) {
        return res.status(404).json({
          message: "Social link not found"
        });
      }

      res.json({
        message:
          "Social link deleted successfully"
      });
    } catch (error) {
      console.error(
        "Social link delete error:",
        error.message
      );

      res.status(400).json({
        message:
          "Failed to delete social link",
        error: error.message
      });
    }
  }
);

module.exports = router;