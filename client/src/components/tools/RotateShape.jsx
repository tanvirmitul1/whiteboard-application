import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";
import { rotateShape } from "../../utils/resizeShape";
import { IconButton, Tooltip } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";

const RotateShape = ({ selectedShape, selectedShapeIndex, drawAllShapes }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);

  const handleRotate = (shape, angle) => {
    const updatedShape = rotateShape(shape, angle);
    dispatch(
      setShapes(
        shapes.map((shape, index) =>
          index === selectedShapeIndex ? updatedShape : shape
        )
      )
    );
    drawAllShapes();
  };

  const handleRotateClockwise = () => {
    if (selectedShape) {
      handleRotate(selectedShape, 90); // Rotate 15° Clockwise
    }
  };

  const handleRotateAnticlockwise = () => {
    if (selectedShape) {
      handleRotate(selectedShape, -90); // Rotate 15° Anticlockwise
    }
  };

  return (
    <div>
      <Tooltip title="Rotate Anti-clockwise" arrow>
        <IconButton
          sx={{ color: "#b8b0b0" }}
          onClick={handleRotateAnticlockwise}
        >
          <RotateLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rotate Clockwise" arrow>
        <IconButton sx={{ color: "#b8b0b0" }} onClick={handleRotateClockwise}>
          <RotateRightIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default RotateShape;
