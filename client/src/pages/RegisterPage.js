import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import { Select, MenuItem, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Error, FormContainer } from "./LoginPage";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          <MenuItem value="User">User</MenuItem>
        </Select>
        {error && <Error>{error}</Error>}
        <Button type="submit">
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
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
