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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaPencilAlt, FaStar, FaDiceD20 } from "react-icons/fa";
import { IoIosBrush } from "react-icons/io";
import { BiSprayCan } from "react-icons/bi";
import { GiWaterDrop, GiTreeBranch } from "react-icons/gi";

import { BsTextCenter } from "react-icons/bs";
import {
  setBrush,
  updateBrushProperty,
  setBrushType,
} from "../../slices/brushSlice";

const PopoverBrushSelector = ({ open, anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const currentBrush = useSelector((state) => state.brush.currentBrush);
  const brushTypes = useSelector((state) => state.brush.brushTypes);

  const handlePropertyChange = (key, value) => {
    dispatch(updateBrushProperty({ key, value }));
  };

  const handleBrushTypeChange = (event) => {
    dispatch(setBrushType(event.target.value));
  };

  // Define icon mapping for brush types
  const brushIcons = {
    pencil: <FaPencilAlt />,
    star: <FaStar />,
    diamond: <FaDiceD20 />,
    spray: <BiSprayCan />,
    wet: <GiWaterDrop />,
    nature: <GiTreeBranch />,
    pixel: <FaPencilAlt />,
    texture: <IoIosBrush />,
    calligraphy: <BsTextCenter />,
    airbrush: <BiSprayCan />,
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 250 }}>
        {/* Brush Type Selector */}
        <Typography variant="subtitle2">Brush Type</Typography>
        <FormControl fullWidth>
          <Select
            value={currentBrush.type}
            onChange={handleBrushTypeChange}
            label="Brush Type"
          >
            {brushTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {brushIcons[type]} {/* Display corresponding icon */}
                  <Typography sx={{ marginLeft: 1 }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Size Slider */}
        <Typography variant="subtitle2">Size: {currentBrush.size}</Typography>
        <Slider
          value={currentBrush.size}
          min={1}
          max={100}
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
          step={0.01}
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
