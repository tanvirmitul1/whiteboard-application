import {
  copyShape,
  deleteShape,
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
  // Handle Delete key
  if (event.key === "Delete") {
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
};
