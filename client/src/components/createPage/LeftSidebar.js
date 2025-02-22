import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Popover } from "@mui/material";
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
  Padding,
} from "@mui/icons-material";
import { ChromePicker } from "react-color";
import { useParams } from "react-router-dom";
import useColors from "../../customHooks/useColors";
import CreatePageButtons from "./CreatePageButtons";

const shapeOptions = [
  { type: "pen", label: "Pen", icon: <PenIcon /> },
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
  const { colors } = useColors();
  const { id } = useParams();
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus(), []);

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
          <IconComponent sx={{ color: colors.textColor }} />
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
              sx={{ padding: "8px" }}
              onClick={() => setShapeType(type)}
            >
              {React.cloneElement(icon, {
                sx: {
                  color:
                    shapeType === type ? colors.buttonBg : colors.textColor,
                  transition: "color 0.3s ease",
                  fontSize: "1.2rem",
                },
              })}
            </IconButton>
          </Tooltip>
        ))}

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
          <Tooltip
            title={
              isFillColorActive ? "Press Esc to remove fill mode" : "Fill Color"
            }
            arrow
          >
            <IconButton
              onClick={handleColorClick("fill")}
              sx={{
                backgroundColor: isFillColorActive ? "#242441" : "transparent",
                transition: "background-color 0.3s ease",
              }}
            >
              <FillColorIcon
                sx={{ color: isFillColorActive ? "#00796b" : "white" }}
              />
            </IconButton>
          </Tooltip>
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
              <UndoIcon sx={{ color: colors.textColor }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo" arrow>
            <IconButton onClick={handleRedo} sx={{ padding: "2px" }}>
              <RedoIcon sx={{ color: colors.textColor }} />
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
