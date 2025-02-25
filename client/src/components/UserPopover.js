import React, { useState } from "react";
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
import Logo from "./../files/dp.jpg";
import CustomModal from "./modal/CustomModal";

const UserPopover = ({
  openUserPopover,
  anchorEl,
  onClose,
  userName,
  role,
  email,
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const onSettings = () => {
    toast.success("Settings page coming soon!");
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ height: "30px", width: "30px" }} src={Logo} />
              <Box>
                <Typography className="user-name" variant="h6">
                  {userName?.length > 10
                    ? userName.slice(0, 10) + "..."
                    : userName}
                </Typography>
                <Typography className="user-role" variant="body2">
                  {role}
                </Typography>
                <Typography className="user-role" variant="body2">
                  {email}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={onSettings}
              variant="outlined"
              size="small"
              startIcon={<SettingsIcon />}
              sx={{ textTransform: "none", height: "30px" }}
            >
              Settings
            </Button>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleOpenProfile}
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none", height: "30px" }}
            >
              View Profile
            </Button>
            <Button
              onClick={onLogout}
              variant="contained"
              color="error"
              size="small"
              className="logout-button"
              sx={{ textTransform: "none", height: "30px" }}
            >
              <LogoutIcon /> <span>Logout</span>
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Profile Modal */}
      <CustomModal
        open={isProfileOpen}
        onClose={handleCloseProfile}
        title="Profile"
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <Avatar sx={{ width: 80, height: 80, margin: "auto" }} src={Logo} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {userName}
          </Typography>
          <Typography variant="body1">{role}</Typography>
          <Typography variant="body2">{email}</Typography>
          {/* Add update functionality here */}
        </Box>
      </CustomModal>
    </>
  );
};

export default UserPopover;
