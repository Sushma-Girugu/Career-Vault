import { useEffect, useState } from "react";

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "/api/notifications"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load notifications");
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        "/api/notifications/unread-count"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }

      const data = await response.json();

      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `/api/notifications/${id}/read`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `/api/notifications/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Notifications
        {unreadCount > 0 && ` (${unreadCount} unread)`}
      </h2>

      {error && <p>{error}</p>}

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{notification.type}</h3>

            <p>{notification.message}</p>

            <p>
              Status:{" "}
              {notification.isRead ? "Read" : "Unread"}
            </p>

            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification._id)}
              >
                Mark as Read
              </button>
            )}

            <button
              onClick={() =>
                deleteNotification(notification._id)
              }
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationPanel;