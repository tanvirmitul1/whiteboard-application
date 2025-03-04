import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Popover, Typography } from "@mui/material";
import {
  GestureTwoTone as PenIcon,
  DriveFileRenameOutlineTwoTone as LineIcon,
  CircleTwoTone as CircleIcon,
  RectangleTwoTone as RectangleIcon,
  ChangeHistory as TriangleIcon,
  Pentagon as PentagonIcon,
  Hexagon as HexagonIcon,
  RttTwoTone as TextIcon,
  UndoTwoTone as UndoIcon,
  RedoTwoTone as RedoIcon,
  ColorLens as BgColorIcon,
  FormatColorText as DrawColorIcon,
  FormatColorFill as FillColorIcon,
  DeleteOutline as EraserIcon,
  BrushOutlined as BrushIcon,
} from "@mui/icons-material";
import { ChromePicker } from "react-color";
import { useParams } from "react-router-dom";
import useColors from "../../customHooks/useColors";
import CreatePageButtons from "./CreatePageButtons";
import { useTheme } from "@mui/material/styles";
import PopoverBrushSelector from "../canvas/PopoverBrushSelector";

const shapeOptions = [
  { type: "pen", label: "Pen", icon: <PenIcon /> },
  { type: "brush", label: "Brush", icon: <BrushIcon /> },
  { type: "line", label: "Line", icon: <LineIcon /> },
  { type: "circle", label: "Circle", icon: <CircleIcon /> },
  { type: "rectangle", label: "Rectangle", icon: <RectangleIcon /> },
  { type: "triangle", label: "Triangle", icon: <TriangleIcon /> },
  { type: "pentagon", label: "Pentagon", icon: <PentagonIcon /> },
  { type: "hexagon", label: "Hexagon", icon: <HexagonIcon /> },
  { type: "text", label: "Text", icon: <TextIcon /> },
  { type: "eraser", label: "Eraser", icon: <EraserIcon /> },
];

const LeftSidebar = ({
  drawingTitle,
  setDrawingTitle,
  shapeType,
  setShapeType,
  drawColor,
  setDrawColor,
  backgroundColor,
  setBackgroundColor,
  fillColor,
  setFillColor,
  isFillColorActive,
  setIsFillColorActive,
  handleUndo,
  handleRedo,
  handleSaveDrawing,
  isLoading,
}) => {
  const { id } = useParams();
  const inputRef = useRef(null);
  const theme = useTheme();
  // useEffect(() => inputRef.current.focus(), []);
  const [colorPickers, setColorPickers] = useState({
    draw: null,
    bg: null,
    fill: null,
  });

  const handleColorClick = (type) => (event) =>
    setColorPickers({ ...colorPickers, [type]: event.currentTarget });

  const handleColorClose = (type) => () =>
    setColorPickers({ ...colorPickers, [type]: null });

  const renderColorPicker = (type, color, setColor, IconComponent, title) => (
    <div>
      <Tooltip title={title} arrow>
        <IconButton onClick={handleColorClick(type)}>
          <IconComponent sx={{ color: theme.palette.text.primary }} />{" "}
          {/* Using theme color */}
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          height: "5px",
          width: "25px",
          backgroundColor: color,
          margin: "4px auto 0",
          borderRadius: "3px",
          boxShadow: "0 0 2px rgba(0,0,0,0.5)",
        }}
      />
      <Popover
        open={Boolean(colorPickers[type])}
        anchorEl={colorPickers[type]}
        onClose={handleColorClose(type)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <ChromePicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
      </Popover>
    </div>
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  const handleIconClick = (event, type) => {
    setShapeType(type);
    if (type === "brush") {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <Box className="left-sidebar-container">
      <input
        ref={inputRef}
        value={drawingTitle}
        onChange={(e) => setDrawingTitle(e.target.value)}
        className="text-field"
        placeholder="Enter Title..."
      />
      <Box className="button-container">
        {/* Shape Selection Buttons */}
        {shapeOptions.map(({ type, label, icon }) => (
          <Tooltip key={type} title={label} arrow>
            <IconButton
              aria-describedby={popoverId}
              sx={{
                padding: "8px",
                backgroundColor:
                  shapeType === type
                    ? theme.palette.primary.main // Using theme color
                    : "transparent",
                color:
                  shapeType === type
                    ? theme.palette.common.white
                    : theme.palette.text.primary,
                transition: "color 0.3s ease",
                fontSize: "1.2rem",
              }}
              onClick={(e) => handleIconClick(e, type)}
            >
              {React.cloneElement(icon, {
                sx: {
                  fontSize: "1.5rem", // Adjust icon size
                },
              })}
            </IconButton>
          </Tooltip>
        ))}

        <PopoverBrushSelector
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          handleClose={handleClose}
        />

        <Box className="color-pickers-container">
          {/* Color Pickers */}
          {renderColorPicker(
            "bg",
            backgroundColor,
            setBackgroundColor,
            BgColorIcon,
            "Background Color"
          )}
          {renderColorPicker(
            "draw",
            drawColor,
            setDrawColor,
            DrawColorIcon,
            "Draw Color"
          )}
          {renderColorPicker(
            "fill",
            fillColor,
            setFillColor,
            FillColorIcon,
            "Fill Color"
          )}
        </Box>
        {/* Undo & Redo Buttons */}
        <Box className="undo-redo-container">
          <Tooltip title="Undo" arrow>
            <IconButton onClick={handleUndo} sx={{ padding: "2px" }}>
              <UndoIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo" arrow>
            <IconButton onClick={handleRedo} sx={{ padding: "2px" }}>
              <RedoIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {!id && (
        <CreatePageButtons
          handleSaveDrawing={handleSaveDrawing}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
};

export default LeftSidebar;
