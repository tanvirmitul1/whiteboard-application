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
import CustomModal from "./modal/CustomModal";
import { useProfilePictureUploadMutation } from "../Apis/userApiSlice";
import useAuth from "../customHooks/useAuth";

const UserPopover = ({
  openUserPopover,
  anchorEl,
  onClose,
  email,
  onLogout,
}) => {
  const { userName, role, isAdmin, userId, image: profilePicture } = useAuth();
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
  const [uploadProfilePicture, { isLoading }] =
    useProfilePictureUploadMutation();
  const [image, setImage] = useState(null);
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", userId);

    try {
      // const response = await axios.post("http://localhost:5000/upload", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // console.log("Upload success:", response.data);
      await uploadProfilePicture(formData).unwrap();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error.response?.data);
      alert("Upload failed. Please try again.");
    }
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
              <Avatar
                sx={{ height: "30px", width: "30px" }}
                src={profilePicture[0]?.imageUrl}
              />
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
          <Avatar
            sx={{ width: 80, height: 80, margin: "auto" }}
            src={profilePicture[0]?.imageUrl}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {userName}
          </Typography>
          <Typography variant="body1">{role}</Typography>
          <Typography variant="body2">{email}</Typography>
          {/* Add update functionality here */}
        </Box>

        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      </CustomModal>
    </>
  );
};

export default UserPopover;
