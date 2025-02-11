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
      }}
      variant="contained"
      color="success"
      size="small"
      onClick={handleDownload}
      disabled={shapes.length === 0}
    >
      <Tooltip title="Download" placement="top">
        <IconButton size="small">
          <IoMdDownload color="white" size={20} />
        </IconButton>
      </Tooltip>
    </Button>
  );
};

export default DownloadButton;
