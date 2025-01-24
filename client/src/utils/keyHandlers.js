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
  shapes,
  setShapes,
  copiedShape,
  setCopiedShape,
  drawAllShapes
) => {
  // Handle Delete key
  if (event.key === "Delete") {
    deleteShape(selectedShapeIndex, shapes, setShapes, drawAllShapes);
  }

  // Handle Control + C (copy)
  if (event.ctrlKey && event.key === "c") {
    copyShape(selectedShapeIndex, shapes, setCopiedShape);
  }

  // Handle Control + V (paste)
  if (event.ctrlKey && event.key === "v") {
    pasteShape(copiedShape, setShapes, drawAllShapes);
  }
  // Handle Control + F (take to front)
  if (event.ctrlKey && event.key === "f") {
    takeToFront(selectedShapeIndex, shapes, setShapes, drawAllShapes);
  }
  // Handle Control + B (take to back)
  if (event.ctrlKey && event.key === "b") {
    takeToBack(selectedShapeIndex, shapes, setShapes, drawAllShapes);
  }
};
