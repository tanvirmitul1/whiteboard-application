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
  shapes
    .slice()
    .reverse()
    .map((shape) => {
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
        fontWeight,
        fontStyle,
        textDecoration,
        fontFamily,
        x,
        y,
        width,
        height,
        imgSrc,
      } = shape;

      switch (type) {
        case "image":
          if (imgSrc) {
            const img = new Image();
            img.src = imgSrc;
            img.onload = () => {
              ctx.drawImage(
                img,
                x * scale,
                y * scale,
                width * scale,
                height * scale
              );
            };
          }
          break;
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
        case "pentagon":
          if (start.x && start.y && end.x && end.y) {
            const centerX = ((start.x + end.x) / 2) * scale;
            const centerY = ((start.y + end.y) / 2) * scale;
            const radius = (Math.abs(end.x - start.x) / 2) * scale;
            drawPolygon(ctx, centerX, centerY, 5, radius, fill, color);
          }
          break;

        case "hexagon":
          if (start.x && start.y && end.x && end.y) {
            const centerX = ((start.x + end.x) / 2) * scale;
            const centerY = ((start.y + end.y) / 2) * scale;
            const radius = (Math.abs(end.x - start.x) / 2) * scale;
            drawPolygon(ctx, centerX, centerY, 6, radius, fill, color);
          }
          break;

        case "text":
          if (position.x && position.y) {
            const scaledPosition = {
              x: position.x * scale,
              y: position.y * scale,
            };

            ctx.font = `${fontStyle || "normal"} ${fontWeight || "normal"} ${
              (fontSize || 16) * scale
            }px ${fontFamily || "Arial"}`;
            ctx.fillStyle = color || "#C735BB";
            ctx.fillText(
              text || "Default Text",
              scaledPosition.x,
              scaledPosition.y
            );

            // Handle underline text decoration
            if (textDecoration === "underline") {
              const textWidth = ctx.measureText(text || "Default Text").width;
              const underlineY = scaledPosition.y + 2 * scale; // Adjust underline position

              ctx.beginPath();
              ctx.moveTo(scaledPosition.x, underlineY);
              ctx.lineTo(scaledPosition.x + textWidth, underlineY);
              ctx.lineWidth = 2 * scale; // Adjust thickness
              ctx.strokeStyle = color || "#C735BB";
              ctx.stroke();
            }
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

const drawPolygon = (ctx, centerX, centerY, sides, radius, fill, stroke) => {
  const angleStep = (2 * Math.PI) / sides;
  ctx.beginPath();

  for (let i = 0; i < sides; i++) {
    const x = centerX + radius * Math.cos(i * angleStep);
    const y = centerY + radius * Math.sin(i * angleStep);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fillStyle = fill || "#ff0909";
  ctx.fill();
  ctx.strokeStyle = stroke || "#C735BB";
  ctx.stroke();
};
