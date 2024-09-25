import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import { Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import styled from "styled-components";
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
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <EditCalendarIcon sx={{ color: "#ea05ff", fontSize: 50 }} />
          <h1>Chalk Board</h1>
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
          className="filter-user-select"
        >
          <MenuItem value="User" className="filter-user-list">
            User
          </MenuItem>
        </Select>
        {error && <Error>{error}</Error>}
        <button type="submit" disabled={isLoading}>
          Register
        </button>
        <div>
          <Links href="/login">Already have an account? Sign in here.</Links>
          <Links href="/change-password">Change Password?</Links>
        </div>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  overflow: hidden;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

const Error = styled.div`
  color: red;
`;

const Links = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: blue;
`;

export default RegisterPublic;
