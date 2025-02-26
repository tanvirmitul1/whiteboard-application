import { setShapes } from "../slices/canvasSlice";
import { store } from "../store";

const selectionColor = "#4EDBFF";
const selectionLineWidth = 4;
const selectionLineWidthText = 1;
export const drawShape = (ctx, shape) => {
  const {
    type,
    start,
    end,
    path,
    color,
    fill,
    text,
    position,
    selected,
    fontSize,
    fontWeight,
    fontStyle,
    textDecoration,
    fontFamily,
    angle,
  } = shape;
  switch (type) {
    case "line":
      drawLine(ctx, start, end, color, selected);
      break;
    case "rectangle":
      drawRectangle(ctx, start, end, color, fill, selected);
      break;
    case "triangle":
      drawTriangle(ctx, start, end, color, fill, selected);
      break;
    case "pentagon":
      drawPentagon(ctx, start, end, color, fill, selected);
      break;
    case "hexagon":
      drawHexagon(ctx, start, end, color, fill, selected);
      break;
    case "circle":
      drawCircle(ctx, start, end, color, fill, selected);
      break;
    case "pen":
      drawPen(ctx, path, color, selected);
      break;
    case "text":
      drawText(
        ctx,
        text,
        position,
        color,
        selected,
        fontSize,
        fontWeight,
        fontStyle,
        textDecoration,
        fontFamily
      );
      break;
    case "image":
      drawImage(shape, ctx);
      break;
    default:
      break;
  }
};
export const drawCurrentShape = (ctx, start, end, shapeType, color, fill) => {
  switch (shapeType) {
    case "line":
      drawLine(ctx, start, end, color);
      break;
    case "rectangle":
      drawRectangle(ctx, start, end, color, fill);
      break;
    case "triangle":
      drawTriangle(ctx, start, end, color, fill);
      break;
    case "pentagon":
      drawPentagon(ctx, start, end, color, fill);
      break;
    case "hexagon":
      drawHexagon(ctx, start, end, color, fill);
      break;
    case "circle":
      drawCircle(ctx, start, end, color, fill);
      break;

    default:
      break;
  }
};
export const drawLine = (ctx, start, end, color, isSelected) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.stroke();
  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.stroke();
  }
};

export const drawRectangle = (ctx, start, end, color, fill, isSelected) => {
  ctx.strokeStyle = color;
  ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }
  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }
};

export const drawPen = (ctx, path, color, isSelected) => {
  if (path.length > 1) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();

    if (isSelected) {
      ctx.lineWidth = selectionLineWidth;
      ctx.strokeStyle = selectionColor;
      ctx.stroke();
    }
  }
};

export const drawTriangle = (ctx, start, end, color, fill, isSelected) => {
  const thirdPoint = { x: start.x + (end.x - start.x) / 2, y: start.y }; // Calculate the top vertex of the triangle

  // Begin drawing
  ctx.beginPath();
  ctx.moveTo(start.x, end.y); // Bottom-left point
  ctx.lineTo(end.x, end.y); // Bottom-right point
  ctx.lineTo(thirdPoint.x, thirdPoint.y); // Top vertex
  ctx.closePath(); // Close the triangle path

  // Set stroke color and draw the outline
  if (color) {
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // Set fill color and fill the triangle
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.stroke();
  }
};
export const drawPentagon = (ctx, start, end, color, fill, isSelected) => {
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;
  const radius = Math.min(end.x - start.x, end.y - start.y) / 2;
  const angle = (2 * Math.PI) / 5; // 360° / 5 sides

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const x = centerX + radius * Math.cos(i * angle - Math.PI / 2);
    const y = centerY + radius * Math.sin(i * angle - Math.PI / 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  if (color) {
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.stroke();
  }
};

export const drawHexagon = (ctx, start, end, color, fill, isSelected) => {
  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;
  const radius = Math.min(end.x - start.x, end.y - start.y) / 2;
  const angle = (2 * Math.PI) / 6; // 360° / 6 sides

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const x = centerX + radius * Math.cos(i * angle);
    const y = centerY + radius * Math.sin(i * angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  if (color) {
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.stroke();
  }
};

export const drawCircle = (ctx, start, end, color, fill, isSelected) => {
  const radius = distance(start, end);
  ctx.beginPath();
  ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = fill;
  ctx.fill();
  if (isSelected) {
    ctx.lineWidth = selectionLineWidth;
    ctx.strokeStyle = selectionColor;
    ctx.stroke();
  }
};

export const drawImage = (shape, ctx) => {
  const img = new Image();
  img.src = shape.imgSrc;
  img.onload = () => {
    ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
  };
};

export const drawText = (
  ctx,
  text,
  position,
  color,
  isSelected,
  fontSize,
  fontWeight = "normal",
  fontStyle = "normal",
  textDecoration = "none",
  fontFamily = "Arial"
) => {
  if (position && text) {
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(text, position.x, position.y);

    if (textDecoration === "underline") {
      const textWidth = ctx.measureText(text).width;
      const underlineY = position.y + 2; // Adjust as needed
      ctx.beginPath();
      ctx.moveTo(position.x, underlineY);
      ctx.lineTo(position.x + textWidth, underlineY);
      ctx.lineWidth = 2; // Adjust thickness
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    if (isSelected) {
      ctx.lineWidth = selectionLineWidthText;
      ctx.strokeStyle = selectionColor;
      ctx.strokeText(text, position.x, position.y);
    }
  }
};

export const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

export const isPointInShape = (ctx, point, shape) => {
  const { type, start, end, text, position, path } = shape;

  switch (type) {
    case "line": {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distanceToLine =
        Math.abs(
          dy * point.x - dx * point.y + end.x * start.y - end.y * start.x
        ) / Math.sqrt(dx * dx + dy * dy);
      return distanceToLine < 5;
    }

    case "rectangle":
    case "triangle":
    case "pentagon":
    case "hexagon":
      return isPointInBounds(point, start, end);

    case "circle": {
      const radius = distance(start, end);
      return distance(point, start) <= radius;
    }

    case "pen":
      return path?.some((penPoint) => distance(penPoint, point) < 5);

    case "text":
      return (
        position &&
        point.x >= position.x &&
        point.x <= position.x + ctx.measureText(text).width &&
        point.y >= position.y - 16 &&
        point.y <= position.y
      );
    case "image":
      return (
        point.x >= shape?.x &&
        point.x <= shape?.x + shape?.width &&
        point.y >= shape?.y &&
        point.y <= shape?.y + shape?.height
      );

    default:
      return false;
  }
};
const isPointInBounds = (point, start, end) =>
  point.x >= start.x &&
  point.x <= end.x &&
  point.y >= start.y &&
  point.y <= end.y;

export const getMousePosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
};
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
export const moveShape = (
  mousePos,
  selectedShapeIndex,
  startPoint,
  setStartPoint,
  onShapesUpdate,
  smoothingFactor
) => {
  const shapes = store.getState().canvas.shapes;
  const deltaX = mousePos.x - startPoint.x;
  const deltaY = mousePos.y - startPoint.y;

  const smoothedDeltaX = deltaX * smoothingFactor;
  const smoothedDeltaY = deltaY * smoothingFactor;

  const updatedShapes = shapes.map((shape, index) => {
    if (index === selectedShapeIndex) {
      if (shape.type === "pen") {
        // Move the entire pen path
        const newPath = shape.path.map((point) => ({
          x: point.x + smoothedDeltaX,
          y: point.y + smoothedDeltaY,
        }));
        return { ...shape, path: newPath };
      } else if (shape.type === "text") {
        // Move the text position
        return {
          ...shape,
          position: {
            x: shape.position.x + smoothedDeltaX,
            y: shape.position.y + smoothedDeltaY,
          },
        };
      } else if (shape.type === "image") {
        // Move the image position
        return {
          ...shape,
          x: shape.x + smoothedDeltaX,
          y: shape.y + smoothedDeltaY,
        };
      } else {
        // Normalize the start and end points
        const normalizedStartX = Math.min(shape.start.x, shape.end.x);
        const normalizedStartY = Math.min(shape.start.y, shape.end.y);
        const normalizedEndX = Math.max(shape.start.x, shape.end.x);
        const normalizedEndY = Math.max(shape.start.y, shape.end.y);

        return {
          ...shape,
          start: {
            x: normalizedStartX + smoothedDeltaX,
            y: normalizedStartY + smoothedDeltaY,
          },
          end: {
            x: normalizedEndX + smoothedDeltaX,
            y: normalizedEndY + smoothedDeltaY,
          },
        };
      }
    }
    return shape;
  });

  setStartPoint(mousePos); // Update the starting point for the next movement
  store.dispatch(setShapes(updatedShapes));
  onShapesUpdate(updatedShapes);
  const canvasElement = document.querySelector("canvas");
  if (canvasElement) {
    canvasElement.style.cursor = "move"; // Optional: Update cursor style to indicate movement
  }
};
