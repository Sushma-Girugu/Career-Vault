const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  createNotification
} = require("../controllers/notificationController");

const router = express.Router();

// Get all notifications
router.get("/", getNotifications);
//Create notification
router.post("/", createNotification);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;