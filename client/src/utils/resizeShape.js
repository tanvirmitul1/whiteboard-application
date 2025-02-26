export const resizeShape = (shape, newSize) => {
  const { type, start, end, position, text, fontSize, width, height } = shape;
  console.log({ width, height });

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
      // Rename width and height variables to avoid conflict
      const rectWidth = end.x - start.x;
      const rectHeight = end.y - start.y;

      // Adjust width and height proportionally
      return {
        ...shape,
        end: {
          x: start.x + newSize, // Update width
          y: start.y + (rectHeight / rectWidth) * newSize, // Maintain aspect ratio
        },
      };

    case "text":
      return {
        ...shape,
        fontSize: newSize, // Adjusting text size
      };
    case "image":
      // Resize image width and height
      const aspectRatio = width / height;
      const newWidth = newSize;
      const newHeight = newWidth / aspectRatio;

      return {
        ...shape,
        width: newWidth,
        height: newHeight,
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

export const getShapeSize = (shape) => {
  switch (shape?.type) {
    case "line":
      return calculateLineSize(shape);
    case "circle":
      return calculateCircleSize(shape);
    case "rectangle":
      return calculateRectangleSize(shape);
    case "triangle":
      return calculateTriangleSize(shape);
    case "pentagon":
      return calculatePentagonSize(shape);
    case "hexagon":
      return calculateHexagonSize(shape);
    case "text":
      return shape.fontSize;
    default:
      return 50; // Default size if no shape is matched
  }
};

export const calculateLineSize = (shape) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    )
  );
};

export const calculateCircleSize = (shape) => {
  const radius =
    Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    ) / 2;
  return Math.floor(radius * 2);
};

export const calculateRectangleSize = (shape) => {
  const rectWidth = shape.end.x - shape.start.x;
  const rectHeight = shape.end.y - shape.start.y;
  return Math.floor(Math.max(rectWidth, rectHeight));
};

export const calculateTriangleSize = (shape) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    )
  );
};

export const calculatePentagonSize = (shape) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    )
  );
};

export const calculateHexagonSize = (shape) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(shape.end.x - shape.start.x, 2) +
        Math.pow(shape.end.y - shape.start.y, 2)
    )
  );
};

export const rotateShape = (shape, angle) => {
  const { type, start, end, width, height, x, y } = shape;
  const angleRad = (angle * Math.PI) / 180; // Convert degrees to radians

  // Function to rotate a point around a center
  const rotatePoint = (point, center, angleRad) => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: center.x + (point.x - center.x) * cos - (point.y - center.y) * sin,
      y: center.y + (point.x - center.x) * sin + (point.y - center.y) * cos,
    };
  };

  switch (type) {
    case "line":
    case "rectangle":
    case "circle":
    case "triangle":
    case "pentagon":
    case "hexagon":
      // Calculate center of shape (for most shapes, it's the center of the bounding box)
      const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };
      // Rotate the start and end points
      const newStart = rotatePoint(start, center, angleRad);
      const newEnd = rotatePoint(end, center, angleRad);

      return {
        ...shape,
        start: newStart,
        end: newEnd,
      };

    case "image":
      // Calculate the center of the image
      const imageCenter = {
        x: x + width / 2,
        y: y + height / 2,
      };
      // Rotate the image position
      const newPosition = rotatePoint({ x, y }, imageCenter, angleRad);
      return {
        ...shape,
        x: newPosition.x,
        y: newPosition.y,
      };

    default:
      return shape;
  }
};
