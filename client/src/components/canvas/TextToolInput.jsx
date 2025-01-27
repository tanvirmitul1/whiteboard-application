import React from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";

const TextToolInput = ({
  textInput,
  canvasScale,
  setTextInput,
  onShapesUpdate,
  drawColor,
  fillColor,
}) => {
  const shapes = useSelector((state) => state.canvas.shapes);
  const dispatch = useDispatch();
  if (!textInput) return null;
  const handleTextSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      if (textInput && textInput.value.trim() !== "") {
        const newTextShape = {
          type: "text",
          text: textInput.value,
          position: { x: textInput.x, y: textInput.y },
          color: drawColor,
          fill: fillColor,
          fontSize: 20,
        };

        const updatedShapes = [newTextShape, ...shapes];
        dispatch(setShapes(updatedShapes));
        onShapesUpdate(updatedShapes);
      }
      setTextInput(null);
    }
  };

  const handleTextInput = (e) => {
    setTextInput({ ...textInput, value: e.target.value });
  };

  return (
    <TextField
      placeholder="Enter text"
      autoFocus
      value={textInput.value}
      onChange={handleTextInput}
      onKeyDown={handleTextSubmit}
      onBlur={handleTextSubmit}
      sx={{
        position: "absolute",
        top: `${textInput.y / canvasScale.y}px`,
        left: `${textInput.x / canvasScale.x}px`,
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default TextToolInput;
