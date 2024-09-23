import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f7f7f7",
        textAlign: "center",
        padding: 4,
      }}
    >
      {/* Icon or image */}
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "#ff6f61" }} />
      <Typography variant="h1" sx={{ mt: 2, fontWeight: "bold", fontSize: 60 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, color: "#555" }}>
        Oops! Page not found.
      </Typography>

      {/* Image */}
      <Box
        component="img"
        src="https://cdn.pixabay.com/photo/2016/10/18/08/52/error-1752168_1280.png"
        alt="Page not found"
        sx={{
          width: "300px",
          maxWidth: "100%",
          mb: 4,
        }}
      />

      <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>

      {/* Go back home button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleGoHome}
        sx={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage;
