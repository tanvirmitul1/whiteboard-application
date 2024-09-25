import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Modal from "react-modal";

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    padding: "20px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    backgroundColor: "#f0f0f0",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
};

const UserDetailsModal = ({ isOpen, onRequestClose, selectedUser }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      {selectedUser && (
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4">{selectedUser.username}</Typography>
          <Typography variant="body1">
            <strong>Role: </strong> {selectedUser.role}
          </Typography>
          <Typography variant="body1">
            <strong>Email: </strong> {selectedUser.email}
          </Typography>

          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={onRequestClose}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
