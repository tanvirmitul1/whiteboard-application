import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, ToggleButton, Tooltip } from "@mui/material";
import DrawIcon from "@mui/icons-material/Draw";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { toggleMode } from "../../slices/canvasSlice";
import { indigo } from "@mui/material/colors";

const color = indigo["A100"];
const ModeToggleButton = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.canvas.mode);

  const handleChange = () => {
    dispatch(toggleMode());
  };

  const isDrawMode = mode === "draw";

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
            <span style={{ opacity: 0.6 }}>(Press Shift)</span>
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
            <DrawIcon sx={{ fontSize: 20, color: "#4dd0e1" }} />
          ) : (
            <OpenWithIcon sx={{ fontSize: 20, color: "#4dd0e1" }} />
          )}
        </ToggleButton>
      </Tooltip>
    </Box>
  );
};

export default ModeToggleButton;
