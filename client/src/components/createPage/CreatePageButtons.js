import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import useAuth from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import InstructionModal from "../instructions/InstructionModal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

const CreatePageButtons = ({ handleSaveDrawing, isLoading }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleShowDrawings = () => {
    navigate("/drawing-list");
  };

  const handleShowUsers = () => {
    navigate("/user-list");
  };

  const [openInstructionsModal, setOpenInstructionsModal] =
    React.useState(false);

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
        sx={{ textTransform: "none", padding: 1 }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            <span> Saving...</span>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AddTaskIcon
              sx={{ marginRight: 1, display: { xs: "none", md: "inline" } }}
            />{" "}
            <span>Save</span>
          </Box>
        )}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleShowDrawings}
        sx={{ textTransform: "none", padding: 1 }}
      >
        Draw Lists
      </Button>
      {/* {isAdmin && ( */}
      {false && (
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

      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setOpenInstructionsModal(true)}
        sx={{ textTransform: "none", padding: 1 }}
      >
        Instruction
      </Button>

      <InstructionModal
        isOpen={openInstructionsModal}
        onClose={() => setOpenInstructionsModal(false)}
      />
    </Box>
  );
};

export default CreatePageButtons;
