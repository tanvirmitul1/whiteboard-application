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
        brush,
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
        case "brush": // Handling the brush type
          if (path.length && brush) {
            drawBrush(ctx, path, brush, scale);
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
function drawBrush(ctx, path, brush, scale) {
  if (!path.length || !brush) return;

  // Common settings
  ctx.strokeStyle = brush.color || "#ac117b";
  ctx.lineWidth = brush.size * scale;
  ctx.globalAlpha = brush.hardness || 1;

  switch (brush.type) {
    case "round":
      drawRoundBrush(ctx, path, brush, scale);
      break;
    case "square":
      drawSquareBrush(ctx, path, brush, scale);
      break;
    case "star":
      drawStarBrush(ctx, path, brush, scale);
      break;
    case "diamond":
      drawDiamondBrush(ctx, path, brush, scale);
      break;
    case "spray":
      drawSprayBrush(ctx, path, brush, scale);
      break;
    case "airbrush":
      drawAirbrush(ctx, path, brush, scale);
      break;
    case "calligraphy":
      drawCalligraphyBrush(ctx, path, brush, scale);
      break;
    case "texture":
      drawTextureBrush(ctx, path, brush, scale);
      break;
    case "wet":
      drawWetBrush(ctx, path, brush, scale);
      break;
    case "pixel":
      drawPixelBrush(ctx, path, brush, scale);
      break;
    case "nature":
      drawNatureBrush(ctx, path, brush, scale);
      break;
    default:
      drawRoundBrush(ctx, path, brush, scale); // Fallback
  }
}

function drawRoundBrush(ctx, path, brush, scale) {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  const scaledPath = path.map(({ x, y }) => ({ x: x * scale, y: y * scale }));
  const firstPoint = scaledPath[0];
  ctx.moveTo(firstPoint.x, firstPoint.y);
  scaledPath.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.stroke();
}

function drawSquareBrush(ctx, path, brush, scale) {
  ctx.lineJoin = "miter";
  ctx.lineCap = "square";
  ctx.beginPath();
  const scaledPath = path.map(({ x, y }) => ({ x: x * scale, y: y * scale }));
  const firstPoint = scaledPath[0];
  ctx.moveTo(firstPoint.x, firstPoint.y);
  scaledPath.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.stroke();
}

function drawStarBrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i;
      const radius = i % 2 === 0 ? size : size / 2;
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  });
}

function drawDiamondBrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  });
}

function drawSprayBrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * size;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, size / 10, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }
  });
}

function drawAirbrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, ctx.strokeStyle);
  gradient.addColorStop(1, "transparent");
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  });
}

function drawCalligraphyBrush(ctx, path, brush, scale) {
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";
  const size = brush.size * scale;
  path.forEach(({ x, y }, i) => {
    if (i === 0) return;
    const prev = path[i - 1];
    const angle = Math.atan2(y - prev.y, x - prev.x);
    const cx = x * scale;
    const cy = y * scale;
    ctx.beginPath();
    ctx.moveTo(cx - size * Math.sin(angle), cy + size * Math.cos(angle));
    ctx.lineTo(cx + size * Math.sin(angle), cy - size * Math.cos(angle));
    ctx.stroke();
  });
}

function drawTextureBrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    for (let i = 0; i < 10; i++) {
      const offsetX = (Math.random() - 0.5) * size;
      const offsetY = (Math.random() - 0.5) * size;
      ctx.beginPath();
      ctx.arc(cx + offsetX, cy + offsetY, size / 20, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }
  });
}

function drawWetBrush(ctx, path, brush, scale) {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const size = brush.size * scale;
  ctx.globalAlpha = brush.hardness * 0.5;
  ctx.beginPath();
  const scaledPath = path.map(({ x, y }) => ({ x: x * scale, y: y * scale }));
  const firstPoint = scaledPath[0];
  ctx.moveTo(firstPoint.x, firstPoint.y);
  scaledPath.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.stroke();
  ctx.globalAlpha = brush.hardness;
  scaledPath.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, size / 4, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  });
}

function drawPixelBrush(ctx, path, brush, scale) {
  const size = Math.max(1, Math.floor(brush.size * scale));
  path.forEach(({ x, y }) => {
    const px = Math.floor((x * scale) / size) * size;
    const py = Math.floor((y * scale) / size) * size;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(px, py, size, size);
  });
}

function drawNatureBrush(ctx, path, brush, scale) {
  const size = brush.size * scale;
  path.forEach(({ x, y }) => {
    const cx = x * scale;
    const cy = y * scale;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.random() * 0.2;
      const len = size * (0.5 + Math.random() * 0.5);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + len * Math.cos(angle), cy + len * Math.sin(angle));
    }
    ctx.stroke();
  });
}
