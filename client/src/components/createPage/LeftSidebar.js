import React from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
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

const LeftSidebar = ({
  drawingTitle,
  setDrawingTitle,
  shapeType,
  setShapeType,
  isLoading,
  handleSaveDrawing,
  handleUndo,
  handleRedo,
}) => {
  const { colors } = useColors();

  //remove save button for edit mode
  const { id } = useParams();

  return (
    <Box className="left-sidebar-container">
      <input
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
