import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const RegisterPage = () => {
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
      setSuccess(`User ${response.username} created successfully!`);

      // Redirect after success
      toast.success(`User ${response.username} created successfully!`);
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setError(error.data?.message || "Error creating user");
    }
  };

  return (
    <Box
      sx={{
        // backgroundImage: `url('https://img.freepik.com/premium-photo/hand-holding-warning-sign-with-word-ai-holographic-text-against-dark-background_778772-3774.jpg?w=826')`,
        // backgroundSize: "55%",
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
        sx={{ marginTop: "-100px", marginBottom: "20px", color: "white" }}
      >
        Chalk Board Application
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
          <MenuItem value="Admin">Admin</MenuItem>
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
            "Create User"
          )}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" sx={{ mt: 1 }}>
            {success}
          </Typography>
        )}
      </Box>

      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 3, width: "400px" }}
        onClick={() => navigate(-1)}
      >
        Don't want to register? Go Back to Previous Page
      </Button>
    </Box>
  );
};

export default RegisterPage;
