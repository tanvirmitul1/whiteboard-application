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

const UserPopover = ({ open, anchorEl, onClose, userName, role, onLogout }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        "& .MuiPopover-paper": {
          borderRadius: 2,
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.2)",
          width: 200,
        },
      }}
    >
      <Box
        sx={{
          padding: 2,
          bgcolor: "#ffffff",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={"https://via.placeholder.com/150"} alt={userName} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              {role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />
        <Button
          onClick={onLogout}
          variant="contained"
          color="error"
          size="small"
          sx={{ textTransform: "none", padding: 1, marginLeft: "90px" }}
        >
          <LogoutIcon /> <span>Logout</span>
        </Button>
      </Box>
    </Popover>
  );
};

export default UserPopover;
