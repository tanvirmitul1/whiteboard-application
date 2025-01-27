import { setShapes } from "../slices/canvasSlice";
import { store } from "../store";

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

export const copyShape = (selectedShapeIndex, setCopiedShape) => {
  const shapes = store.getState().canvas.shapes;
  if (selectedShapeIndex !== null) {
    const shapeToCopy = shapes[selectedShapeIndex];

    setCopiedShape(shapeToCopy); // Store the copied shape
  }
};

// Function to paste the copied shape
export const pasteShape = (copiedShape, drawAllShapes) => {
  const shapes = store.getState().canvas.shapes;
  if (copiedShape) {
    let copiedShapeToPaste;

    // Check the type of the copied shape
    if (copiedShape.type === "text") {
      // Handle text shapes
      copiedShapeToPaste = {
        ...copiedShape,
        position: {
          x: copiedShape.position.x + 50, // Adjust the x position to the right
          y: copiedShape.position.y, // Keep the same y position
        },
      };
    } else if (copiedShape.type === "pen") {
      // Handle pen shapes
      copiedShapeToPaste = {
        ...copiedShape,
        path: copiedShape.path.map((point) => ({
          x: point.x + 50, // Adjust the x position of each point in the path
          y: point.y, // Keep the y position the same
        })),
      };
    } else {
      // Handle other shapes (e.g., rectangle, circle, etc.)
      copiedShapeToPaste = {
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
    }

    const updatedShapes = [copiedShapeToPaste, ...shapes];
    store.dispatch(setShapes(updatedShapes));
    // Redraw all shapes
    drawAllShapes();
  }
};

export const deleteShape = (selectedShapeIndex, drawAllShapes) => {
  const shapes = store.getState().canvas.shapes;
  console.log("selectedShapeIndex", selectedShapeIndex);
  console.log("shapes before delete", shapes);
  if (selectedShapeIndex !== null) {
    const filteredShapes = shapes.filter(
      (_, index) => index !== selectedShapeIndex
    );
    store.dispatch(setShapes(filteredShapes));
    // Redraw all remaining shapes
    drawAllShapes();
    console.log("shapes after delete", shapes);
  }
};

export const takeToBack = (index, drawAllShapes) => {
  const shapes = store.getState().canvas.shapes;
  if (index < shapes.length - 1) {
    // Clone the shapes array
    const updatedShapes = [...shapes];

    // Remove the shape from the current index
    const [shape] = updatedShapes.splice(index, 1);

    // Add the shape to the end of the array
    updatedShapes.push(shape);

    // Update the shapes state and redraw all shapes
    store.dispatch(setShapes(updatedShapes));

    drawAllShapes();
  }
};

export const takeToFront = (index, drawAllShapes) => {
  const shapes = store.getState().canvas.shapes;
  if (index > 0) {
    // Clone the shapes array
    const updatedShapes = [...shapes];

    // Remove the shape from the current index
    const [shape] = updatedShapes.splice(index, 1);

    // Add the shape to the beginning of the array
    updatedShapes.unshift(shape);

    // Update the shapes state and redraw all shapes
    store.dispatch(setShapes(updatedShapes));
    drawAllShapes();
  }
};

export const changeFillColor = (
  pickerType,
  selectedShapeIndex,
  newFillColor,
  drawAllShapes
) => {
  const shapes = store.getState().canvas.shapes;
  if (
    selectedShapeIndex === null ||
    selectedShapeIndex < 0 ||
    selectedShapeIndex >= shapes.length
  ) {
    console.error("Invalid shape index");
    return;
  }

  // Safely update the selected shape's fill color
  let updatedShapes = shapes;
  if (pickerType === "fill") {
    updatedShapes = shapes.map((shape, index) =>
      index === selectedShapeIndex ? { ...shape, fill: newFillColor } : shape
    );
  } else if (pickerType === "stroke") {
    updatedShapes = shapes.map((shape, index) =>
      index === selectedShapeIndex ? { ...shape, color: newFillColor } : shape
    );
  }

  // Update the shapes state
  store.dispatch(setShapes(updatedShapes));

  // Redraw all shapes on the canvas
  drawAllShapes();
};
