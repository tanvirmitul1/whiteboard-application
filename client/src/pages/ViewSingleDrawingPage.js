import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDrawingByIdQuery } from "../Apis/whiteboardApiSlice";
import {
  Avatar,
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { drawShapes } from "../components/DrawShapes";

import CommentsSection from "../components/viewSinglePage/CommentsSection";
import Download from "../components/viewSinglePage/Download";
import { formatDistanceToNow } from "date-fns";
import useColors from "../customHooks/useColors";

const ViewSingleDrawingPage = () => {
  const { colors } = useColors();
  const { drawingId } = useParams();
  const [resolution, setResolution] = useState(1);
  const { data: drawing, error, isLoading } = useGetDrawingByIdQuery(drawingId);

  useEffect(() => {
    const canvas = document.getElementById("drawingCanvas");

    const draw = () => {
      if (drawing) {
        drawShapes(canvas, drawing.shapes, colors);
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
    ctx.fillStyle = "#242526";
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
        gap: "10px",
        justifyContent: "center",
        overflow: "hidden",
        paddingX: { xs: "10px", md: "100px" },
        paddingY: "20px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "100vw", md: "65vw" },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <canvas id="drawingCanvas" className="canvas-style-single-draw" />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            alignSelf: "flex-start",
            marginLeft: "80px",
            marginTop: "10px",
          }}
        >
          <Avatar sx={{ height: "20px", width: "20px" }} />
          <a
            style={{
              fontSize: "12px",
            }}
            href={`/user-list?type=profile&user_id=${drawing?.user._id}`}
            className="user-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {drawing?.user?.username}
          </a>
          <div
            style={{
              fontSize: "12px",
              color: "gray",
              opacity: 0.5,
            }}
          >
            {formatDistanceToNow(new Date(drawing?.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>

        <Download
          resolution={resolution}
          setResolution={setResolution}
          handleDownload={handleDownload}
        />
      </Box>

      <Box sx={{ width: { xs: "100vw", md: "35vw" } }}>
        <CommentsSection whiteboard={drawing} />
      </Box>
    </Box>
  );
};

export default ViewSingleDrawingPage;
