import React from "react";
import { Button } from "@mui/material";

const ClearButton = ({ clearCanvas, shapes }) => {
  return (
    <Button
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        textTransform: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      variant="contained"
      color="error"
      size="small"
      onClick={clearCanvas}
      disabled={shapes.length === 0}
    >
      Clear
    </Button>
  );
};

export default ClearButton;
