import React, { useState, useEffect, useCallback } from "react";
import { useLoginMutation } from "../Apis/userApiSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

const LoginPage = () => {
  const [username, setUsername] = useState("mitul");
  const [password, setPassword] = useState("12345678");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userId } = useAuth();
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [typedWord, setTypedWord] = useState("");
  const [randomWord, setRandomWord] = useState("");

  const words = ["React", "Node", "MongoDB", "Canvas", "Drawing"];

  useEffect(() => {
    if (userId) {
      navigate("/create-drawing");
    }
  }, [navigate, userId]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setShowLoading(true);
      setRandomWord(words[Math.floor(Math.random() * words.length)]); // Set random word for game

      try {
        const response = await login({ username, password }).unwrap();
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
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
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <EditCalendarIcon sx={{ color: "#ea05ff", fontSize: 50 }} />
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Login"}
        </button>
      </form>
      {error && <Error>{error}</Error>}

      {showLoading && (
        <LoadingModal>
          <h2>Logging in...</h2>
          <p>Estimated wait time: {countdown}s</p>
          <h3>Mini Typing Challenge:</h3>
          <p>
            Type: <b>{randomWord}</b>
          </p>
          <input
            type="text"
            placeholder="Type here..."
            value={typedWord}
            onChange={(e) => setTypedWord(e.target.value)}
          />
          {typedWord.toLowerCase() === randomWord.toLowerCase() && (
            <p style={{ color: "green" }}>Great job! 🎉</p>
          )}
        </LoadingModal>
      )}
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

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #00000076;
    border-radius: 1rem;
    padding: 3rem;
  }

  input {
    background-color: transparent;
    padding: 0.8rem;
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
    padding: 0.8rem 1.5rem;
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
`;

const Error = styled.div`
  color: red;
  margin-top: 1rem;
`;

const LoadingModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0px 0px 10px #4e0eff;

  h2 {
    margin-bottom: 1rem;
  }

  input {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
    text-align: center;
  }
`;

export default LoginPage;
