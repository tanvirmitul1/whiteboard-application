import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, ToggleButton, Tooltip } from "@mui/material";
import DrawIcon from "@mui/icons-material/Draw";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { toggleMode } from "../../slices/canvasSlice";
import { FiMove } from "react-icons/fi";
import { MdOutlineDraw } from "react-icons/md";

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
    </Box>
  );
};

export default ModeToggleButton;
