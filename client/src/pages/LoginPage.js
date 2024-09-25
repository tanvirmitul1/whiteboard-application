import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../Apis/userApiSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import Logo from "../files/logo.svg";

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

  const handleSubmit = async (e) => {
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
      toast.error(error);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <img src={Logo} alt="logo" />
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
        <button type="submit" disabled={isLoading}>
          Log In
        </button>
        <Links>
          <Link to="/register/public">
            Don't have an account? Register here.
          </Link>
          <Link to="/change-password">Change Password?</Link>
        </Links>
      </form>
      {error && <Error>{error}</Error>}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;

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
  margin-top: 1rem;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

export default LoginPage;
