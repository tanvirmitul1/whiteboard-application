import React, { useRef, useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import "../index.css";
import useColors from "../customHooks/useColors";
import Clear from "./whiteboard/Clear";
import { StyledTypography } from "./ui/whiteBoardUI";
import {
  distance,
  drawCircle,
  drawLine,
  drawPen,
  drawRectangle,
  drawShape,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
} from "../utils/whiteboardHelpers";
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

  const { colors } = useColors();

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
      drawPen(ctx, currentPenPath, colors);
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

  const drawCurrentShape = (ctx, start, end) => {
    switch (shapeType) {
      case "line":
        drawLine(ctx, start, end, colors);
        break;
      case "rectangle":
        drawRectangle(ctx, start, end, colors);
        break;
      case "circle":
        drawCircle(ctx, start, end, colors);
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

    shapes.forEach((shape) => drawShape(ctx, shape, colors));
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
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onTouchStart={(e) => {
          handleTouchStart(
            e,
            canvasRef,
            shapeType,
            setStartPoint,
            setCurrentPenPath,
            shapes,
            setIsDrawing,
            setIsMoving,
            setSelectedShapeIndex,
            isPointInShape
          );
        }}
        onTouchMove={(e) => {
          handleTouchMove(
            e,
            canvasRef,
            shapeType,
            setCurrentPenPath,
            isDrawing,
            isMoving,
            selectedShapeIndex,
            drawAllShapes,
            drawCurrentShape,
            moveShape,
            currentPenPath,
            drawPen,
            startPoint
          );
        }}
        onTouchEnd={(e) => {
          handleTouchEnd(
            e,
            canvasRef,
            shapeType,
            setCurrentPenPath,
            isDrawing,
            isMoving,
            selectedShapeIndex,
            currentPenPath,
            startPoint,
            setIsMoving,
            setSelectedShapeIndex,
            setShapes,
            onShapesUpdate,
            isPointInShape,
            shapes,
            setTextInput,
            setIsDrawing
          );
        }}
        className="canvas-style"
        style={{
          backgroundColor: colors?.canvasBgColor,
        }}
      />
      <StyledTypography variant="h6">mitul@seopage1.net</StyledTypography>
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
      <Clear
        shapes={shapes}
        setShapes={setShapes}
        onShapesUpdate={onShapesUpdate}
        canvasRef={canvasRef}
      />
    </Box>
  );
};

export default Whiteboard;
