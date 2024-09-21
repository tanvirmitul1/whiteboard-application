import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDrawingByIdQuery } from "../Apis/whiteboardApiSlice";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { drawShapes } from "../components/DrawShapes";
import DownloadIcon from "@mui/icons-material/Download";

const ViewSingleDrawingPage = () => {
  const { drawingId } = useParams();
  const navigate = useNavigate();
  const [resolution, setResolution] = useState(1);
  const { data: drawing, error, isLoading } = useGetDrawingByIdQuery(drawingId);

  useEffect(() => {
    const canvas = document.getElementById("drawingCanvas");

    // Function to draw shapes
    const draw = () => {
      if (drawing) {
        drawShapes(canvas, drawing.shapes);
      }
    };

    // Function to resize canvas
    const resizeCanvas = () => {
      if (!canvas) return; // Check if canvas is null
      const container = canvas.parentElement;
      canvas.width = container.clientWidth; // Set canvas width
      canvas.height = container.clientHeight; // Set canvas height
      draw(); // Redraw shapes after resizing
    };

    resizeCanvas(); // Initial size
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
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">{drawing.drawingTitle}</Typography>

      <Box
        sx={{
          border: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
          width: "90vw",
          height: "70vh",
          position: "relative",
        }}
      >
        <canvas
          id="drawingCanvas"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </Box>

      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          height: "40px",
        }}
      >
        <FormControl sx={{ marginBottom: 2, width: 100 }} size="small">
          <InputLabel>Resolution</InputLabel>
          <Select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            <MenuItem value={1}>1x</MenuItem>
            <MenuItem value={2}>2x</MenuItem>
            <MenuItem value={3}>3x</MenuItem>
            <MenuItem value={4}>4x</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          size="small"
        >
          <DownloadIcon /> <span>Download</span>
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(-1)}
          color="secondary"
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ViewSingleDrawingPage;
