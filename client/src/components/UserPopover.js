import React, { useState } from "react";
import {
  Popover,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { toast } from "react-toastify";

import useAuth from "../customHooks/useAuth";
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";

const UserPopover = ({
  openUserPopover,
  anchorEl,
  onClose,
  email,
  onLogout,
  setAnchorEl,
}) => {
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const {
    username: userName,
    role,
    _id: userId,
  } = useSelector((state) => state.auth.user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <Popover
        open={openUserPopover}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          ".MuiPaper-root": {
            borderRadius: 3,
            boxShadow: 3,
            background: "#1e1e1e",
          },
        }}
      >
        <Box p={2} minWidth={250}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={profilePicture}
                sx={{ width: 40, height: 40, boxShadow: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold" color="white">
                  {userName?.length > 12
                    ? userName.slice(0, 12) + "..."
                    : userName}
                </Typography>
                <Typography variant="body2" color="white">
                  {role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {email}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Settings">
              <Button
                onClick={() => toast.info("Settings page coming soon!")}
                variant="contained"
                color="primary"
                sx={{ minWidth: "30px", height: "30px", p: 0 }}
              >
                <SettingsIcon />
              </Button>
            </Tooltip>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={() => {
                setAnchorEl(null);
                setIsProfileOpen(true);
              }}
              variant="contained"
              color="secondary"
              size="small"
              sx={{ textTransform: "none", width: "45%" }}
            >
              View Profile
            </Button>
            <Button
              onClick={onLogout}
              variant="contained"
              color="error"
              size="small"
              sx={{
                textTransform: "none",
                width: "45%",
                display: "flex",
                gap: 1,
              }}
            >
              <LogoutIcon fontSize="small" /> Logout
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Extracted Profile Modal */}
      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        role={role}
        email={email}
        profilePicture={profilePicture}
        userId={userId}
      />
    </>
  );
};

export default UserPopover;
