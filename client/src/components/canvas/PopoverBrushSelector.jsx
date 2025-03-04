import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  Typography,
  MenuItem,
  MenuList,
  Slider,
  Input,
  Box,
} from "@mui/material";
import { setBrush, updateBrushProperty } from "../../slices/brushSlice";

const PopoverBrushSelector = ({ open, anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const currentBrush = useSelector((state) => state.brush.currentBrush);
  const handlePropertyChange = (key, value) => {
    dispatch(updateBrushProperty({ key, value }));
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 200 }}>
        {/* Size Slider */}
        <Typography variant="subtitle2">Size: {currentBrush.size}</Typography>
        <Slider
          value={currentBrush.size}
          min={1}
          max={50}
          onChange={(e, newValue) => handlePropertyChange("size", newValue)}
        />

        {/* Hardness Slider */}
        <Typography variant="subtitle2">
          Hardness: {currentBrush.hardness}
        </Typography>
        <Slider
          value={currentBrush.hardness}
          min={0}
          max={1}
          step={0.1}
          onChange={(e, newValue) => handlePropertyChange("hardness", newValue)}
        />

        {/* Color Picker */}
        <Typography variant="subtitle2">Color</Typography>
        <Input
          type="color"
          value={currentBrush.color}
          onChange={(e) => handlePropertyChange("color", e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>
    </Popover>
  );
};

export default PopoverBrushSelector;
