import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../customHooks/useAuth";
import InstructionModal from "../instructions/InstructionModal";
import DeveloperProfile from "../instructions/DeveloperProfile";
import AddTaskIcon from "@mui/icons-material/AddTask";

const CreatePageButtons = ({ handleSaveDrawing, isLoading }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [modals, setModals] = useState({
    instruction: false,
    developer: false,
  });

  const toggleModal = (key, value) => {
    setModals((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: "0 auto",
      }}
    >
      <CustomButton
        onClick={handleSaveDrawing}
        text="Save"
        icon={<AddTaskIcon />}
        isLoading={isLoading}
      />
      <CustomButton
        onClick={() => navigate("/drawing-list")}
        text="Draw Lists"
        color="secondary"
      />
      {false && (
        <CustomButton onClick={() => navigate("/user-list")} text="Users" />
      )}
      <CustomButton
        onClick={() => toggleModal("instruction", true)}
        text="How to Use"
        color="secondary"
      />
      <CustomButton
        onClick={() => toggleModal("developer", true)}
        text="About"
        color="tertiary"
      />

      {/* Modals */}
      <InstructionModal
        isOpen={modals.instruction}
        onClose={() => toggleModal("instruction", false)}
      />
      <DeveloperProfile
        isOpen={modals.developer}
        onClose={() => toggleModal("developer", false)}
        username="tanvirmitul1"
      />
    </Box>
  );
};

export default CreatePageButtons;

const CustomButton = ({
  onClick,
  icon,
  text,
  isLoading,
  color = "primary",
}) => (
  <Button
    variant="contained"
    color={color}
    size="small"
    onClick={onClick}
    sx={{
      textTransform: "none",
      padding: { xs: "4px", md: "6px" },
      fontSize: { xs: "0.5rem", md: ".75rem" },
      display: "flex",
      alignItems: "center",
    }}
  >
    {isLoading ? (
      <>
        <CircularProgress size={16} color="inherit" />
      </>
    ) : (
      <>
        {icon && (
          <Box sx={{ mr: 1, display: { xs: "none", md: "inline" } }}>
            {icon}
          </Box>
        )}
        {text}
      </>
    )}
  </Button>
);
