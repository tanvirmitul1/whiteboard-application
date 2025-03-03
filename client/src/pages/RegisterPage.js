import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import {
  Select,
  MenuItem,
  Button,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Error, FormContainer, PasswordWrapper } from "./LoginPage";
import { motion } from "framer-motion"; // For animations
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await createUser({ username, password, role }).unwrap();
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success(`User ${response.user.username} created successfully!`);
      setTimeout(() => navigate("/create-drawing"), 500);
    } catch (errors) {
      setError(errors?.data?.message || errors?.data?.errors[0]?.msg);
    }
  };

  return (
    <FormContainer height="100vh">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <EditCalendarIcon sx={{ color: "#ff6f61", fontSize: 50 }} />
            <h1>Color Board</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PasswordWrapper>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconButton
              sx={{ padding: 0, height: "30px" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </PasswordWrapper>

          <PasswordWrapper>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <IconButton
              sx={{ padding: 0, height: "30px" }}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </PasswordWrapper>
          {/* <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="User">User</MenuItem>
        </Select> */}
          {error && <Error>{error}</Error>}
          <Button type="submit">
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </motion.div>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#ff6f61", textDecoration: "none" }}>
            Go to Login
          </Link>
        </span>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;
