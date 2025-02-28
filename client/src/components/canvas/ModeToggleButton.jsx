import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import DrawIcon from "@mui/icons-material/Draw";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { toggleMode } from "../../slices/canvasSlice";

const ModeToggleButton = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.canvas.mode);

  const handleChange = () => {
    dispatch(toggleMode());
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleChange}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.5,
        padding: "4px",
        position: "absolute",
        top: 10,
        left: 10,

        // Background color for dark mode
        backgroundColor: "#333", // Dark background for the button group in dark mode
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",

        "& .MuiToggleButton-root": {
          padding: "5px 10px",
          fontSize: "10px",
          fontWeight: "bold",
          transition: "all 0.3s ease-in-out",
          minWidth: "36px",
          color: "white", // Light text for dark background
          backgroundColor: "transparent", // Transparent background for each button
          borderColor: "#555", // Light border for buttons
          "&:hover": {
            backgroundColor: "#444", // Darker background on hover
            borderColor: "#777", // Hover border color
          },
        },
        "& .Mui-selected": {
          backgroundColor: "#1976d2", // Blue background when selected
          color: "white", // White text when selected
          "&:hover": {
            backgroundColor: "#1565c0", // Darker blue on hover when selected
          },
        },
      }}
    >
      <Tooltip title="Draw Mode" arrow>
        <ToggleButton value="draw">
          <DrawIcon sx={{ fontSize: 16 }} />
        </ToggleButton>
      </Tooltip>

      <Tooltip title="Move Shapes" arrow>
        <ToggleButton value="move">
          <OpenWithIcon sx={{ fontSize: 16 }} />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export default ModeToggleButton;
