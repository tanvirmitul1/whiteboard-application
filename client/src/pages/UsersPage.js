import React, { useState, useEffect } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../Apis/userApiSlice";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import useColors from "../customHooks/useColors";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import AddUserModal from "../components/userPage/AddUserModal";
import UserDetailsModal from "../components/userPage/UserDetailsModal";

const UserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { colors } = useColors();
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    refetch,
  } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleDelete = async (userId) => {
    toast.error("Permission Denied");

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#d33",
    //   cancelButtonColor: "#3085d6",
    //   confirmButtonText: "Yes, delete it!",
    //   cancelButtonText: "Cancel",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       await deleteUser(userId);
    //       Swal.fire("Deleted!", "The user has been deleted.", "success");
    //       refetch(); // Refetch users list
    //     } catch (error) {
    //       Swal.fire("Error!", "Failed to delete the user.", "error");
    //     }
    //   }
    // });
  };

  // Effect to handle modals based on search params
  useEffect(() => {
    const type = searchParams.get("type");
    const userId = searchParams.get("user_id");

    if (type === "profile" && userId) {
      // Find user by ID
      const user = usersData?.find((u) => u._id === userId);
      if (user) {
        openUserModal(user);
      }
    } else if (type === "add") {
      openAddUserModal();
    }
  }, [searchParams, usersData]);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const filteredUsers = usersData
    ? usersData.filter(
        (user) =>
          user.username.toLowerCase().includes(searchName.toLowerCase()) &&
          user.role.toLowerCase().includes(searchRole.toLowerCase())
      )
    : [];

  if (usersLoading) return <CircularProgress />;
  if (usersError)
    return <Typography color="error">Error loading users</Typography>;

  return (
    <Box
      sx={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ marginBottom: 2, display: "flex", gap: 2 }}>
          <input
            className="text-field"
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            className="text-field"
            type="text"
            placeholder="Search by Role"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={openAddUserModal}
          >
            <AddIcon sx={{ marginRight: 1 }} /> Add User
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            overflowY: "auto",
            boxShadow: 3,
            marginTop: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
          }}
        >
          <Table sx={{ border: "1px solid #635e5e" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.textColor }}>Username</TableCell>
                <TableCell sx={{ color: colors.textColor }}>Role</TableCell>
                <TableCell sx={{ color: colors.textColor }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: colors.textColor }}>
                    <Button
                      variant="text"
                      onClick={() => openUserModal(user)}
                      sx={{ color: colors.linkColor }}
                    >
                      {user.username}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ color: colors.textColor }}>
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={isUserModalOpen}
          onRequestClose={closeUserModal}
          selectedUser={selectedUser}
        />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onRequestClose={closeAddUserModal}
        />
      </Container>
    </Box>
  );
};

export default UserPage;
