import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  Divider,
  Button,
  Typography,
  Skeleton,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const NotificationList = ({
  notifications,
  onNotificationClick,
  markAsRead,
  isDarkMode, // New prop to toggle dark mode
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load the initial notifications
    setVisibleNotifications(notifications.slice(0, 5));
  }, [notifications]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        // Check if we have more notifications to load
        if (visibleNotifications.length < notifications.length && !loading) {
          loadMoreNotifications();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleNotifications, notifications, loading]);

  const loadMoreNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleNotifications((prev) => [
        ...prev,
        ...notifications.slice(prev.length, prev.length + 5),
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box className="notification-container" ref={containerRef}>
      <List className="notification-list">
        {visibleNotifications.length === 0 ? (
          <ListItem>
            <Typography>No notifications</Typography>
          </ListItem>
        ) : (
          visibleNotifications.map((notification, index) => (
            <div key={index}>
              <div
                className={`notification-item ${
                  notification.read ? "read" : ""
                }`}
                onClick={() => {
                  onNotificationClick(notification);
                  if (!notification.read) markAsRead(notification._id);
                }}
              >
                <div
                  className="notification-item-text"
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />

                <Typography variant="caption" sx={{ color: "gray" }}>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: "none", border: "none" }}
                  href={notification.redirectUrl}
                >
                  View
                </Button>
              </div>
              {index < visibleNotifications.length - 1 && <Divider />}
            </div>
          ))
        )}

        {loading && (
          <>
            {[...Array(5)].map((_, index) => (
              <ListItem key={index}>
                <Skeleton variant="rectangular" width="100%" height={50} />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );
};

export default NotificationList;
