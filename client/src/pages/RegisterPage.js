import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import { Select, MenuItem, Button } from "@mui/material";
import { toast } from "react-toastify";
import styled from "styled-components";
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

    const userData = { username, password, role };

    try {
      const response = await createUser(userData).unwrap();
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(`User ${response.user.username} created successfully!`);
      setTimeout(() => navigate("/create-drawing"), 500);
    } catch (errors) {
      setError(errors?.data?.message || errors?.data?.errors[0]?.msg);
    }
  };
  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
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
        {error ? <Error>{error}</Error> : <Error />}
        <button type="submit" disabled={isLoading}>
          Register
        </button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3, width: "400px" }}
          onClick={() => navigate(-1)}
        >
          Don't want to register? Go Back to Previous Page
        </Button>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-height: 80vh;
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-bottom: 1rem;

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
    max-width: 80%;
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
  height: 10px;
`;
export default RegisterPage;
