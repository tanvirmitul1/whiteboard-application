import React, { useRef, useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "../index.css";
import Swal from "sweetalert2";
const Whiteboard = ({ shapeType, onShapesUpdate, setShapes, shapes }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState({ x: 1, y: 1 });
  const [textInput, setTextInput] = useState(null);
  const [currentPenPath, setCurrentPenPath] = useState([]); // To store pen points

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
  }, [shapeType, shapes]);

  const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const distance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const mousePos = getMousePosition(canvas, e);
    setStartPoint(mousePos);

    if (shapeType === "pen") {
      setIsDrawing(true);
      setCurrentPenPath([mousePos]); // Start the pen path
    } else {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(mousePos, shape)
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
      drawCurrentShape(ctx, startPoint, mousePos);
    } else if (isMoving && selectedShapeIndex !== null) {
      moveShape(mousePos);
    }
  };

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const mousePos = getMousePosition(canvas, e);

    if (isMoving && selectedShapeIndex !== null) {
      setIsMoving(false);
      setSelectedShapeIndex(null);
    } else if (shapeType === "eraser") {
      const updatedShapes = shapes.filter(
        (shape) => !isPointInShape(mousePos, shape)
      );
      setShapes(updatedShapes);
      onShapesUpdate(updatedShapes);
    } else if (shapeType === "pen") {
      const newPenShape = {
        type: "pen",
        path: currentPenPath,
      };
      const updatedShapes = [...shapes, newPenShape];
      setShapes(updatedShapes);
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
      };
      const updatedShapes = [...shapes, newShape];
      setShapes(updatedShapes);
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
        };
        console.log("newTextShape", newTextShape);
        const updatedShapes = [...shapes, newTextShape];
        console.log({ updatedShapes });
        setShapes(updatedShapes);
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
          // Move other shapes (line, rectangle, circle)
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
    setShapes(updatedShapes);
    onShapesUpdate(updatedShapes);

    const canvasElement = document.querySelector("canvas");
    if (canvasElement) {
      canvasElement.style.cursor = "move";
    }
  };

  const drawPen = (ctx, path) => {
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  };

  const drawShape = (ctx, shape) => {
    const { type, start, end, path } = shape;
    switch (type) {
      case "line":
        drawLine(ctx, start, end);
        break;
      case "rectangle":
        drawRectangle(ctx, start, end);
        break;
      case "circle":
        drawCircle(ctx, start, end);
        break;
      case "pen":
        drawPen(ctx, path); // Draw the pen path
        break;
      case "text":
        drawText(ctx, shape.text, shape.position);
        break;
      default:
        break;
    }
  };

  const drawText = (ctx, text, position) => {
    if (position && text) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(text, position.x, position.y);
    }
  };

  const drawLine = (ctx, start, end) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const drawRectangle = (ctx, start, end) => {
    ctx.strokeStyle = "white";
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  };

  const drawCircle = (ctx, start, end) => {
    const radius = distance(start, end);
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const drawCurrentShape = (ctx, start, end) => {
    switch (shapeType) {
      case "line":
        drawLine(ctx, start, end);
        break;
      case "rectangle":
        drawRectangle(ctx, start, end);
        break;
      case "circle":
        drawCircle(ctx, start, end);
        break;
      default:
        break;
    }
  };

  const isPointInShape = (point, shape) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { type, start, end, text, position } = shape;

    switch (type) {
      case "line":
        const distanceToLine =
          Math.abs(
            (end.y - start.y) * point.x -
              (end.x - start.x) * point.y +
              end.x * start.y -
              end.y * start.x
          ) /
          Math.sqrt(
            Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2)
          );
        return distanceToLine < 5;

      case "rectangle":
        return (
          point.x >= start.x &&
          point.x <= end.x &&
          point.y >= start.y &&
          point.y <= end.y
        );

      case "circle":
        const radius = distance(start, end);
        const distanceToCenter = distance(point, start);
        return distanceToCenter <= radius;

      case "pen":
        return shape.path.some((penPoint) => distance(penPoint, point) < 5);

      case "text":
        return (
          position &&
          point.x >= position.x &&
          point.x <= position.x + ctx.measureText(text).width &&
          point.y >= position.y - 16 &&
          point.y <= position.y
        );

      default:
        return false;
    }
  };

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    shapes.forEach((shape) => drawShape(ctx, shape));
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
      setShapes([]);
      onShapesUpdate([]);
      localStorage.removeItem("shapes");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      switch (shapeType) {
        case "line":
          canvas.style.cursor = "crosshair";
          break;
        case "circle":
          canvas.style.cursor = "crosshair";
          break;
        case "rectangle":
          canvas.style.cursor = "crosshair";
          break;
        case "eraser":
          canvas.style.cursor = "pointer";
          break;
        case "text":
          canvas.style.cursor = "text";
          break;
        default:
          canvas.style.cursor = "default";
      }
    }
  }, [shapeType, shapes.length]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "80vh",
        position: "relative",
      }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        className="canvas-style"
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
