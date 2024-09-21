import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  Divider,
  Button,
  ListItemText,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns"; // Import from date-fns

const NotificationList = ({
  notifications,
  onNotificationClick,
  markAsRead,
}) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <Box
      sx={{
        maxHeight: "400px",
        overflowY: "auto",
        width: "320px",
        overflowX: "none",
      }}
    >
      <List sx={{ width: "300px", margin: "0 auto" }}>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No notifications" />
          </ListItem>
        ) : (
          notifications.slice(0, visibleCount).map((notification, index) => (
            <div key={index}>
              <ListItem
                sx={{
                  backgroundColor: notification.read ? "#f5f5f5" : "#e3f2fd",
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: "2px",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
                onClick={() => {
                  onNotificationClick(notification);
                  if (!notification.read) markAsRead(notification._id); // Mark as read when clicked
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />
                {/* Display relative time */}
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
                {notification.code === "new_drawing" && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ textTransform: "none" }}
                    href={notification.redirectUrl}
                  >
                    View
                  </Button>
                )}
                {notification.code === "update_drawing" && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ textTransform: "none" }}
                    href={notification.redirectUrl}
                  >
                    View
                  </Button>
                )}
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </div>
          ))
        )}
      </List>
      {notifications.length > visibleCount && (
        <Button onClick={handleShowMore} fullWidth>
          Show More
        </Button>
      )}
    </Box>
  );
};

export default NotificationList;
