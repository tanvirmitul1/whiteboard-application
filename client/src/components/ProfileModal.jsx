import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { useProfilePictureUploadMutation } from "../Apis/userApiSlice";
import { setProfilePicture } from "../slices/authSlice";
import CustomModal from "./modal/CustomModal";

const ProfileModal = ({
  open,
  onClose,
  userName,
  role,
  email,
  profilePicture,
  userId,
}) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProfilePicture, { isLoading }] =
    useProfilePictureUploadMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", userId);

    try {
      const response = await uploadProfilePicture(formData).unwrap();
      dispatch(setProfilePicture(response.imageUrl));
      localStorage.setItem("imageUrl", response.imageUrl);
      toast.success("Profile picture uploaded successfully!");
      setImage(null);
      setPreview(null);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleSkip = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Profile">
      <Box sx={{ textAlign: "center", p: 3, overflowX: "hidden" }}>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              m: "auto",
              border: "4px solid #1976d2",
              transition: "0.3s",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            src={preview || profilePicture}
          />
        </motion.div>
        <Typography variant="h6" sx={{ mt: 2 }} fontWeight="bold">
          {userName}
        </Typography>
        <Typography variant="body1">{role}</Typography>
        <Typography variant="body2" color="text.disabled">
          {email}
        </Typography>

        <Box mt={3}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-file"
          />
          <label htmlFor="upload-file">
            <Button
              variant="outlined"
              color="primary"
              component="span"
              startIcon={<CameraAltIcon />}
              sx={{ textTransform: "none", mb: 2 }}
            >
              Choose Image
            </Button>
          </label>

          {preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">{image?.name}</Typography>
              <Box
                mt={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <IconButton onClick={handleSkip} color="warning">
                  <CloseIcon />
                </IconButton>
              </Box>
            </motion.div>
          )}

          <Button
            onClick={handleUpload}
            variant="contained"
            color="success"
            sx={{
              mt: 2,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
              margin: "0 auto",
            }}
            disabled={isLoading || !image}
            startIcon={
              isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />
            }
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default ProfileModal;
