"use client";
import React from "react";
import { Box, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";

const ColorPickerComponent = ({ ...props }) => {
  const {
    drawColor,
    setDrawColor,
    fillColor,
    setFillColor,
    backgroundColor,
    setBackgroundColor,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentColorType, setCurrentColorType] = React.useState(null);

  const handleOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setCurrentColorType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentColorType(null);
  };

  const handleColorChange = (color) => {
    switch (currentColorType) {
      case "draw":
        setDrawColor(color);
        break;
      case "fill":
        setFillColor(color);
        break;
      case "background":
        setBackgroundColor(color);
        break;
      default:
        break;
    }
  };

  // Mapping color types to their current color state
  const colorMapping = {
    draw: drawColor,
    fill: fillColor,
    background: backgroundColor,
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={{ xs: "column", sm: "row" }}
    >
      {/* Draw Color */}
      <Tooltip title="Draw Color" arrow>
        <IconButton onClick={(e) => handleOpen(e, "draw")}>
          <Box
            sx={{
              backgroundColor: drawColor,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2px solid #000",
              "&:hover": {
                cursor: "pointer",
                borderColor: "#888",
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Fill Color */}
      <Tooltip title="Fill Color" arrow>
        <IconButton onClick={(e) => handleOpen(e, "fill")}>
          <Box
            sx={{
              backgroundColor: fillColor,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2px solid #000",
              "&:hover": {
                cursor: "pointer",
                borderColor: "#888",
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Background Color */}
      <Tooltip title="Background Color" arrow>
        <IconButton onClick={(e) => handleOpen(e, "background")}>
          <Box
            sx={{
              backgroundColor: backgroundColor,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2px solid #000",
              "&:hover": {
                cursor: "pointer",
                borderColor: "#888",
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Color Picker Popup */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box sx={{ p: 2 }}>
          <HexColorPicker
            color={colorMapping[currentColorType] || "#000"} // Use mapped color or default to black
            onChange={handleColorChange}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPickerComponent;
