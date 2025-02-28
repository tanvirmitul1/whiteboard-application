/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../index.css";
import Swal from "sweetalert2";
import {
  drawCurrentShape,
  drawPen,
  drawShape,
  getMousePosition,
  getTouchPosition,
  isPointInShape,
  moveShape,
} from "../utils/drawFunctions";
import { handleKeyDown } from "../utils/keyHandlers";
import { getShapeCoordinates, setCanvasCursor } from "../utils/otherFunctions";
import ShapeContextBar from "./context/ShapeContextBar";
import { setShapes, toggleMode } from "../slices/canvasSlice";
import { useDispatch, useSelector } from "react-redux";
import Watermark from "./canvas/Watermark";
import TextToolInput from "./canvas/TextToolInput";
import ClearButton from "./canvas/ClearButton";
import { v4 as uuidv4 } from "uuid";
import DownloadButton from "./canvas/DownloadButton";
import ImageUploader from "./canvas/ImageUploader";
import { toast } from "react-toastify";
import ModeToggleButton from "./canvas/ModeToggleButton";
const Whiteboard = ({
  shapeType,
  setShapeType,
  onShapesUpdate,
  drawColor,
  backgroundColor,
  fillColor,
  drawingTitle,
  selectedShapeIndex,
  setSelectedShapeIndex,
  canvasRef,
}) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  console.log({ shapes });
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState({ x: 1, y: 1 });
  const [textInput, setTextInput] = useState(null);
  const [currentPenPath, setCurrentPenPath] = useState([]);
  const [copiedShape, setCopiedShape] = useState(null);
  const smoothingFactor = Number(process.env.REACT_APP_SMOOTH_FACTOR);
  const mode = useSelector((state) => state.canvas.mode); // Get mode from Redux

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    [...shapes].reverse().forEach((shape) => drawShape(ctx, shape));
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mousePos = getMousePosition(canvas, e);
    setStartPoint(mousePos);
    if (shapeType === "eraser") {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, mousePos, shape)
      );
      if (shapeIndex !== -1) {
        const updatedShapes = shapes.filter((_, index) => index !== shapeIndex);
        dispatch(setShapes(updatedShapes));
        onShapesUpdate(updatedShapes);
      }
    }

    if (mode === "draw") {
      if (isDrawing && shapeType === "pen") {
        setCurrentPenPath([...currentPenPath, mousePos]);
        drawPen(ctx, currentPenPath);
      } else if (shapeType === "image") {
        setSelectedShapeIndex(
          shapes.findIndex((shape) => isPointInShape(ctx, mousePos, shape))
        );
      } else {
        setIsDrawing(true);
      }
    } else if (mode === "move") {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, mousePos, shape)
      );
      if (shapeIndex !== -1) {
        setSelectedShapeIndex(shapeIndex);
        setIsMoving(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (mode === "draw" && !isDrawing) return;
    if (mode === "move" && !isMoving) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mousePos = getMousePosition(canvas, e);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();

    if (mode === "draw") {
      if (isDrawing && shapeType === "pen") {
        setCurrentPenPath([...currentPenPath, mousePos]);
        drawPen(ctx, currentPenPath);
      } else if (shapeType === "image" && selectedShapeIndex !== null) {
        const updatedShapes = shapes.map((shape, index) =>
          index === selectedShapeIndex
            ? {
                ...shape,
                x: mousePos.x - shape.width / 2,
                y: mousePos.y - shape.height / 2,
              }
            : shape
        );
        dispatch(setShapes(updatedShapes));
        drawAllShapes(updatedShapes);
      } else {
        drawCurrentShape(ctx, startPoint, mousePos, shapeType, drawColor);
      }
    } else if (mode === "move" && selectedShapeIndex !== null) {
      moveShape(
        mousePos,
        selectedShapeIndex,
        startPoint,
        setStartPoint,
        onShapesUpdate,
        smoothingFactor
      );
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
        uuid: uuidv4(),
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
      // Normalize start and end points
      const normalizedStart = {
        x: Math.min(startPoint.x, mousePos.x),
        y: Math.min(startPoint.y, mousePos.y),
      };
      const normalizedEnd = {
        x: Math.max(startPoint.x, mousePos.x),
        y: Math.max(startPoint.y, mousePos.y),
      };

      const newShape = {
        uuid: uuidv4(),
        type: shapeType,
        start: normalizedStart,
        end: normalizedEnd,
        color: drawColor,
        fill: fillColor,
      };

      const updatedShapes = [newShape, ...shapes];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    }

    setIsDrawing(false);
  };

  //mobile touchevent
  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const touchPos = getTouchPosition(canvas, e);
    setStartPoint(touchPos);

    if (shapeType === "eraser") {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, touchPos, shape)
      );
      if (shapeIndex !== -1) {
        const updatedShapes = shapes.filter((_, index) => index !== shapeIndex);
        dispatch(setShapes(updatedShapes));
        onShapesUpdate(updatedShapes);
      }
    }

    if (mode === "draw") {
      if (isDrawing && shapeType === "pen") {
        setCurrentPenPath([...currentPenPath, touchPos]);
        drawPen(ctx, currentPenPath);
      } else if (shapeType === "image") {
        setSelectedShapeIndex(
          shapes.findIndex((shape) => isPointInShape(ctx, touchPos, shape))
        );
      } else {
        setIsDrawing(true);
      }
    } else if (mode === "move") {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInShape(ctx, touchPos, shape)
      );
      if (shapeIndex !== -1) {
        setSelectedShapeIndex(shapeIndex);
        setIsMoving(true);
      }
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
        uuid: uuidv4(),
        type: "pen",
        path: currentPenPath,
        color: drawColor,
        fill: fillColor,
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
        uuid: uuidv4(),
        type: shapeType,
        start: startPoint,
        end: touchPos,
        color: drawColor,
        fill: fillColor,
      };
      const updatedShapes = [...shapes, newShape];
      dispatch(setShapes(updatedShapes));
      onShapesUpdate(updatedShapes);
    }

    setIsDrawing(false);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while drawing
    if (mode === "draw" && !isDrawing) return;
    if (mode === "move" && !isMoving) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const touchPos = getTouchPosition(canvas, e);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();

    if (mode === "draw") {
      if (isDrawing && shapeType === "pen") {
        setCurrentPenPath([...currentPenPath, touchPos]);
        drawPen(ctx, currentPenPath);
      } else if (shapeType === "image" && selectedShapeIndex !== null) {
        const updatedShapes = shapes.map((shape, index) =>
          index === selectedShapeIndex
            ? {
                ...shape,
                x: touchPos.x - shape.width / 2,
                y: touchPos.y - shape.height / 2,
              }
            : shape
        );
        dispatch(setShapes(updatedShapes));
        drawAllShapes(updatedShapes);
      } else {
        drawCurrentShape(ctx, startPoint, touchPos, shapeType, drawColor);
      }
    } else if (mode === "move" && selectedShapeIndex !== null) {
      moveShape(
        touchPos,
        selectedShapeIndex,
        startPoint,
        setStartPoint,
        onShapesUpdate,
        smoothingFactor
      );
    }
  };

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    e.preventDefault();
    const mousePos = getMousePosition(canvas, e);

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
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        dispatch(toggleMode());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas exists

    const preventScroll = (e) => e.preventDefault();

    // Add event listeners
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    canvas.addEventListener("touchend", preventScroll, { passive: false });

    // Cleanup function to remove event listeners
    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
      canvas.removeEventListener("touchend", preventScroll);
    };
  }, [canvasRef.current]); // Depend on canvasRef.current

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "90vh",
        width: "100%",
        position: "relative",
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Canvas */}
      <canvas
        id="drawing-canvas"
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
        reference={canvasRef}
      />
      {/* Watercolor Mark */}

      <Watermark />

      {/* Text Input for Text Tool */}
      <TextToolInput
        uuid
        canvasRef={canvasRef}
        textInput={textInput}
        canvasScale={canvasScale}
        setTextInput={setTextInput}
        onShapesUpdate={onShapesUpdate}
        drawColor={drawColor}
        fillColor={fillColor}
        setShapeType={setShapeType}
      />

      {/* Clear Button */}
      <ClearButton shapes={shapes} canvasRef={canvasRef} />
      {/* Image Uploader */}
      <ImageUploader drawAllShapes={drawAllShapes} />

      <ModeToggleButton />

      {/* Download Button */}
      <DownloadButton
        backgroundColor={backgroundColor}
        drawingTitle={drawingTitle}
        shapes={shapes}
      />
    </Box>
  );
};

export default Whiteboard;
