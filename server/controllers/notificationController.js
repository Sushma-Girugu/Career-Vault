const Notification = require("../models/Notification");

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      isRead: false
    });

    res.status(200).json({
      unreadCount: count
    });
  } catch (error) {
    console.error("Unread count error:", error);

    res.status(500).json({
      message: "Failed to fetch unread count"
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark as read error:", error);

    res.status(500).json({
      message: "Failed to mark notification as read"
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    res.status(500).json({
      message: "Failed to delete notification"
    });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Notification message is required"
      });
    }

    const notification = await Notification.create({
      message,
      type: type || "Reminder"
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      message: "Failed to create notification"
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  createNotification
};