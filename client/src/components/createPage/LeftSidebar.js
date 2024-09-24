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
  const { id } = useParams();
  return (
    <Box className="left-sidebar-container">
      <TextField
        // label="Title"
        value={drawingTitle}
        onChange={(e) => setDrawingTitle(e.target.value)}
        size="small"
        sx={{ color: "white", label: { color: "white" } }}
        InputProps={{
          style: { color: "white", fontSize: "12px" },
        }}
      />
      <Box className="button-container">
        {/* Shape selection buttons */}
        <Tooltip title="Pen" arrow>
          <IconButton
            color={shapeType === "pen" ? "primary" : "default"}
            onClick={() => setShapeType("pen")}
          >
            <GestureTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Line" arrow>
          <IconButton
            color={shapeType === "line" ? "primary" : "default"}
            onClick={() => setShapeType("line")}
          >
            <DriveFileRenameOutlineTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Circle" arrow>
          <IconButton
            color={shapeType === "circle" ? "primary" : "default"}
            onClick={() => setShapeType("circle")}
          >
            <CircleTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rectangle" arrow>
          <IconButton
            color={shapeType === "rectangle" ? "primary" : "default"}
            onClick={() => setShapeType("rectangle")}
          >
            <RectangleTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eraser" arrow>
          <IconButton
            color={shapeType === "eraser" ? "primary" : "default"}
            onClick={() => setShapeType("eraser")}
          >
            <LuEraser />
          </IconButton>
        </Tooltip>
        <Tooltip title="Text" arrow>
          <IconButton
            color={shapeType === "text" ? "primary" : "default"}
            onClick={() => setShapeType("text")}
          >
            <RttTwoToneIcon />
          </IconButton>
        </Tooltip>

        {/* Undo and Redo buttons */}
        <Box className="undo-redo-container">
          <Tooltip title="Undo" arrow>
            <IconButton onClick={handleUndo}>
              <UndoTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo" arrow>
            <IconButton onClick={handleRedo}>
              <RedoTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Save button and other options */}
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
