export const setCanvasCursor = (canvas, shapeType) => {
  if (!canvas) return;

  switch (shapeType) {
    case "line":
    case "circle":
    case "triangle":
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
};
