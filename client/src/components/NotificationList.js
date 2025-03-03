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
import { useTheme } from "@mui/material/styles";
const NotificationList = ({
  notifications,
  onNotificationClick,
  markAsRead,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const notificationsPerPage = 5;
  const theme = useTheme(); // Get the theme

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
            <Typography sx={{ color: theme.palette.text.secondary }}>
              No notifications
            </Typography>
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
                sx={{
                  backgroundColor: notification.read
                    ? theme.palette.background.paper
                    : theme.palette.action.hover,
                  padding: theme.spacing(2),
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <div
                  className="notification-item-text"
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />

                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    border: "none",
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
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
              color: theme.palette.common.white,
              padding: theme.spacing(1),
              marginBottom: theme.spacing(2),
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
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
