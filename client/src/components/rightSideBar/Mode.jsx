import React from "react";
import { useSelector } from "react-redux";
import { useTheme, Box, Typography, Paper, useMediaQuery } from "@mui/material";
import { Edit, PanTool } from "@mui/icons-material"; // Icons for draw and move modes
import { useDispatch } from "react-redux";
import { toggleMode } from "../../slices/canvasSlice";

const Mode = () => {
  const theme = useTheme();
  const mode = useSelector((state) => state.canvas.mode); // Modes are draw/move
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile view
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 2 : 10,
        right: isMobile ? 0 : 10,
        padding: isMobile ? "2px" : "10px",
        borderRadius: "12px",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        zIndex: 1000,
        transform: isMobile ? "scale(0.7)" : "scale(1)", // Scale down for mobile
        transition: "transform 0.2s ease-in-out",
        maxWidth: isMobile ? "100%" : "150px", // Full width on mobile
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => dispatch(toggleMode())}
    >
      {mode === "draw" ? (
        <Edit
          sx={{
            color: theme.palette.primary.main,
            fontSize: isMobile ? "1.2rem" : "1.3rem", // Smaller icon for mobile
          }}
        />
      ) : (
        <PanTool
          sx={{
            color: theme.palette.secondary.main,
            fontSize: isMobile ? "1.2rem" : "1.3rem", // Smaller icon for mobile
          }}
        />
      )}
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          fontSize: isMobile ? "0.9rem" : "1rem", // Smaller text for mobile
          color:
            mode === "draw"
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
        }}
      >
        {mode === "draw" ? "Drawing" : "Moving"}
      </Typography>
    </Box>
  );
};

export default Mode;
