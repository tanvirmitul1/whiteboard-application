import React, { useState, useEffect } from "react";
import { orderBy } from "lodash";
import {
  Box,
  IconButton,
  Avatar,
  Popover,
  Badge,
  Tooltip,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { LinkStyled } from "./styledComponents";
import useAuth from "../customHooks/useAuth";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
} from "../Apis/notificationApiSlice";
import NotificationList from "./NotificationList";
import { useNavigate } from "react-router-dom";
import UserPopover from "./UserPopover";

import Logo from "../files/dp.jpg";
const URL = process.env.REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const socket = io(URL);
const UserInfo = () => {
  const NotificationSound = new Audio("/audio/notifications.mp3");
  const { userName, role, isAdmin, userId } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const isPc = useMediaQuery("(min-width: 960px)");

  const { data: allNotifications } = useGetAllNotificationsQuery();
  const [updateNotification] = useUpdateNotificationMutation();

  useEffect(() => {
    if (allNotifications) {
      const sortedNotifications = orderBy(
        allNotifications.filter((notification) => notification.user !== userId),
        ["createdAt"],
        ["desc"]
      );
      setNotifications(sortedNotifications);
    }
  }, [allNotifications, userId]);

  useEffect(() => {
    // Listen for notifications
    socket.on("receiveNotification", (notification) => {
      if (notification.user !== userId) {
        setNotifications((prev) =>
          orderBy([...prev, notification], ["createdAt"], ["desc"])
        );
        NotificationSound.play(); // Play sound on new notification
      }
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await updateNotification({ notificationId, read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("shapes");
    navigate("/");
    toast.success("Logout successful!");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserPopoverClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationPopoverClose = () => {
    setNotificationAnchorEl(null);
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const openNotificationPopover = Boolean(notificationAnchorEl);
  const openUserPopover = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "2px 8px",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Tooltip title="User Profile" arrow>
        <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
          <Avatar sx={{ height: "30px", width: "30px" }} src={Logo} />
        </IconButton>
      </Tooltip>

      {isPc && (
        <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
          {userName}
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#ffcc80", marginLeft: 1 }}
          >
            ({role})
          </Typography>
        </Typography>
      )}

      <Tooltip title="Notifications" arrow>
        <IconButton onClick={handleNotificationClick} sx={{ color: "white" }}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <UserPopover
        openUserPopover={openUserPopover}
        anchorEl={anchorEl}
        onClose={handleUserPopoverClose}
        userName={userName}
        role={role}
        onLogout={handleLogout}
      />

      <Popover
        open={openNotificationPopover}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationPopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NotificationList
          notifications={notifications}
          onNotificationClick={() => {}}
          markAsRead={markAsRead}
        />
      </Popover>
    </Box>
  );
};

export default UserInfo;
