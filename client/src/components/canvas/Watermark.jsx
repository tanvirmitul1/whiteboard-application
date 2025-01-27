import React from "react";
import { Typography } from "@mui/material";

const Watermark = () => {
  return (
    <Typography
      variant="h6"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#b8b0b0",
        fontWeight: "bold",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
        opacity: ".1",
        pointerEvents: "none",
      }}
    >
      mitul@seopage1.net
    </Typography>
  );
};

export default Watermark;
