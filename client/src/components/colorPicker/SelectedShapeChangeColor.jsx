"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Tooltip, Popover, IconButton, Typography } from "@mui/material";
import { FaFillDrip } from "react-icons/fa";
import { IoMdColorFilter } from "react-icons/io";
import { ChromePicker } from "react-color";
import { changeFillColor } from "../../utils/otherFunctions"; // Add your utility functions
import { ColorLens, FormatColorText } from "@mui/icons-material";
const SelectedShapeChangeColor = ({
  selectedShape,
  drawAllShapes,
  selectedShapeIndex,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const colorPickerRef = useRef(null);
  const [pickerType, setPickerType] = useState("fill");
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the Popover

  const handleOpenColorPicker = (pickerType, event) => {
    setPickerType(pickerType);
    setAnchorEl(event.currentTarget); // Set anchor to the clicked button
    setShowColorPicker(true);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    if (pickerType === "fill") {
      changeFillColor(pickerType, selectedShapeIndex, color.hex, drawAllShapes);
    } else if (pickerType === "stroke") {
      changeFillColor(pickerType, selectedShapeIndex, color.hex, drawAllShapes);
    }
  };

  const handleClickOutside = (event) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target)
    ) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <>
      {/* Title */}
      <Typography
        sx={{ color: "#b8b0b0", fontSize: "12px", margin: "0 auto", mt: 0.5 }}
      >
        Colors
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Change Fill Color */}
        {!["text", "pen", "line"].includes(selectedShape?.type) && (
          <Tooltip title="Change Fill Color" arrow>
            <IconButton
              onClick={(e) => handleOpenColorPicker("fill", e)}
              style={{ color: selectedShape?.fill }}
            >
              <ColorLens fontSize="medium" />
            </IconButton>
          </Tooltip>
        )}

        {/* Change Stroke Color */}
        <Tooltip title="Change Stroke Color" arrow>
          <IconButton
            onClick={(e) => handleOpenColorPicker("stroke", e)}
            style={{ color: selectedShape?.color }}
          >
            <FormatColorText fontSize="medium" />
          </IconButton>
        </Tooltip>

        {/* Color Picker Popup */}
        <Popover
          open={showColorPicker}
          anchorEl={anchorEl}
          onClose={() => setShowColorPicker(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            sx: {
              maxWidth: 400, // Adjust max width if necessary
              overflow: "hidden", // Prevent overflowing content
              "& .MuiPopover-paper": {
                maxWidth: "100%", // Ensures that the popover width doesn't exceed screen width
              },
            },
          }}
        >
          <Box ref={colorPickerRef}>
            <ChromePicker
              color={currentColor}
              onChangeComplete={handleColorChange}
            />
          </Box>
        </Popover>
      </Box>
    </>
  );
};

export default SelectedShapeChangeColor;
