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
export function getShapeCoordinates(shape, mousePos) {
  if (!shape) return null;

  let result = {
    visible: true,
    x: mousePos.x,
    y: mousePos.y,
  };

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

export const takeToFront = (index, shapes, setShapes, drawAllShapes) => {
  if (index < shapes.length - 1) {
    // Clone the shapes array
    const updatedShapes = [...shapes];

    // Remove the shape from the current index
    const [shape] = updatedShapes.splice(index, 1);

    // Add the shape to the end of the array
    updatedShapes.push(shape);

    // Update the shapes state and redraw all shapes
    setShapes(updatedShapes);
    drawAllShapes();
  }
};

export const takeToBack = (index, shapes, setShapes, drawAllShapes) => {
  if (index > 0) {
    // Clone the shapes array
    const updatedShapes = [...shapes];

    // Remove the shape from the current index
    const [shape] = updatedShapes.splice(index, 1);

    // Add the shape to the beginning of the array
    updatedShapes.unshift(shape);

    // Update the shapes state and redraw all shapes
    setShapes(updatedShapes);
    drawAllShapes();
  }
};
