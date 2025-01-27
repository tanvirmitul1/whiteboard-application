import {
  copyShape,
  deleteShape,
  moveShapeByKeys,
  pasteShape,
  takeToBack,
  takeToFront,
} from "./otherFunctions";

// keyHandlers.js
export const handleKeyDown = (
  event,
  selectedShapeIndex,
  copiedShape,
  setCopiedShape,
  drawAllShapes
) => {
  if (selectedShapeIndex === null) return;
  let dx = 0;
  let dy = 0;

  // Handle Delete key
  if (event.key === "Delete") {
    deleteShape(selectedShapeIndex, drawAllShapes);
  }
  if (event.ctrlKey && event.key === "x") {
    copyShape(selectedShapeIndex, setCopiedShape);
    deleteShape(selectedShapeIndex, drawAllShapes);
  }

  // Handle Control + C (copy)
  if (event.ctrlKey && event.key === "c") {
    copyShape(selectedShapeIndex, setCopiedShape);
  }

  // Handle Control + V (paste)
  if (event.ctrlKey && event.key === "v") {
    pasteShape(copiedShape, drawAllShapes);
  }
  // Handle Control + F (take to front)
  if (event.ctrlKey && event.key === "f") {
    takeToFront(selectedShapeIndex, drawAllShapes);
  }
  // Handle Control + B (take to back)
  if (event.ctrlKey && event.key === "b") {
    takeToBack(selectedShapeIndex, drawAllShapes);
  }

  // Check which key was pressed
  if (event.key === "ArrowUp") {
    dy = -5; // Move up
  } else if (event.key === "ArrowDown") {
    dy = 5; // Move down
  } else if (event.key === "ArrowLeft") {
    dx = -5; // Move left
  } else if (event.key === "ArrowRight") {
    dx = 5; // Move right
  }

  // If any key was pressed, update shape position
  if (dx !== 0 || dy !== 0) {
    // Call the moveShape function with the calculated dx, dy
    moveShapeByKeys(dx, dy, selectedShapeIndex);
  }
};
