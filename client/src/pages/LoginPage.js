import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../Apis/userApiSlice";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";

const LoginPage = () => {
  const [username, setUsername] = useState("tanvir");
  const [password, setPassword] = useState("tanvir");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userId } = useAuth();
  const [error, setError] = useState("");
  useEffect(() => {
    if (userId) {
      navigate("/create-drawing");
    }
  }, [navigate, userId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password }).unwrap();
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/create-drawing");
      }, 500);
    } catch (errors) {
      setError(errors?.data?.message || errors?.data?.errors[0]?.msg);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/hand-holding-warning-sign-with-word-ai-holographic-text-against-dark-background_778772-3774.jpg?w=826')`,
        backgroundSize: "55%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" sx={{ mt: -10 }}>
        Whiteboard Application
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 5,
          mb: 12,
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              Processing...
            </>
          ) : (
            "Login"
          )}
        </Button>
        <Typography
          color="error"
          sx={{
            mt: 1,
            visibility: error ? "visible" : "hidden",
            minHeight: "14px",
          }}
        >
          {error || ""}
        </Typography>
        <Box textAlign="center">
          <Link href="/change-password" variant="body2">
            Change Password?
          </Link>
        </Box>
        <Box textAlign="center">
          <Link href="/register/public" variant="body2">
            Don't have an account? Register here.
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
