import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const RegisterPublic = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userData = { username, password, role };

    try {
      const response = await createUser(userData).unwrap();
      localStorage.setItem("user", JSON.stringify(response.user));
      setSuccess(`User ${response.user.username} created successfully!`);
      toast.success(`User ${response.user.username} created successfully!`);
      setTimeout(() => navigate("/create-drawing"), 500);
    } catch (errors) {
      setError(errors?.data?.message || errors?.data?.errors[0]?.msg);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/hand-holding-warning-sign-with-word-ai-holographic-text-against-dark-background_778772-3774.jpg?w=826')`,
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h3"
        sx={{ marginTop: "-100px", marginBottom: "20px" }}
      >
        Whiteboard Application
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          gap: 3,
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          variant="outlined"
          displayEmpty
        >
          <MenuItem value="User">User</MenuItem>
          {/* <MenuItem value="Admin">Admin</MenuItem> */}
        </Select>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          fullWidth
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
            "Register"
          )}
        </Button>

        <Box textAlign="center" mt={2}>
          <Link to="/login" variant="body2" sx={{ textDecoration: "none" }}>
            Already have an account? Sign in here.
          </Link>
        </Box>

        {/* Always render these Typography elements and control visibility */}
        <Typography
          color="error"
          sx={{
            mt: 1,
            visibility: error ? "visible" : "hidden",
            minHeight: "14px", // Reserve space for 1 line
          }}
        >
          {error || ""}
        </Typography>

        <Typography
          color="success"
          sx={{
            mt: 1,
            visibility: success ? "visible" : "hidden",
            minHeight: "14px",
          }}
        >
          {success || ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPublic;
