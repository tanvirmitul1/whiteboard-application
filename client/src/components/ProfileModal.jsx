import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  useProfilePictureUploadMutation,
  useUpdateUserMutation,
} from "../Apis/userApiSlice";
import { setProfilePicture, setUser } from "../slices/authSlice";
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
  const theme = useTheme(); // Get theme from MUI
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [uploadProfilePicture, { isLoading }] =
    useProfilePictureUploadMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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
      toast.success("Profile image uploaded successfully!");
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

  const handleUpdateUser = async () => {
    setIsEditingName(false);
    updateUser({ userId, username: name })
      .unwrap()
      .then((response) => {
        toast.success("User updated successfully!");
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch(setUser(response.user));
      })
      .catch(() => {
        toast.error("Update failed. Please try again.");
      });
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
              border: `4px solid ${theme.palette.primary.main}`,
              transition: "0.3s",
              boxShadow: `0px 4px 10px ${theme.palette.grey[800]}`,
            }}
            src={preview || profilePicture}
          />
        </motion.div>

        {isEditingName ? (
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleUpdateUser}
            autoFocus
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              mb: 2,
              fontWeight: "bold",
              cursor: "pointer",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.text.primary,
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
              },
            }}
          />
        ) : (
          <Tooltip title="Click to change" arrow>
            <Typography
              variant="h4"
              sx={{ mt: 2, fontWeight: "bold", cursor: "pointer" }}
              onClick={() => setIsEditingName(true)}
            >
              {name}
            </Typography>
          </Tooltip>
        )}

        <Typography variant="body1">{role}</Typography>
        <Typography variant="body2" color="text.secondary">
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
                sx={{ display: "flex", justifyContent: "center", gap: 1 }}
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
