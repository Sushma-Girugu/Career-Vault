const express = require("express");
const router = express.Router();
const SocialLink = require("../models/SocialLink");

router.get("/", async (req, res) => {
  try {
    const socialLinks = await SocialLink.find().sort({
      createdAt: -1
    });

    res.json(socialLinks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch social links",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { platform, url } = req.body;

    const socialLink = new SocialLink({
      platform,
      url
    });

    const savedSocialLink = await socialLink.save();

    res.status(201).json(savedSocialLink);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create social link",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const socialLink = await SocialLink.findByIdAndUpdate(
      req.params.id,
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
    res.status(400).json({
      message: "Failed to update social link",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const socialLink = await SocialLink.findByIdAndDelete(
      req.params.id
    );

    if (!socialLink) {
      return res.status(404).json({
        message: "Social link not found"
      });
    }

    res.json({
      message: "Social link deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete social link",
      error: error.message
    });
  }
});

module.exports = router;