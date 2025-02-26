import React, { useState, useEffect } from "react";
import { Box, Slider, TextField, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { drawShape } from "../../utils/drawFunctions";
import { setShapes } from "../../slices/canvasSlice";
import { getShapeSize, resizeShape } from "../../utils/resizeShape";
import { Add, Remove } from "@mui/icons-material"; // For the increase/decrease buttons
import ColorPickerComponent from "../colorPicker/ColorPickerComponent ";
import SelectedShapeChangeColor from "../colorPicker/SelectedShapeChangeColor";
import Tools from "../tools/Tools";
import ShapeIcon from "../tools/ShapeIcon";
import TextEditor from "../tools/TextEditor";
import RotateShape from "../tools/RotateShape";

const RightSideBar = ({
  shapeType,
  selectedShapeIndex,
  canvasRef,
  ...props
}) => {
  const {
    drawColor,
    setDrawColor,
    fillColor,
    setFillColor,
    backgroundColor,
    setBackgroundColor,
  } = props;
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
      const calculatedSize = getShapeSize(selectedShape);
      if (selectedShape?.type === "text") {
        setFontSize(selectedShape?.fontSize);
      } else {
        setSize(calculatedSize);
      }
    }
  }, [selectedShapeIndex, shapes]);

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

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...shapes].reverse().forEach((shape) => drawShape(ctx, shape));
  };

  return (
    <Box
      sx={{
        color: "white",
        backgroundColor: "#131324",
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      <ColorPickerComponent {...props} />

      {selectedShapeIndex !== null && (
        <>
          {shapes?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {" "}
              <Box sx={{ mb: 0.5 }}>
                <ShapeIcon
                  selectedShape={selectedShape}
                  selectedShapeIndex={selectedShapeIndex}
                />
              </Box>
              {selectedShape?.type !== "text" &&
                selectedShape?.type !== "pen" && (
                  <RotateShape
                    selectedShape={selectedShape}
                    selectedShapeIndex={selectedShapeIndex}
                    drawAllShapes={drawAllShapes}
                  />
                )}
            </Box>
          )}

          {shapes?.length > 0 && selectedShape?.type !== "pen" && (
            <Box>
              {selectedShape?.type === "text" ? (
                <TextEditor
                  selectedShapeIndex={selectedShapeIndex}
                  selectedShape={selectedShape}
                />
              ) : (
                <>
                  <Slider
                    value={size}
                    min={8}
                    max={1000}
                    step={1}
                    onChange={handleResize}
                    sx={{
                      width: "100%",
                      height: "4px",
                      marginBottom: "10px",
                      "& .MuiSlider-thumb": {
                        width: 12,
                        height: 12,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" }, // Corrected flexDirection
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      onClick={decreaseSize}
                      color="primary"
                      size="small"
                    >
                      <Remove sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
                    </IconButton>
                    <TextField
                      value={size}
                      onChange={handleSizeChange}
                      variant="outlined"
                      size="small"
                      type="number"
                      sx={{
                        input: {
                          textAlign: "center",
                          color: "white",
                          fontSize: { xs: "12px", md: "14px" },
                          width: { xs: "60px", md: "80px" }, // Adjusted width for mobile
                        },
                      }}
                    />
                    <IconButton
                      onClick={increaseSize}
                      color="primary"
                      size="small"
                    >
                      <Add sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          )}
          {shapes?.length > 0 && (
            <>
              <SelectedShapeChangeColor
                drawAllShapes={drawAllShapes}
                selectedShape={selectedShape}
                selectedShapeIndex={selectedShapeIndex}
              />

              <Tools
                selectedShapeIndex={selectedShapeIndex}
                drawAllShapes={drawAllShapes}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default RightSideBar;
