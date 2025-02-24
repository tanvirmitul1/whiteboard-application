import React from "react";
import { Box, Button, Tooltip } from "@mui/material";

const ClearButton = ({ clearCanvas, shapes }) => {
  const isDisabled = shapes?.length === 0;
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        textTransform: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out",
        pointerEvents: isDisabled ? "none" : "auto",
      }}
      onClick={clearCanvas}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    >
      <Tooltip title="Clear Canvas" arrow>
        <img
          style={{ width: "35px", height: "35px", cursor: "pointer" }}
          src="https://i.ibb.co.com/TBwZbvMm/pngfind-com-clear-button-png-3492865.png"
          alt="Clear"
        />
      </Tooltip>
    </Box>
  );
};

export default ClearButton;
