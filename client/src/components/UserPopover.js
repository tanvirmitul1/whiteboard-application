import React from "react";
import {
  Popover,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import SettingsIcon from "@mui/icons-material/Settings";
import { toast } from "react-toastify";

const UserPopover = ({
  openUserPopover,
  anchorEl,
  onClose,
  userName,
  role,
  email,
  onLogout,
}) => {
  const onSettings = () => {
    toast.success("Settings page coming soon!");
  };
  return (
    <Popover
      open={openUserPopover}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box className="user-popover">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={"https://via.placeholder.com/150"} alt={userName} />
          <Box>
            <Typography className="user-name" variant="h6">
              {userName}
            </Typography>
            <Typography className="user-role" variant="body2">
              {role}
            </Typography>
            <Typography className="user-role" variant="body2">
              {email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={onSettings}
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
          <Button
            onClick={onLogout}
            variant="contained"
            color="error"
            size="small"
            className="logout-button"
          >
            <LogoutIcon /> <span>Logout</span>
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default UserPopover;
