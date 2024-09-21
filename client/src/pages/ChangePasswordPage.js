import React, { useState } from "react";
import { useUpdatePasswordMutation } from "../Apis/userApiSlice"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleChangePassword = async () => {
    try {
      setError("");
      setSuccess("");

      await changePassword({ currentPassword, newPassword, userName }).unwrap();
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      navigate("/");
    } catch (error) {
      setError(
        error.data?.message || "Error changing password. Please try again."
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={3}
    >
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="400px"
      >
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleChangePassword}
          disabled={isLoading}
          sx={{ marginTop: 2 }}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={20}
                sx={{ color: "white", marginRight: 1 }}
              />
              Processing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/")}
        sx={{ marginTop: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ChangePasswordPage;
