import React from "react";
import { Box, Button } from "@mui/material";
import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreatePageButtons = ({ handleSaveDrawing, isLoading }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleShowDrawings = () => {
    navigate("/drawing-list");
  };

  const handleShowUsers = () => {
    navigate("/user-list");
  };

  return (
    <Box
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleSaveDrawing}
        disabled={isLoading}
        sx={{ textTransform: "none", padding: 1 }}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleShowDrawings}
        sx={{ textTransform: "none", padding: 1 }}
      >
        Drawings
      </Button>
      {isAdmin && (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleShowUsers}
          sx={{ textTransform: "none", padding: 1 }}
        >
          Users
        </Button>
      )}
    </Box>
  );
};

export default CreatePageButtons;
