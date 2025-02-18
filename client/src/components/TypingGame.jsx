import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { words } from "../utils/constants";

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [randomWord, setRandomWord] = useState("");
  const [message, setMessage] = useState("");
  const [previousWord, setPreviousWord] = useState(""); // Track the previous word

  useEffect(() => {
    generateRandomWord();
  }, []);

  const generateRandomWord = () => {
    let newWord;
    do {
      const randomIndex = Math.floor(Math.random() * words.length);
      newWord = words[randomIndex];
    } while (newWord === previousWord); // Ensure the new word is different from the previous one

    setRandomWord(newWord);
    setPreviousWord(newWord); // Update the previous word
  };

  const handleInputChange = (e) => {
    const inputWord = e.target.value;
    setTypedWord(inputWord);

    if (inputWord.toLowerCase() === randomWord.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setMessage("Great job! 🎉");
      setTypedWord("");
      generateRandomWord(); // Generate a new word after success
    } else if (inputWord.length >= randomWord.length) {
      setScore((prevScore) => prevScore - 1);
      setMessage("Oops! Try again. 😅");
      setTypedWord("");
      generateRandomWord(); // Generate a new word after failure
    }
  };

  return (
    <GameContainer>
      <h3>Mini Typing Challenge:</h3>
      <p>
        Type: <b style={{ color: "#4e0eff" }}>{randomWord}</b>
      </p>

      <Score>Score: {score}</Score>
      {message && (
        <Message color={message.includes("Great") ? "green" : "red"}>
          {message}
        </Message>
      )}
      <input
        type="text"
        placeholder="Type here..."
        value={typedWord}
        onChange={handleInputChange}
      />
    </GameContainer>
  );
};

const GameContainer = styled.div`
  margin-top: 2rem;
  text-align: center;

  input {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: 2px solid #4e0eff;
    text-align: center;
    font-size: 1rem;
    color: white;
    background-color: transparent;

    &:focus {
      outline: none;
      border-color: #997af0;
    }
  }
`;

const Message = styled.p`
  color: ${(props) => props.color};
  font-weight: bold;
  margin-top: 1rem;
`;

const Score = styled.p`
  color: #4e0eff;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

export default TypingGame;
