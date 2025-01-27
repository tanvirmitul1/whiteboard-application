/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../index.css";
import Swal from "sweetalert2";
import {
  distance,
  drawCurrentShape,
  drawPen,
  drawShape,
  isPointInShape,
} from "../utils/drawFunctions";
import { handleKeyDown } from "../utils/keyHandlers";
import { getShapeCoordinates, setCanvasCursor } from "../utils/otherFunctions";
import ShapeContextBar from "./context/ShapeContextBar";
import { setShapes } from "../slices/canvasSlice";
import { useDispatch, useSelector } from "react-redux";

const Whiteboard = ({
  shapeType,
  onShapesUpdate,
  drawColor,
  backgroundColor,
  fillColor,
  setFillColor,
  isFillColorActive,
}) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  console.log({ shapes });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState({ x: 1, y: 1 });
  const [textInput, setTextInput] = useState(null);
  const [currentPenPath, setCurrentPenPath] = useState([]);
  const [copiedShape, setCopiedShape] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const setCanvasSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      setCanvasScale({
        x: canvas.width / container.clientWidth,
        y: canvas.height / container.clientHeight,
      });

      drawAllShapes();
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => window.removeEventListener("resize", setCanvasSize);
  }, [shapeType, shapes, drawColor]);

  const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const mousePos = getMousePosition(canvas, e);
    const ctx = canvas.getContext("2d");
    setStartPoint(mousePos);

    if (shapeType === "pen") {
      setIsDrawing(true);
      setCurrentPenPath([mousePos]); // Start the pen path
    } else {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, mousePos, shape)
      );
      if (shapeIndex !== -1) {
        setSelectedShapeIndex(shapeIndex);
        setIsMoving(true);
      } else {
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && !isMoving) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mousePos = getMousePosition(canvas, e);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();

    if (isDrawing && shapeType === "pen") {
      setCurrentPenPath([...currentPenPath, mousePos]);
      drawPen(ctx, currentPenPath);
    } else if (isDrawing && shapeType !== "eraser") {
      drawCurrentShape(ctx, startPoint, mousePos, shapeType, drawColor);
    } else if (isMoving && selectedShapeIndex !== null) {
      moveShape(mousePos);
    }
  };

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mousePos = getMousePosition(canvas, e);

    if (isMoving && selectedShapeIndex !== null) {
      setIsMoving(false);
    } else if (shapeType === "eraser") {
      const updatedShapes = shapes.filter(
        (shape) => !isPointInShape(ctx, mousePos, shape)
      );

      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    } else if (shapeType === "pen") {
      const newPenShape = {
        type: "pen",
        path: currentPenPath,
        color: drawColor,
        fill: fillColor,
      };
      const updatedShapes = [newPenShape, ...shapes];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
      setIsDrawing(false);
      setCurrentPenPath([]);
    } else if (shapeType === "text") {
      setTextInput({ x: mousePos.x, y: mousePos.y, value: "" });
    } else if (isDrawing) {
      const newShape = {
        type: shapeType,
        start: startPoint,
        end: mousePos,
        color: drawColor,
        fill: fillColor,
      };
      const updatedShapes = [newShape, ...shapes];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    }

    setIsDrawing(false);
  };

  const handleTextInput = (e) => {
    setTextInput({ ...textInput, value: e.target.value });
  };

  const handleTextSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      if (textInput && textInput.value.trim() !== "") {
        const newTextShape = {
          type: "text",
          text: textInput.value,
          position: { x: textInput.x, y: textInput.y },
          color: drawColor,
          fill: fillColor,
        };

        const updatedShapes = [newTextShape, ...shapes];
        dispatch(setShapes(updatedShapes));
        onShapesUpdate(updatedShapes);
      }
      setTextInput(null);
    }
  };

  const moveShape = (mousePos) => {
    const updatedShapes = shapes.map((shape, index) => {
      if (index === selectedShapeIndex) {
        if (shape.type === "pen") {
          // Move the entire pen path
          const newPath = shape.path.map((point) => ({
            x: point.x + (mousePos.x - startPoint.x),
            y: point.y + (mousePos.y - startPoint.y),
          }));
          return { ...shape, path: newPath };
        } else if (shape.type === "text") {
          // Move the text position
          return {
            ...shape,
            position: {
              x: shape.position.x + (mousePos.x - startPoint.x),
              y: shape.position.y + (mousePos.y - startPoint.y),
            },
          };
        } else {
          return {
            ...shape,
            start: {
              x: shape.start.x + (mousePos.x - startPoint.x),
              y: shape.start.y + (mousePos.y - startPoint.y),
            },
            end: {
              x: shape.end.x + (mousePos.x - startPoint.x),
              y: shape.end.y + (mousePos.y - startPoint.y),
            },
          };
        }
      }
      return shape;
    });

    setStartPoint(mousePos);
    dispatch(setShapes(updatedShapes));
    onShapesUpdate(updatedShapes);

    const canvasElement = document.querySelector("canvas");
    if (canvasElement) {
      canvasElement.style.cursor = "move";
    }
  };

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...shapes].reverse().forEach((shape) => drawShape(ctx, shape));
  };

  const clearCanvas = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear this drawing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dispatch(setShapes([]));
      onShapesUpdate([]);
      localStorage.removeItem("shapes");
    }
  };

  //mobile touchevent
  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const touchPos = getTouchPosition(canvas, e);
    setStartPoint(touchPos);

    if (shapeType === "pen") {
      setIsDrawing(true);
      setCurrentPenPath([touchPos]); // Start the pen path
    } else {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, touchPos, shape)
      );
      if (shapeIndex !== -1) {
        setSelectedShapeIndex(shapeIndex);
        setIsMoving(true);
      } else {
        setIsDrawing(true);
      }
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while drawing
    if (!isDrawing && !isMoving) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const touchPos = getTouchPosition(canvas, e);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();

    if (isDrawing && shapeType === "pen") {
      setCurrentPenPath([...currentPenPath, touchPos]);
      drawPen(ctx, currentPenPath);
    } else if (isDrawing && shapeType !== "eraser") {
      drawCurrentShape(ctx, startPoint, touchPos, shapeType, drawColor);
    } else if (isMoving && selectedShapeIndex !== null) {
      moveShape(touchPos);
    }
  };

  const handleTouchEnd = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const touchPos = getTouchPosition(canvas, e);

    if (isMoving && selectedShapeIndex !== null) {
      setIsMoving(false);
    } else if (shapeType === "eraser") {
      const updatedShapes = shapes.filter(
        (shape) => !isPointInShape(ctx, touchPos, shape)
      );
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    } else if (shapeType === "pen") {
      const newPenShape = {
        type: "pen",
        path: currentPenPath,
        color: drawColor,
      };
      const updatedShapes = [...shapes, newPenShape];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
      setIsDrawing(false);
      setCurrentPenPath([]);
    } else if (shapeType === "text") {
      setTextInput({ x: touchPos.x, y: touchPos.y, value: "" });
    } else if (isDrawing) {
      const newShape = {
        type: shapeType,
        start: startPoint,
        end: touchPos,
        color: drawColor,
      };
      const updatedShapes = [...shapes, newShape];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    }

    setIsDrawing(false);
  };

  const getTouchPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();

    // Use event.touches for touchstart and touchmove, use event.changedTouches for touchend
    const touch = event.touches[0] || event.changedTouches[0];

    if (!touch) {
      return null; // Ensure the function doesn't break if there's no touch
    }

    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  useEffect(() => {
    const keyDownHandler = (event) =>
      handleKeyDown(
        event,
        selectedShapeIndex,
        copiedShape,
        setCopiedShape,
        drawAllShapes
      );

    window.addEventListener("keydown", keyDownHandler);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [selectedShapeIndex, shapes, copiedShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvasCursor(canvas, shapeType);
  }, [shapeType, shapes.length]);

  // useEffect(() => {
  //   if (selectedShapeIndex !== null) {
  //     const updatedShapes = shapes.map((shape, index) => {
  //       if (index === selectedShapeIndex) {
  //         return { ...shape, selected: true };
  //       }
  //       return shape;
  //     });

  //     setShapes(updatedShapes);
  //     drawAllShapes();
  //   }
  // }, [selectedShapeIndex]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    e.preventDefault();
    const mousePos = getMousePosition(canvasRef.current, e);

    const shapeIndex = shapes.findIndex((shape) =>
      isPointInShape(ctx, mousePos, shape)
    );
    const selectedShape = shapes[shapeIndex];

    if (shapeIndex !== -1) {
      setSelectedShapeIndex(shapeIndex);
      setContextMenu(getShapeCoordinates(selectedShape, mousePos));
    } else {
      closeContextMenu();
    }
  };

  const closeContextMenu = () =>
    setContextMenu({ ...contextMenu, visible: false });

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "80vh",
        position: "relative",
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="canvas-style"
        style={{ backgroundColor: backgroundColor }}
        onContextMenu={handleContextMenu}
      />
      <ShapeContextBar
        contextMenu={contextMenu}
        closeContextMenu={closeContextMenu}
        selectedShapeIndex={selectedShapeIndex}
        copiedShape={copiedShape}
        setCopiedShape={setCopiedShape}
        drawAllShapes={drawAllShapes}
        onShapesUpdate={onShapesUpdate}
        canvasScale={canvasScale}
      />
      {/* Watercolor Mark */}

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#b8b0b0",
          fontWeight: "bold",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          opacity: ".1",
          pointerEvents: "none",
        }}
      >
        mitul@seopage1.net
      </Typography>

      {/* Text Input for Text Tool */}
      {textInput && (
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
      )}

      {/* Clear Button */}
      <Button
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          textTransform: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        variant="contained"
        color="error"
        size="small"
        onClick={clearCanvas}
        disabled={shapes.length === 0}
      >
        Clear
      </Button>
    </Box>
  );
};

export default Whiteboard;
