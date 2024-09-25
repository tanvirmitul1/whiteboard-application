import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import Modal from "react-modal";
import { toast } from "react-toastify";

const AddUserModal = ({ isOpen, onRequestClose }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const handleAddUser = () => {
    // You can handle the API call to add user here
    // Example: dispatch(addUser({ username, role, email }));

    if (username && role && email) {
      toast.success("User added successfully!");
      onRequestClose();
    } else {
      toast.error("Please fill all fields.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Add User"
    >
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4">Add New User</Typography>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Add User
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onRequestClose}
            sx={{ marginLeft: 2 }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

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
    backgroundColor: "#f0f0f0",
  },
};

export default AddUserModal;
