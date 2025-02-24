import React, { useState } from "react";
import {
  copyShape,
  deleteShape,
  pasteShape,
  takeToBack,
  takeToFront,
} from "../../utils/otherFunctions";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  FileCopy,
  Delete,
} from "@mui/icons-material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const Tools = ({ selectedShapeIndex, drawAllShapes }) => {
  const [copiedShape, setCopiedShape] = useState(null);

  const handleDelete = () => {
    deleteShape(selectedShapeIndex, drawAllShapes);
  };

  const handleCopy = () => {
    copyShape(selectedShapeIndex, setCopiedShape);
  };

  const handlePaste = () => {
    pasteShape(copiedShape, drawAllShapes);
  };

  const handleTakeToFront = () => {
    takeToFront(selectedShapeIndex, drawAllShapes);
  };

  const handleTakeToBack = () => {
    takeToBack(selectedShapeIndex, drawAllShapes);
  };

  return (
    <>
      <Typography
        sx={{ color: "#b8b0b0", fontSize: "12px", margin: "0 auto", mt: 0.5 }}
      >
        Tools
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Copy Shape" arrow>
          <IconButton onClick={handleCopy} color="primary">
            <FileCopy />
          </IconButton>
        </Tooltip>

        <Tooltip title="Paste Shape" arrow>
          <IconButton
            sx={{ mouseEvents: `${copiedShape ? "auto" : "none"}` }}
            onClick={handlePaste}
            color="primary"
          >
            <ContentPasteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bring to Front" arrow>
          <IconButton onClick={handleTakeToFront} color="secondary">
            <ArrowUpward />
          </IconButton>
        </Tooltip>

        <Tooltip title="Send to Back" arrow>
          <IconButton onClick={handleTakeToBack} color="secondary">
            <ArrowDownward />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Shape" arrow>
          <IconButton onClick={handleDelete} color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default Tools;
