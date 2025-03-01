import React from "react";
import { Box, Typography, IconButton, Zoom } from "@mui/material";

import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "../ThemeContext";
const ColorModeButton = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": { transform: "scale(1.1)" },
          mt: 1,
        }}
      >
        <Zoom in={true} style={{ transitionDuration: "300ms" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </span>
        </Zoom>
      </IconButton>
      <Typography
        onClick={toggleTheme}
        variant="body2"
        color={darkMode ? "text.secondary" : "text.primary"}
        mt={1}
        sx={{ cursor: "pointer" }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Typography>
    </Box>
  );
};

export default ColorModeButton;
