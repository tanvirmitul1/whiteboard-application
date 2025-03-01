import React from "react";
import { Box, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";

const ClearButton = ({ shapes, canvasRef }) => {
  const dispatch = useDispatch();
  const clearCanvas = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear this drawing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      const canvas = canvasRef?.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dispatch(setShapes([]));
      localStorage.removeItem("shapes");
    }
  };
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
          src="https://i.ibb.co.com/tpvjGMZM/pngfind-com-clear-button-png-3492865-removebg-preview.png"
          alt="Clear"
        />
      </Tooltip>
    </Box>
  );
};

export default ClearButton;
