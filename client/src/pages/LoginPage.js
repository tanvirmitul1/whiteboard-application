import React, { useState, useEffect, useCallback } from "react";
import { useLoginMutation } from "../Apis/userApiSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TypingGame from "../components/TypingGame";
import { useDispatch } from "react-redux";
import { setProfilePicture, setUser } from "../slices/authSlice";
import { motion } from "framer-motion"; // For animations

const LoginPage = () => {
  const [username, setUsername] = useState("mitul");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userId } = useAuth();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      navigate("/create-drawing");
    }
  }, [navigate, userId]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setShowLoading(true);

      try {
        const response = await login({ username, password }).unwrap();
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        localStorage.setItem("imageUrl", response.user?.imageUrl);
        dispatch(setUser(response.user));
        dispatch(setProfilePicture(response.user?.imageUrl));

        toast.success("Login successful!");

        setTimeout(() => {
          navigate("/create-drawing");
        }, 500);
      } catch (errors) {
        const errorMessage =
          errors?.data?.message ||
          errors?.data?.errors[0]?.msg ||
          "Error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        setShowLoading(false);
      }
    },
    [username, password, login, navigate]
  );

  useEffect(() => {
    let timer;
    if (showLoading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLoading(false);
    }
    return () => clearInterval(timer);
  }, [showLoading, countdown]);

  return (
    <FormContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <EditCalendarIcon sx={{ color: "#ff6f61", fontSize: 50 }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Color Board
            </motion.h1>
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
          <ButtonWrapper>
            <Button type="submit">
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  <span> Processing...</span>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span>Login</span>
                </Box>
              )}
            </Button>
          </ButtonWrapper>
        </form>
        {error && <Error>{error}</Error>}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            No account?{" "}
            <Link
              to="/register"
              style={{ color: "#ff6f61", textDecoration: "none" }}
            >
              Go to register page
            </Link>
          </span>
        </div>
        {showLoading && (
          <LoadingModal>
            <h2>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              <span> Processing...</span>
            </h2>
            <h5>Please wait for Server to process your request</h5>
            <p>Estimated wait time: {countdown}s</p>
            <TypingGame />
          </LoadingModal>
        )}
      </motion.div>
    </FormContainer>
  );
};

export const FormContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  position: relative;
  overflow: hidden;
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
    animation: fadeIn 1s ease-in-out;
  }

  h1 {
    font-size: 3rem;
    text-transform: uppercase;
    font-weight: 700;
    background: linear-gradient(45deg, #ff6f61, #ffcc00);
    -webkit-background-clip: text;
    color: transparent;
  }

  form {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 400px;
    margin: 10px;
    animation: slideIn 1s ease-out;
  }

  input {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.5rem;
    color: white;
    font-size: 1.1rem;
    transition: border-color 0.3s ease, transform 0.3s ease;
    margin-bottom: 1rem;
    width: 100%;

    &:focus {
      border-color: #ff6f61;
      outline: none;
      transform: scale(1.05);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  button {
    background: linear-gradient(45deg, #ff6f61, #ffcc00);
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
    }
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  input {
    width: 100%;
  }

  button {
    position: absolute;
    right: 10px;
    top: 9px;
    color: white;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const Error = styled.div`
  color: #ff6f61;
  font-weight: bold;
  text-align: center;
`;

const LoadingModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 500px;

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #ff6f61;
  }

  h5 {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export default LoginPage;
