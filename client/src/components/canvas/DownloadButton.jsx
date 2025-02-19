import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { IoMdDownload } from "react-icons/io";

const DownloadButton = ({ backgroundColor, drawingTitle, shapes }) => {
  const resolution = 4;
  const handleDownload = () => {
    const canvas = document.getElementById("drawing-canvas");
    const link = document.createElement("a");
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * resolution;
    scaledCanvas.height = canvas.height * resolution;
    const ctx = scaledCanvas.getContext("2d");
    ctx.fillStyle = backgroundColor || "#242526";
    ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);
    ctx.scale(resolution, resolution);
    ctx.drawImage(canvas, 0, 0);

    link.href = scaledCanvas.toDataURL("image/jpeg", 1);
    link.download = `${drawingTitle || "Drawing"}.jpg`;
    link.click();
  };
  return (
    <Button
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        textTransform: "none",
        width: { xs: 32, sm: 36, md: 40 }, // Responsive width
        height: { xs: 32, sm: 36, md: 40 }, // Responsive height
        minWidth: { xs: 32, sm: 36, md: 40 },
        padding: 0,
      }}
      variant="contained"
      color="success"
      size="small"
      onClick={handleDownload}
      disabled={shapes.length === 0}
    >
      <Tooltip title="Download" placement="top">
        <IoMdDownload
          color="white"
          size={
            window.innerWidth < 600 ? 12 : window.innerWidth < 960 ? 15 : 18
          } // Responsive icon size
        />
      </Tooltip>
    </Button>
  );
};

export default DownloadButton;
