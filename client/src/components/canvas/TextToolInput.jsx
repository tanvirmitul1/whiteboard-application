import React, { useState, useEffect } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "@mui/material/styles";
const TextToolInput = ({
  canvasRef,
  textInput,
  canvasScale,
  setTextInput,
  onShapesUpdate,
  drawColor,
  fillColor,
  setShapeType,
}) => {
  const theme = useTheme(); // Access the theme
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
        uuid: uuidv4(),
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
      setShapeType(null);
    }
  };

  return (
    <form // eslint-disable-line
      onSubmit={(e) => {
        e.preventDefault();
        handleTextSubmit();
      }}
      style={{
        position: "absolute",
        top: `${safeY}px`,
        left: `${safeX}px`,
        transform: "translate(-50%, -50%)",
        backgroundColor: theme.palette.background.paper, // Use theme background color
        boxShadow: theme.shadows[4], // Use theme shadow
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        zIndex: 1000,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <TextField
        placeholder="Enter text"
        autoFocus
        value={textInput.value}
        onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default, // Use theme background color
          borderRadius: "5px",
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary, // Use theme text color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme.palette.divider, // Use theme border color
            },
            "&:hover fieldset": {
              borderColor: theme.palette.primary.main, // Use theme primary color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main, // Use theme primary color on focus
            },
          },
        }}
      />

      <Box display={"flex"} flexDirection={"column"}>
        <IconButton sx={{ padding: 0 }} type="submit" color="success">
          <Check />
        </IconButton>

        <IconButton
          sx={{ padding: 0 }}
          color="error"
          onClick={() => {
            setTextInput(null);
            setShapeType(null);
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </form>
  );
};

export default TextToolInput;
