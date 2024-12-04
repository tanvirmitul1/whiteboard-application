export const getTouchPosition = (canvas, event) => {
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

export const handleTouchStart = (
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
) => {
  const canvas = canvasRef.current;
  const touchPos = getTouchPosition(canvas, e);
  setStartPoint(touchPos);

  if (shapeType === "pen") {
    setIsDrawing(true);
    setCurrentPenPath([touchPos]); // Start the pen path
  } else {
    const shapeIndex = shapes.findIndex((shape) =>
      isPointInShape(touchPos, shape)
    );
    if (shapeIndex !== -1) {
      setSelectedShapeIndex(shapeIndex);
      setIsMoving(true);
    } else {
      setIsDrawing(true);
    }
  }
};

export const handleTouchMove = (
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
) => {
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
    drawCurrentShape(ctx, startPoint, touchPos);
  } else if (isMoving && selectedShapeIndex !== null) {
    moveShape(touchPos);
  }
};

export const handleTouchEnd = (
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
) => {
  const canvas = canvasRef.current;
  const touchPos = getTouchPosition(canvas, e);

  if (isMoving && selectedShapeIndex !== null) {
    setIsMoving(false);
    setSelectedShapeIndex(null);
  } else if (shapeType === "eraser") {
    const updatedShapes = shapes.filter(
      (shape) => !isPointInShape(touchPos, shape)
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
    setTextInput({ x: touchPos.x, y: touchPos.y, value: "" });
  } else if (isDrawing) {
    const newShape = {
      type: shapeType,
      start: startPoint,
      end: touchPos,
    };
    const updatedShapes = [...shapes, newShape];
    setShapes(updatedShapes);
    onShapesUpdate(updatedShapes);
  }

  setIsDrawing(false);
};

export const drawPen = (ctx, path, colors) => {
  if (path.length > 1) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = colors.canvasDrawColor;
    ctx.stroke();
  }
};

export const drawShape = (ctx, shape, colors) => {
  const { type, start, end, path } = shape;
  switch (type) {
    case "line":
      drawLine(ctx, start, end, colors);
      break;
    case "rectangle":
      drawRectangle(ctx, start, end, colors);
      break;
    case "circle":
      drawCircle(ctx, start, end, colors);
      break;
    case "pen":
      drawPen(ctx, path, colors); // Draw the pen path
      break;
    case "text":
      drawText(ctx, shape.text, shape.position, colors);
      break;
    default:
      break;
  }
};

export const drawText = (ctx, text, position, colors) => {
  if (position && text) {
    ctx.font = "16px Arial";
    ctx.fillStyle = colors.canvasDrawColor;
    ctx.fillText(text, position.x, position.y);
  }
};

export const drawLine = (ctx, start, end, colors) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = colors.canvasDrawColor;
  ctx.stroke();
};

export const drawRectangle = (ctx, start, end, colors) => {
  ctx.strokeStyle = colors.canvasDrawColor;
  ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
};
export const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};
export const drawCircle = (ctx, start, end, colors) => {
  const radius = distance(start, end);
  ctx.beginPath();
  ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = colors.canvasDrawColor;
  ctx.stroke();
};
