import { useState } from "react";
import {
  TextField,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";
const TextEditor = ({ selectedShape, selectedShapeIndex }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  const [fontSize, setFontSize] = useState(selectedShape?.fontSize || 14);
  const [format, setFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const handleTextChange = (e) => {
    const updatedShapes = [...shapes];
    updatedShapes[selectedShapeIndex] = {
      ...selectedShape,
      text: e.target.value,
    };
    dispatch(setShapes(updatedShapes));
  };

  const handleFontSizeChange = (event, newSize) => {
    setFontSize(newSize);
    const updatedShapes = [...shapes];
    updatedShapes[selectedShapeIndex] = {
      ...selectedShape,
      fontSize: newSize,
    };
    dispatch(setShapes(updatedShapes));
  };

  const handleFormatChange = (event, newFormats) => {
    setFormat({
      bold: newFormats.includes("bold"),
      italic: newFormats.includes("italic"),
      underline: newFormats.includes("underline"),
    });

    const updatedShapes = [...shapes];
    updatedShapes[selectedShapeIndex] = {
      ...selectedShape,
      fontWeight: newFormats.includes("bold") ? "bold" : "normal",
      fontStyle: newFormats.includes("italic") ? "italic" : "normal",
      textDecoration: newFormats.includes("underline") ? "underline" : "none",
    };
    dispatch(setShapes(updatedShapes));
  };

  return (
    <div>
      <TextField
        fullWidth
        multiline
        sx={{
          "& .MuiInputBase-input": {
            textAlign: "center",
            color: selectedShape?.color || "white",
            fontSize: `${fontSize}px`,
            fontWeight: format.bold ? "bold" : "normal",
            fontStyle: format.italic ? "italic" : "normal",
            textDecoration: format.underline ? "underline" : "none",
            width: "90%",
            height: "20px",
            maxHeight: "50px",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray", // Change border color to white
            },
          },
        }}
        value={selectedShape.text}
        onChange={handleTextChange}
      />

      <p
        style={{
          fontSize: "0.75rem",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}
      >
        Font Size: {fontSize}
      </p>
      <Slider
        value={fontSize}
        min={8}
        max={50}
        step={1}
        onChange={handleFontSizeChange}
        sx={{ width: "100%", height: "4px" }}
      />

      <ToggleButtonGroup
        value={Object.keys(format).filter((key) => format[key])}
        onChange={handleFormatChange}
        aria-label="text formatting"
        fullWidth
        sx={{
          marginTop: "0.5rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <ToggleButton value="bold" aria-label="bold" sx={{ color: "#ff6f61" }}>
          <FormatBold />
        </ToggleButton>
        <ToggleButton
          value="italic"
          aria-label="italic"
          sx={{ color: "#ff6f61" }}
        >
          <FormatItalic />
        </ToggleButton>
        <ToggleButton
          value="underline"
          aria-label="underline"
          sx={{ color: "#ff6f61" }}
        >
          <FormatUnderlined />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default TextEditor;
