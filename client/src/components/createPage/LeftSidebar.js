import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, IconButton, Tooltip, Popover } from "@mui/material";
import DriveFileRenameOutlineTwoToneIcon from "@mui/icons-material/DriveFileRenameOutlineTwoTone";
import GestureTwoToneIcon from "@mui/icons-material/GestureTwoTone";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import RectangleTwoToneIcon from "@mui/icons-material/RectangleTwoTone";
import { LuEraser } from "react-icons/lu";
import RttTwoToneIcon from "@mui/icons-material/RttTwoTone";
import UndoTwoToneIcon from "@mui/icons-material/UndoTwoTone";
import RedoTwoToneIcon from "@mui/icons-material/RedoTwoTone";
import CreatePageButtons from "./CreatePageButtons";
import { useParams } from "react-router-dom";
import useColors from "../../customHooks/useColors";
import { ChromePicker } from "react-color";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
const LeftSidebar = ({
  drawingTitle,
  setDrawingTitle,
  shapeType,
  setShapeType,
  isLoading,
  handleSaveDrawing,
  handleUndo,
  handleRedo,
  drawColor,
  setDrawColor,
  backgroundColor,
  setBackgroundColor,
  fillColor,
  setFillColor,
  isFillColorActive,
  setIsFillColorActive,
}) => {
  const { colors } = useColors();

  //remove save button for edit mode
  const { id } = useParams();
  const [drawAnchorEl, setDrawAnchorEl] = useState(null);
  const [bgAnchorEl, setBgAnchorEl] = useState(null);
  const [fillAnchorEl, setFillAnchorEl] = useState(null);

  const handleDrawClick = (event) => {
    setDrawAnchorEl(event.currentTarget);
  };

  const handleBgClick = (event) => {
    setBgAnchorEl(event.currentTarget);
  };

  const handleFillClick = (event) => {
    setFillAnchorEl(event.currentTarget);
    setIsFillColorActive(true);
  };

  const handleDrawClose = () => {
    setDrawAnchorEl(null);
  };

  const handleBgClose = () => {
    setBgAnchorEl(null);
  };

  const handleFillClose = () => {
    setFillAnchorEl(null);
  };

  const drawOpen = Boolean(drawAnchorEl);
  const bgOpen = Boolean(bgAnchorEl);
  const fillOpen = Boolean(fillAnchorEl);
  const inputRef = useRef(null); // Create a ref for the input

  useEffect(() => {
    inputRef.current.focus(); // Set focus to the input on component mount
  }, []);
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
        {/* Shape selection buttons */}
        <Tooltip title="Pen" arrow>
          <IconButton onClick={() => setShapeType("pen")}>
            <GestureTwoToneIcon
              sx={{
                color: shapeType === "pen" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Line" arrow>
          <IconButton onClick={() => setShapeType("line")}>
            <DriveFileRenameOutlineTwoToneIcon
              sx={{
                color:
                  shapeType === "line" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Circle" arrow>
          <IconButton onClick={() => setShapeType("circle")}>
            <CircleTwoToneIcon
              sx={{
                color:
                  shapeType === "circle" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rectangle" arrow>
          <IconButton onClick={() => setShapeType("rectangle")}>
            <RectangleTwoToneIcon
              sx={{
                color:
                  shapeType === "rectangle"
                    ? colors.buttonBg
                    : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Triangle" arrow>
          <IconButton onClick={() => setShapeType("triangle")}>
            <ChangeHistoryIcon
              sx={{
                color:
                  shapeType === "triangle" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eraser" arrow>
          <IconButton onClick={() => setShapeType("eraser")}>
            <LuEraser
              style={{
                color:
                  shapeType === "eraser" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Text" arrow>
          <IconButton onClick={() => setShapeType("text")}>
            <RttTwoToneIcon
              sx={{
                color:
                  shapeType === "text" ? colors.buttonBg : colors.textColor,
              }}
            />
          </IconButton>
        </Tooltip>
        <div>
          {/* Background Color */}
          <Tooltip title="Background Color" arrow>
            <IconButton onClick={handleBgClick}>
              <ColorLensIcon sx={{ color: colors.textColor }} />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              height: "5px",
              width: "25px",
              backgroundColor: backgroundColor,
              margin: "4px auto 0",
              borderRadius: "3px",
              boxShadow: "0 0 2px rgba(0,0,0,0.5)",
            }}
          />
          <Popover
            open={bgOpen}
            anchorEl={bgAnchorEl}
            onClose={handleBgClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ChromePicker
              color={backgroundColor}
              onChangeComplete={(color) => {
                setBackgroundColor(color.hex);
              }}
            />
          </Popover>
        </div>
        <div>
          {/* Draw Color */}
          <Tooltip title=" Draw color" arrow>
            <IconButton onClick={handleDrawClick}>
              <FormatColorTextIcon sx={{ color: colors.textColor }} />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              height: "5px",
              width: "25px",
              backgroundColor: drawColor,
              margin: "4px auto 0",
              borderRadius: "3px",
              boxShadow: "0 0 2px rgba(0,0,0,0.5)",
            }}
          />
          <Popover
            open={drawOpen}
            anchorEl={drawAnchorEl}
            onClose={handleDrawClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ChromePicker
              color={drawColor}
              onChangeComplete={(color) => {
                setDrawColor(color.hex);
              }}
            />
          </Popover>
        </div>
        <div>
          {/* fill Color */}
          <Tooltip
            title={
              isFillColorActive
                ? "Press Esc to remove fill color mode"
                : "Fill color"
            }
            arrow
          >
            <IconButton
              onClick={handleFillClick}
              sx={{
                backgroundColor: isFillColorActive ? "#242441" : "transparent", // Highlight when active
                transition: "background-color 0.3s ease",
              }}
            >
              <FormatColorFillIcon
                sx={{
                  color: isFillColorActive ? "#00796b" : "white", // Change icon color when active
                }}
              />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              height: "5px",
              width: "25px",
              backgroundColor: fillColor,
              margin: "4px auto 0",
              borderRadius: "3px",
              boxShadow: "0 0 2px rgba(0,0,0,0.5)",
            }}
          />
          <Popover
            open={fillOpen}
            anchorEl={fillAnchorEl}
            onClose={handleFillClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ChromePicker
              color={fillColor}
              onChangeComplete={(color) => {
                setFillColor(color.hex);
              }}
            />
          </Popover>
        </div>

        <Box className="undo-redo-container">
          <Tooltip title="Undo" arrow>
            <IconButton onClick={handleUndo}>
              <UndoTwoToneIcon sx={{ color: colors.textColor }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo" arrow>
            <IconButton onClick={handleRedo}>
              <RedoTwoToneIcon sx={{ color: colors.textColor }} />
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
