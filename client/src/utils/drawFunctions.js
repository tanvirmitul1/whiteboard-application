const selectionColor = "#4EDBFF";
const selectionLineWidth = 4;
const selectionLineWidthText = 1;
export const drawShape = (ctx, shape) => {
  const { type, start, end, path, color, fill, text, position, selected } =
    shape;
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
    case "circle":
      drawCircle(ctx, start, end, color, fill, selected);
      break;
    case "pen":
      drawPen(ctx, path, color, selected);
      break;
    case "text":
      drawText(ctx, text, position, color, selected);
      break;
    default:
      break;
  }
};
export const drawCurrentShape = (ctx, start, end, shapeType, color) => {
  switch (shapeType) {
    case "line":
      drawLine(ctx, start, end, color);
      break;
    case "rectangle":
      drawRectangle(ctx, start, end, color);
      break;
    case "triangle":
      drawTriangle(ctx, start, end, color);
      break;
    case "circle":
      drawCircle(ctx, start, end, color);
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

export const drawText = (ctx, text, position, color, isSelected) => {
  if (position && text) {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, position.x, position.y);
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
        Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
      return distanceToLine < 5;

    case "rectangle":
      return (
        point.x >= start.x &&
        point.x <= end.x &&
        point.y >= start.y &&
        point.y <= end.y
      );

    case "triangle":
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
