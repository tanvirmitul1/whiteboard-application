import React, { useState } from "react";
import { Slider, Tooltip, IconButton, Box, Typography } from "@mui/material";
import {
  MdRemove,
  MdAdd,
  MdLinearScale,
  MdRadioButtonUnchecked,
} from "react-icons/md";

const LineWidthSelector = ({ lineSettings, setLineSettings }) => {
  const { lineWidth } = lineSettings;

  const handleChange = (value) => {
    setLineSettings({ lineWidth: value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "5px",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: { xs: "12px", sm: "14px" },
        }}
      >
        Line Width
      </Typography>
      {/* Slider for Custom Line Width */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          gap: "5px",
        }}
      >
        <IconButton onClick={() => handleChange(Math.max(1, lineWidth - 1))}>
          <MdRemove size={20} />
        </IconButton>

        <Slider
          value={lineWidth}
          onChange={(_, value) => handleChange(value)}
          min={1}
          max={50}
          step={1}
          sx={{ color: "white", flex: 1 }}
        />

        <IconButton onClick={() => handleChange(Math.min(50, lineWidth + 1))}>
          <MdAdd size={20} />
        </IconButton>
      </Box>

      {/* Selected Line Width Display */}
      <Typography variant="body2" sx={{ mt: 1 }}>
        {lineWidth} px
      </Typography>
    </Box>
  );
};

export default LineWidthSelector;
