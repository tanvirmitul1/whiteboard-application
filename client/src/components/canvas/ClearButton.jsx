import React from "react";
import { Box, Button, Tooltip } from "@mui/material";

const ClearButton = ({ clearCanvas, shapes }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        textTransform: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={clearCanvas}
      disabled={shapes.length === 0}
    >
      <Tooltip title="Clear Canvas">
        <img
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
          src="https://i.ibb.co.com/TBwZbvMm/pngfind-com-clear-button-png-3492865.png"
          alt="Clear"
        />
      </Tooltip>
    </Box>
  );
};

export default ClearButton;
