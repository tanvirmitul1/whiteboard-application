import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  Divider,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const NotificationList = ({
  notifications,
  onNotificationClick,
  markAsRead,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const notificationsPerPage = 5;

  useEffect(() => {
    // Load the initial notifications
    setVisibleNotifications(notifications.slice(0, notificationsPerPage));
  }, [notifications]);

  const loadMoreNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextNotifications = notifications.slice(
        0,
        nextPage * notificationsPerPage
      );
      setVisibleNotifications(nextNotifications);
      setPage(nextPage);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box className="notification-container">
      <List className="notification-list">
        {visibleNotifications.length === 0 ? (
          <ListItem>
            <Typography sx={{ color: "gray" }}>No notifications</Typography>
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
      </List>

      {visibleNotifications.length < notifications.length && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            onClick={loadMoreNotifications}
            sx={{
              cursor: "pointer",
              color: "white",
              padding: "5px",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: "#007acc",
            }}
          >
            {loading ? (
              <span>
                <CircularProgress size={15} color="inherit" sx={{ mr: 1 }} />
                Processing...
              </span>
            ) : (
              "See More"
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NotificationList;
