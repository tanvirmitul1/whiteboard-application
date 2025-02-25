import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDrawingByIdQuery } from "../Apis/whiteboardApiSlice";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { drawShapes } from "../components/DrawShapes";

import CommentsSection from "../components/viewSinglePage/CommentsSection";
import Download from "../components/viewSinglePage/Download";
import { formatDistanceToNow } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import useAuth from "../customHooks/useAuth";
import { IoMdArrowRoundBack } from "react-icons/io";
const ViewSingleDrawingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { drawingId } = useParams();
  const [resolution, setResolution] = useState(1);
  const { data: drawing, error, isLoading } = useGetDrawingByIdQuery(drawingId);

  useEffect(() => {
    const canvas = document.getElementById("drawingCanvas");

    const draw = () => {
      if (drawing) {
        drawShapes(
          canvas,
          drawing?.shapes,
          drawing?.canvasSize || {
            width: 1400,
            height: 600,
          }
        );
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
    ctx.fillStyle = drawing.backgroundColor || "#242526";
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

  const handleEditClick = (whiteboard) => {
    const whiteboardId = whiteboard._id;
    if (whiteboard.user._id === user._id) {
      navigate(`/edit/${whiteboardId}`);
    } else {
      console.log("You do not have permission to edit this whiteboard.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: "10px",
        justifyContent: "center",
        overflowY: "auto",
        paddingX: { xs: "10px", md: "100px" },
        paddingY: "20px",
        overflowX: "hidden",
      }}
    >
      {/* Drawing Section */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", md: "65%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <canvas
          id="drawingCanvas"
          className="canvas-style-single-draw"
          style={{
            backgroundColor: drawing?.backgroundColor || "#242441",
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
          }}
        />

        {/* User Info Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "flex-start",
            marginTop: "10px",
            width: "100%",
            paddingX: { xs: "10px", md: "80px" },
          }}
        >
          <Avatar
            sx={{ height: "30px", width: "30px" }}
            src={drawing?.user?.imageUrl}
          />
          {console.log(drawing)}
          <a
            href={`/user-list?type=profile&user_id=${drawing?.user._id}`}
            className="user-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px" }}
          >
            {drawing?.user?.username}
          </a>
          <Typography sx={{ fontSize: "12px", color: "gray", opacity: 0.7 }}>
            {formatDistanceToNow(new Date(drawing?.createdAt), {
              addSuffix: true,
            })}
          </Typography>
        </Box>
      </Box>

      {/* Comments Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "35%" },
          maxHeight: "80vh",
          overflowY: "auto",
          paddingX: { xs: "10px", md: "20px" },
        }}
      >
        {/* Buttons Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Download
            resolution={resolution}
            setResolution={setResolution}
            handleDownload={handleDownload}
          />
          {user._id === drawing?.user._id && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(drawing)}
              startIcon={<EditIcon />}
              size="large"
              sx={{ textTransform: "none" }}
            >
              Edit
            </Button>
          )}
        </Box>
        <CommentsSection whiteboard={drawing} />
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => navigate(-1)}
        >
          <IoMdArrowRoundBack size={20} style={{ marginRight: "10px" }} />
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default ViewSingleDrawingPage;
