import React, { useState, useEffect } from "react";
import { Box, Button, Slider, TextField, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { drawShape } from "../../utils/drawFunctions";
import { setShapes } from "../../slices/canvasSlice";
import { resizeShape } from "../../utils/resizeShape";
import { Add, Remove } from "@mui/icons-material"; // For the increase/decrease buttons

const RightSideBar = ({ shapeType, selectedShapeIndex, canvasRef }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  const selectedShape = shapes[selectedShapeIndex];
  const initialState = {
    shapeSize: 50,
    fontSize: selectedShape?.fontSize || 12,
  };

  const [size, setSize] = useState(initialState.shapeSize);
  const [fontSize, setFontSize] = useState(initialState.fontSize);

  useEffect(() => {
    if (selectedShapeIndex !== null) {
      let calculatedSize = initialState.shapeSize;

      switch (selectedShape?.type) {
        case "line":
          calculatedSize = calculateLineSize(selectedShape);
          break;

        case "circle":
          calculatedSize = calculateCircleSize(selectedShape);
          break;

        case "rectangle":
          calculatedSize = calculateRectangleSize(selectedShape);
          break;

        case "triangle":
          calculatedSize = calculateTriangleSize(selectedShape);
          break;

        case "pentagon":
          calculatedSize = calculatePentagonSize(selectedShape);
          break;

        case "hexagon":
          calculatedSize = calculateHexagonSize(selectedShape);
          break;

        case "text":
          setFontSize(selectedShape?.fontSize);
          return; // No size calculation needed for text
        default:
          break;
      }

      setSize(calculatedSize);
    }
  }, [selectedShapeIndex, shapes]);

  const calculateLineSize = (shape) => {
    return Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    );
  };

  const calculateCircleSize = (shape) => {
    const radius =
      Math.sqrt(
        Math.pow(shape.end.x - shape.start.x, 2) +
          Math.pow(shape.end.y - shape.start.y, 2)
      ) / 2;
    return radius * 2; // Diameter
  };

  const calculateRectangleSize = (shape) => {
    const rectWidth = shape.end.x - shape.start.x;
    const rectHeight = shape.end.y - shape.start.y;
    return Math.max(rectWidth, rectHeight); // Use max of width or height for resizing
  };

  const calculateTriangleSize = (shape) => {
    return Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    );
  };

  const calculatePentagonSize = (shape) => {
    return Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    );
  };

  const calculateHexagonSize = (shape) => {
    return Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    );
  };

  const handleResize = (event, newSize) => {
    if (selectedShapeIndex === null) return;

    const updatedShape = resizeShape(shapes[selectedShapeIndex], newSize);
    dispatch(
      setShapes(
        shapes.map((shape, index) =>
          index === selectedShapeIndex ? updatedShape : shape
        )
      )
    );

    drawAllShapes(); // Redraw with new size
  };

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...shapes].reverse().forEach((shape) => drawShape(ctx, shape));
  };

  const handleSizeChange = (event) => {
    const newSize = event.target.value ? parseInt(event.target.value) : size;
    setSize(newSize);
    handleResize(null, newSize);
  };

  const increaseSize = () => {
    setSize(size + 5); // Increase the size by 5
    handleResize(null, size + 5);
  };

  const decreaseSize = () => {
    setSize(size - 5); // Decrease the size by 5
    handleResize(null, size - 5);
  };

  return (
    <Box
      sx={{
        color: "white",
        backgroundColor: "#131324",
        p: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {selectedShapeIndex !== null && (
        <>
          <Box sx={{ margin: "0 auto" }}>{selectedShape?.type}</Box>

          {shapes?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {shapeType === "text" ? (
                <>
                  <p>Font Size: {fontSize}</p>
                  <Slider
                    value={fontSize}
                    min={8}
                    max={72}
                    step={1}
                    onChange={(e, newValue) => setFontSize(newValue)}
                    sx={{ width: "100%" }}
                  />
                </>
              ) : (
                <>
                  <Slider
                    value={size}
                    min={1}
                    step={1}
                    onChange={handleResize}
                    sx={{ width: "90%" }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <IconButton onClick={decreaseSize} color="primary">
                      <Remove />
                    </IconButton>
                    <TextField
                      value={size}
                      onChange={handleSizeChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      sx={{ width: "60px", mx: 1 }}
                    />
                    <IconButton onClick={increaseSize} color="primary">
                      <Add />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RightSideBar;
