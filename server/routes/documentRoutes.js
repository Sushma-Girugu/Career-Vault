const express = require("express");
const multer = require("multer");

const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const router = express.Router();

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC and DOCX files are allowed"));
    }
  },
});

// Upload document
router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

// Get all documents
router.get("/", getDocuments);

// Download document
router.get("/download/:id", downloadDocument);

// Delete document
router.delete("/:id", deleteDocument);

module.exports = router;