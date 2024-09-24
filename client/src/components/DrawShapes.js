export const drawShapes = (canvas, shapes) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Set canvas size to fill the parent container
  const canvasWidth = canvas.parentElement.offsetWidth;
  const canvasHeight = canvas.parentElement.offsetHeight;

  // Initialize bounding box values
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  // Calculate the bounding box for all shapes
  shapes?.forEach((shape) => {
    const { start = {}, end = {}, path = [], position = {}, type } = shape;

    // Update min/max based on start and end if they exist
    if (start.x !== undefined && start.y !== undefined) {
      minX = Math.min(minX, start.x);
      minY = Math.min(minY, start.y);
      maxX = Math.max(maxX, start.x);
      maxY = Math.max(maxY, start.y);
    }
    if (end.x !== undefined && end.y !== undefined) {
      minX = Math.min(minX, end.x);
      minY = Math.min(minY, end.y);
      maxX = Math.max(maxX, end.x);
      maxY = Math.max(maxY, end.y);
    }

    // Check if it's a pen shape and calculate min/max from path
    if (type === "pen" && path.length) {
      path.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    }

    // Check if it's a text shape and calculate min/max from position
    if (
      type === "text" &&
      position.x !== undefined &&
      position.y !== undefined
    ) {
      minX = Math.min(minX, position.x);
      minY = Math.min(minY, position.y);
      maxX = Math.max(maxX, position.x);
      maxY = Math.max(maxY, position.y);
    }
  });

  // Add some padding to the bounding box
  const padding = 20;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  // Calculate the scale factor to fit the bounding box within the canvas
  const widthScale = canvasWidth / (maxX - minX);
  const heightScale = canvasHeight / (maxY - minY);
  const scale = Math.min(widthScale, heightScale);

  // Set canvas size and clear it
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Set styles
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Draw each shape with scaling applied
  shapes?.forEach((shape) => {
    const {
      start = {},
      end = {},
      type,
      text,
      path = [],
      position = {},
    } = shape;

    // Handle each shape type
    switch (type) {
      case "line":
        if (
          start.x !== undefined &&
          start.y !== undefined &&
          end.x !== undefined &&
          end.y !== undefined
        ) {
          const scaledStart = {
            x: (start.x - minX) * scale,
            y: (start.y - minY) * scale,
          };
          const scaledEnd = {
            x: (end.x - minX) * scale,
            y: (end.y - minY) * scale,
          };

          ctx.beginPath();
          ctx.moveTo(scaledStart.x, scaledStart.y);
          ctx.lineTo(scaledEnd.x, scaledEnd.y);
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
        break;

      case "circle":
        if (
          start.x !== undefined &&
          start.y !== undefined &&
          end.x !== undefined &&
          end.y !== undefined
        ) {
          const scaledStart = {
            x: (start.x - minX) * scale,
            y: (start.y - minY) * scale,
          };
          const scaledEnd = {
            x: (end.x - minX) * scale,
            y: (end.y - minY) * scale,
          };
          const radius = Math.sqrt(
            (scaledEnd.x - scaledStart.x) ** 2 +
              (scaledEnd.y - scaledStart.y) ** 2
          );

          ctx.beginPath();
          ctx.arc(scaledStart.x, scaledStart.y, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
        break;

      case "rectangle":
        if (
          start.x !== undefined &&
          start.y !== undefined &&
          end.x !== undefined &&
          end.y !== undefined
        ) {
          const scaledStart = {
            x: (start.x - minX) * scale,
            y: (start.y - minY) * scale,
          };
          const scaledEnd = {
            x: (end.x - minX) * scale,
            y: (end.y - minY) * scale,
          };
          const width = scaledEnd.x - scaledStart.x;
          const height = scaledEnd.y - scaledStart.y;

          ctx.beginPath();
          ctx.rect(scaledStart.x, scaledStart.y, width, height);
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
        break;

      case "text":
        if (position.x !== undefined && position.y !== undefined) {
          const scaledPosition = {
            x: (position.x - minX) * scale,
            y: (position.y - minY) * scale,
          };
          ctx.font = "16px Arial";
          ctx.fillStyle = "white";
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
          const firstPoint = path[0];
          ctx.moveTo(
            (firstPoint.x - minX) * scale,
            (firstPoint.y - minY) * scale
          );
          path.forEach(({ x, y }) => {
            ctx.lineTo((x - minX) * scale, (y - minY) * scale);
          });
          ctx.stroke();
        }
        break;

      default:
        console.error("Unknown shape type:", type);
        break;
    }
  });
};
