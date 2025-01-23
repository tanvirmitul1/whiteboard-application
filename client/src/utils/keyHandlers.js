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
  if (event.key === "Delete" && selectedShapeIndex !== null) {
    // Filter out the shape at the selected index
    const filteredShapes = shapes.filter(
      (_, index) => index !== selectedShapeIndex
    );
    setShapes(filteredShapes);

    // Redraw all remaining shapes
    drawAllShapes();
  }

  // Handle Control + C (copy)
  if (event.ctrlKey && event.key === "c" && selectedShapeIndex !== null) {
    // Copy the selected shape
    const shapeToCopy = shapes[selectedShapeIndex];
    setCopiedShape(shapeToCopy); // Store the copied shape
  }

  // Handle Control + V (paste)
  if (event.ctrlKey && event.key === "v" && copiedShape) {
    // Paste the copied shape to the right of the original shape
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
