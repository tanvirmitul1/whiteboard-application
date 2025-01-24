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
export function getShapeCoordinates(shape) {
  if (!shape) return null;

  let result = {
    visible: true,
    x: 0,
    y: 0,
  };

  switch (shape.type) {
    case "triangle":
    case "rectangle":
    case "circle":
    case "line":
      result.x = shape.end.x;
      result.y = shape.end.y;
      break;

    case "text":
      result.x = shape.position.x;
      result.y = shape.position.y;
      break;

    case "pen":
      const lastPoint = shape.path[shape.path.length - 1];
      result.x = lastPoint.x;
      result.y = lastPoint.y;
      break;

    default:
      result.x = shape.start.x;
      result.y = shape.start.y;
      break;
  }

  return result;
}

export const copyShape = (selectedShapeIndex, shapes, setCopiedShape) => {
  if (selectedShapeIndex !== null) {
    const shapeToCopy = shapes[selectedShapeIndex];
    setCopiedShape(shapeToCopy); // Store the copied shape
  }
};

// Function to paste the copied shape
export const pasteShape = (copiedShape, setShapes, drawAllShapes) => {
  if (copiedShape) {
    const copiedShapeToPaste = {
      ...copiedShape,
      start: {
        x: copiedShape.start.x + 50, // Adjust the x position to the right
        y: copiedShape.start.y,
      },
      end: {
        x: copiedShape.end.x + 50, // Adjust the x position of the end point
        y: copiedShape.end.y,
      },
    };

    // Add the new pasted shape to the shapes array
    setShapes((prevShapes) => [...prevShapes, copiedShapeToPaste]);

    // Redraw all shapes
    drawAllShapes();
  }
};

export const deleteShape = (
  selectedShapeIndex,
  shapes,
  setShapes,
  drawAllShapes
) => {
  if (selectedShapeIndex !== null) {
    const filteredShapes = shapes.filter(
      (_, index) => index !== selectedShapeIndex
    );
    setShapes(filteredShapes);

    // Redraw all remaining shapes
    drawAllShapes();
  }
};
