export const resizeShape = (shape, newSize) => {
  const { type, start, end, position, text, fontSize } = shape;

  switch (type) {
    case "line":
      const lineLength = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      const lineScale = newSize / lineLength; // Renamed the variable to avoid clash
      return {
        ...shape,
        end: {
          x: start.x + (end.x - start.x) * lineScale,
          y: start.y + (end.y - start.y) * lineScale,
        },
      };

    case "circle":
      // Calculate the radius based on the distance from start to end points
      const radius =
        Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) /
        2;

      // Calculate the scale factor based on the new size
      const circleScale = newSize / (radius * 2); // Use diameter for resizing

      return {
        ...shape,
        start: {
          x: start.x - radius * (circleScale - 1),
          y: start.y - radius * (circleScale - 1),
        },
        end: {
          x: start.x + radius * (circleScale + 1),
          y: start.y + radius * (circleScale + 1),
        },
      };

    case "rectangle":
      // Resize only width or height, not both, to prevent it from becoming a square
      const width = end.x - start.x;
      const height = end.y - start.y;

      // Adjust width and height proportionally
      return {
        ...shape,
        end: {
          x: start.x + newSize, // Update width
          y: start.y + (height / width) * newSize, // Maintain aspect ratio
        },
      };

    case "text":
      return {
        ...shape,
        fontSize: newSize, // Adjusting text size
      };

    case "pentagon":
    case "hexagon":
    case "triangle":
      // Adjust the size proportionally for other shapes
      const scaleRatio =
        newSize /
        Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      return {
        ...shape,
        end: {
          x: start.x + (end.x - start.x) * scaleRatio,
          y: start.y + (end.y - start.y) * scaleRatio,
        },
      };

    default:
      return shape;
  }
};
