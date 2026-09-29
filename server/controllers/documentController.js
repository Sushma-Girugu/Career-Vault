const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");
// Upload Document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const document = new Document({
      userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    await document.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Document upload error:", error);

    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

// Get Documents
const getDocuments = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const documents = await Document.find({ userId });
    documents.forEach((document) => {
  document._doc.downloadUrl =
    `/uploads/${path.basename(document.filePath)}`;
});

    res.status(200).json(documents);
  } catch (error) {
    console.error("Get documents error:", error);

    res.status(500).json({
      message: "Failed to get documents",
      error: error.message,
    });
  }
};

// Download Document
// Download Document
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const filePath = path.join(__dirname, "..", document.filePath);

    console.log("Download file path:");
    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.download(filePath, document.fileName);
  } catch (error) {
    console.error("Download document error:", error);

    res.status(500).json({
      message: "Failed to download document",
      error: error.message,
    });
  }
};

// Delete Document
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Delete physical file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete MongoDB record
    await Document.findByIdAndDelete(id);

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
};