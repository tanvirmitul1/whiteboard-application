import { Button } from "@mui/material";
import React from "react";
import Swal from "sweetalert2";

const Clear = ({ shapes, setShapes, onShapesUpdate, canvasRef }) => {
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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setShapes([]);
      onShapesUpdate([]);
      localStorage.removeItem("shapes");
    }
  };
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

export default Clear;
