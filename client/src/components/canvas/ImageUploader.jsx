import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { FaCloudUploadAlt as UploadIcon } from "react-icons/fa";
// Material UI icons
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../../slices/canvasSlice";

const ImageUploader = () => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  const imageUploadRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;

        // Calculate the new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          if (width > height) {
            width = MAX_WIDTH;
            height = Math.round(width / aspectRatio);
          } else {
            height = MAX_HEIGHT;
            width = Math.round(height * aspectRatio);
          }
        }

        // Resize the image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Get the resized image data URL
        const resizedImgSrc = canvas.toDataURL("image/jpeg", 0.9);

        // Create new image shape object
        const newImageShape = {
          uuid: uuidv4(),
          type: "image",
          imgSrc: resizedImgSrc,
          x: 100,
          y: 100,
          width: width,
          height: height,
        };

        // Update shapes state with the resized image
        const updatedShapes = [newImageShape, ...shapes];
        dispatch(setShapes(updatedShapes));
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 60,
      }}
    >
      {/* File input hidden, triggered by button */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={imageUploadRef}
      />

      {/* Upload button with icon */}
      <Button
        sx={{
          textTransform: "none",
          width: { xs: 10, sm: 25, md: 30 }, // Responsive width
          height: { xs: 10, sm: 25, md: 30 }, // Responsive height
          minWidth: { xs: 10, sm: 25, md: 30 },
          padding: 0,
        }}
      >
        <Tooltip title="Import Image into canvas">
          <IconButton
            color="primary"
            onClick={() => imageUploadRef.current.click()}
            size="medium"
          >
            <UploadIcon
              color="#158CE4"
              size={
                window.innerWidth < 600 ? 20 : window.innerWidth < 960 ? 25 : 30
              }
            />
          </IconButton>
        </Tooltip>
      </Button>
    </Box>
  );
};

export default ImageUploader;
