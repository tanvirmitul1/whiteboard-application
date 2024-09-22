import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDrawingByIdQuery } from "../Apis/whiteboardApiSlice";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { drawShapes } from "../components/DrawShapes";

import CommentsSection from "../components/viewSinglePage/CommentsSection";
import Download from "../components/viewSinglePage/Download";

const ViewSingleDrawingPage = () => {
  const { drawingId } = useParams();
  const [resolution, setResolution] = useState(1);
  const { data: drawing, error, isLoading } = useGetDrawingByIdQuery(drawingId);

  useEffect(() => {
    const canvas = document.getElementById("drawingCanvas");

    const draw = () => {
      if (drawing) {
        drawShapes(canvas, drawing.shapes);
      }
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawing]);

  const handleDownload = () => {
    const canvas = document.getElementById("drawingCanvas");
    const link = document.createElement("a");
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * resolution;
    scaledCanvas.height = canvas.height * resolution;

    const ctx = scaledCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    ctx.scale(resolution, resolution);
    ctx.drawImage(canvas, 0, 0);

    link.href = scaledCanvas.toDataURL("image/jpeg", 1);
    link.download = `${drawing.drawingTitle}.jpg`;
    link.click();
  };

  if (isLoading) {
    return <Typography align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Failed to load drawing</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: {
          xs: "10px",
          md: "20px",
        },
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          border: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
          position: "relative",
          maxHeight: "100vh",
          width: { xs: "100%", md: "60%" },
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <canvas
          id="drawingCanvas"
          style={{ maxHeight: "80vh", width: "100%" }}
        />

        <Download
          resolution={resolution}
          setResolution={setResolution}
          handleDownload={handleDownload}
        />
      </Box>

      <Box sx={{ width: { xs: "100%", md: "40%" } }}>
        <CommentsSection />
      </Box>
    </Box>
  );
};

export default ViewSingleDrawingPage;
