export const drawShapes = (canvas, shapes, canvasSize) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Get the current canvas size
  const canvasWidth = canvas.parentElement.offsetWidth;
  const canvasHeight = canvas.parentElement.offsetHeight;

  // Calculate scaling factors
  const scaleX = canvasWidth / canvasSize.width;
  const scaleY = canvasHeight / canvasSize.height;
  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  // Set canvas dimensions
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each shape with scaling applied
  shapes.forEach((shape) => {
    const {
      type,
      start = {},
      end = {},
      path = [],
      position = {},
      text,
      color,
      fill,
      fontSize,
    } = shape;

    switch (type) {
      case "line":
        if (start.x && start.y && end.x && end.y) {
          ctx.beginPath();
          ctx.moveTo(start.x * scale, start.y * scale);
          ctx.lineTo(end.x * scale, end.y * scale);
          ctx.strokeStyle = color || "#C735BB";
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (start.x && start.y && end.x && end.y) {
          ctx.beginPath();
          ctx.rect(
            start.x * scale,
            start.y * scale,
            (end.x - start.x) * scale,
            (end.y - start.y) * scale
          );
          ctx.fillStyle = fill || "#ff0909";
          ctx.fill();
          ctx.strokeStyle = color || "#C735BB";
          ctx.stroke();
        }
        break;

      case "circle":
        if (start.x && start.y && end.x && end.y) {
          const centerX = start.x * scale;
          const centerY = start.y * scale;
          const radius = Math.sqrt(
            (end.x - start.x) ** 2 + (end.y - start.y) ** 2
          );
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
          ctx.fillStyle = fill || "#ff0909";
          ctx.fill();
          ctx.strokeStyle = color || "#C735BB";
          ctx.stroke();
        }
        break;

      case "triangle":
        if (start.x && start.y && end.x && end.y) {
          const scaledStart = { x: start.x * scale, y: start.y * scale };
          const scaledEnd = { x: end.x * scale, y: end.y * scale };
          const thirdPoint = {
            x: scaledStart.x + (scaledEnd.x - scaledStart.x) / 2,
            y: scaledStart.y,
          };
          ctx.beginPath();
          ctx.moveTo(scaledStart.x, scaledEnd.y);
          ctx.lineTo(scaledEnd.x, scaledEnd.y);
          ctx.lineTo(thirdPoint.x, thirdPoint.y);
          ctx.closePath();
          ctx.fillStyle = fill || "#ff0909";
          ctx.fill();
          ctx.strokeStyle = color || "#C735BB";
          ctx.stroke();
        }
        break;

      case "text":
        if (position.x && position.y) {
          const scaledPosition = {
            x: position.x * scale,
            y: position.y * scale,
          };
          ctx.font = `${(fontSize || 16) * scale}px Arial`; // Scale font size
          ctx.fillStyle = color || "#C735BB";
          ctx.fillText(
            text || "Default Text",
            scaledPosition.x,
            scaledPosition.y
          );
        }
        break;

      case "pen":
        if (path.length) {
          ctx.beginPath();
          const scaledPath = path.map(({ x, y }) => ({
            x: x * scale,
            y: y * scale,
          }));
          const firstPoint = scaledPath[0];
          ctx.moveTo(firstPoint.x, firstPoint.y);
          scaledPath.forEach(({ x, y }) => ctx.lineTo(x, y));
          ctx.strokeStyle = color || "#C735BB";
          ctx.stroke();
        }
        break;

      default:
        console.error("Unknown shape type:", type);
        break;
    }
  });
};
