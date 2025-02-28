import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, ToggleButton, Tooltip, Typography } from "@mui/material";
import { toggleMode } from "../../slices/canvasSlice";
import { FiMove } from "react-icons/fi";
import { MdOutlineDraw } from "react-icons/md";

const ModeToggleButton = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.canvas.mode);
  const [showText, setShowText] = useState(false); // State to control the visibility of the text

  const handleChange = () => {
    dispatch(toggleMode());
  };

  const isDrawMode = mode === "draw";

  // Handle the transition effect for the text visibility
  useEffect(() => {
    setShowText(true); // Show the text when mode changes
    const timer = setTimeout(() => {
      setShowText(false); // Hide the text after a short delay
    }, 500); // Duration of transition effect

    return () => clearTimeout(timer); // Cleanup the timeout when the component unmounts
  }, [mode]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.5,
        padding: "5px",
        position: "absolute",
        top: 0,
        left: 10,
      }}
    >
      <Tooltip
        title={
          <span>
            {isDrawMode ? "Activate Movement Mode" : "Activate Drawing Mode"}{" "}
            <span style={{ opacity: 0.6 }}>( Shift )</span>
          </span>
        }
        arrow
      >
        <ToggleButton
          value={mode}
          onClick={handleChange}
          sx={{
            padding: "8px",
            borderRadius: "50%",
            backgroundColor: "#333",
            color: "white",
            "&:hover": {
              backgroundColor: "#444",
            },
          }}
        >
          {isDrawMode ? (
            <MdOutlineDraw
              color="#4dd0e1"
              size={
                window.innerWidth < 600 ? 12 : window.innerWidth < 960 ? 15 : 20
              }
            />
          ) : (
            <FiMove
              color="#4dd0e1"
              size={
                window.innerWidth < 600 ? 12 : window.innerWidth < 960 ? 15 : 20
              }
            />
          )}
        </ToggleButton>
      </Tooltip>

      {showText && (
        <Typography
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: showText ? 0.4 : 0,
            transition: "opacity 0.3s ease-in-out",
            fontSize: "10px",
            color: "#fff",
          }}
        >
          {isDrawMode ? "Drawing Enabled" : "Movement Enabled"}
        </Typography>
      )}
    </Box>
  );
};

export default ModeToggleButton;
