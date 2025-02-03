import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";

const fontSizes = [12, 16, 20, 24, 28, 32, 40];

const TextToolInput = ({
  canvasRef,
  textInput,
  canvasScale,
  setTextInput,
  onShapesUpdate,
  drawColor,
  fillColor,
}) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (textInput) {
      setFontSize(textInput.fontSize || 20);
    }
  }, [textInput]);

  if (!textInput || !canvasRef.current) return null;

  // Ensure text bar stays inside canvas boundaries
  const canvasWidth = canvasRef.current.width;
  const canvasHeight = canvasRef.current.height;
  const safeX = Math.min(
    Math.max(10, textInput.x / canvasScale.x),
    canvasWidth - 120
  );
  const safeY = Math.min(
    Math.max(10, textInput.y / canvasScale.y),
    canvasHeight - 40
  );

  const handleTextSubmit = () => {
    if (textInput.value.trim() !== "") {
      const newTextShape = {
        type: "text",
        text: textInput.value,
        position: { x: safeX, y: safeY },
        color: drawColor,
        fill: fillColor,
        fontSize,
      };

      const updatedShapes = [newTextShape, ...shapes];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
      setTextInput(null);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${safeY}px`,
        left: `${safeX}px`,
        transform: "translate(-50%, -50%)",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 1000,
      }}
      onMouseDown={(e) => e.stopPropagation()} // Prevent blur when clicking inside
    >
      <TextField
        placeholder="Enter text"
        autoFocus
        value={textInput.value}
        onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
        sx={{
          flexGrow: 1,
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      />

      <FormControl size="small" sx={{ minWidth: 60 }}>
        <InputLabel>Size</InputLabel>
        <Select
          value={fontSize}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => setFontSize(e.target.value)}
        >
          {fontSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}px
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton color="success" onClick={handleTextSubmit}>
        <Check />
      </IconButton>

      <IconButton color="error" onClick={() => setTextInput(null)}>
        <Close />
      </IconButton>
    </div>
  );
};

export default TextToolInput;
