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
  Select,
  MenuItem,
  Pagination,
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

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = async (userId) => {
    toast.error("Permission Denied");
  };

  useEffect(() => {
    const type = searchParams.get("type");
    const userId = searchParams.get("user_id");

    if (type === "profile" && userId) {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filteredUsers = usersData
    ? usersData.filter(
        (user) =>
          user.username.toLowerCase().includes(searchName.toLowerCase()) &&
          user.role.toLowerCase().includes(searchRole.toLowerCase())
      )
    : [];

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (usersLoading) return <CircularProgress />;
  if (usersError)
    return <Typography color="error">Error loading users</Typography>;

  return (
    <Box
      sx={{
        height: "90vh",
        padding: 4,
        backgroundColor: "#121212", // Dark background
      }}
    >
      <Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
            size="small"
          >
            <AddIcon sx={{ marginRight: 1 }} /> Add User
          </Button>
        </Box>

        <TableContainer
          sx={{
            overflowY: "auto",
            boxShadow: 3,
            marginTop: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            maxHeight: "70vh",
          }}
        >
          <Table
            sx={{
              border: "1px solid #635e5e",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.textColor }}>Username</TableCell>
                <TableCell sx={{ color: colors.textColor }}>Role</TableCell>
                <TableCell sx={{ color: colors.textColor }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
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

        {/* Pagination and Rows per Page Selection */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
            color: colors.textColor,
          }}
        >
          <Box>
            <Typography>Rows per page:</Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              sx={{
                width: 120,
                "& .MuiSelect-select": {
                  color: "gray",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "gray",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#333",
                    "& .MuiMenuItem-root": {
                      color: "gray",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "gray",
                    },
                  },
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </Box>
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            siblingCount={1}
            boundaryCount={2}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
              },
              "& .MuiPaginationItem-previousNext": {
                color: "white",
              },
              "& .Mui-selected": {
                backgroundColor: "white",
                color: "gray",
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "white",
              },
            }}
          />
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
      </Box>
    </Box>
  );
};

export default UserPage;
