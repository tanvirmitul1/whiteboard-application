import { copyShape, deleteShape, pasteShape } from "./otherFunctions";

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
};
