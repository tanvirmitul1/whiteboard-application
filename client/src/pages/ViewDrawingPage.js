import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  useGetAllDrawingsQuery,
  useDeleteDrawingMutation,
} from "../Apis/whiteboardApiSlice";
import { useGetAllUsersQuery } from "../Apis/userApiSlice";
import {
  Container,
  Typography,
  Box,
  Grid,
  Pagination,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { drawShapes } from "../components/DrawShapes";
import DrawPageLoader from "../components/DrawPageLoader";
import Swal from "sweetalert2";
import DrawingFilters from "../components/viewPage/DrawingFilters";
import useAuth from "../customHooks/useAuth";

const ViewDrawingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(user?._id || null);
  const [filterTitle, setFilterTitle] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce the filter title change
  const handleTitleChange = useCallback(
    debounce((value) => {
      setFilterTitle(value);
      setPage(1);
    }, 200),
    []
  );

  // Fetch all users
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useGetAllUsersQuery();

  // Fetch drawings based on selected user, title filter, and pagination
  const { data, error, isLoading, refetch } = useGetAllDrawingsQuery({
    searchedUser: selectedUser,
    titleFilter: filterTitle,
    page,
    limit: itemsPerPage,
  });

  // Mutation for deleting a drawing
  const [deleteDrawing] = useDeleteDrawingMutation();

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setPage(1);
  };

  const handleEditClick = (whiteboard) => {
    console.log(whiteboard);
    const whiteboardId = whiteboard._id;
    const drawingUser = whiteboard.user;
    console.log({
      whiteboardId,
      drawingUser,
    });
    if (drawingUser === user._id) {
      navigate(`/edit/${whiteboardId}`);
    }
  };

  const handleDeleteClick = (whiteboardId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDrawing(whiteboardId);
          Swal.fire({
            title: "Deleted!",
            text: "Your drawing has been Deleted",
            icon: "success",
            timer: 500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          refetch();
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the drawing.", "error");
        }
      }
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleViewSingleDrawing = (whiteboardId) => {
    navigate(`/drawing/${whiteboardId}`); // Adjust the route as necessary
  };

  if (usersError || error) {
    return <Typography color="error">Failed to load data</Typography>;
  }

  return (
    <Box
      sx={{
        maxHeight: "90vh",
        overflow: "auto",
        paddingX: "2rem",
        paddingY: "2rem",
      }}
    >
      <DrawingFilters
        selectedUser={selectedUser}
        onUserChange={handleUserChange}
        filterTitle={filterTitle}
        onTitleChange={(value) => handleTitleChange(value)}
        users={usersData || []}
      />

      {data?.whiteboards.length === 0 ? (
        <Typography align="center">No drawings found</Typography>
      ) : (
        <>
          <Typography align="center" marginBottom={2}>
            Total Drawings: {data?.totalDrawings}
          </Typography>

          {isLoading ? (
            <DrawPageLoader />
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {data.whiteboards.map((whiteboard) => (
                <Grid item xs={12} sm={6} md={4} key={whiteboard._id}>
                  <Paper
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      boxShadow: 3,
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {whiteboard.drawingTitle}
                    </Typography>

                    {/* Show the drawing */}
                    <Box
                      sx={{
                        border: "1px solid #ddd",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: 200,
                        backgroundColor: "#f5f5f5",
                        overflow: "hidden",
                        borderRadius: 1,
                      }}
                      onClick={() => handleViewSingleDrawing(whiteboard._id)}
                    >
                      <canvas
                        ref={(canvas) => {
                          if (canvas) {
                            drawShapes(canvas, whiteboard.shapes);
                          }
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Box>

                    {/* Edit and Delete buttons */}
                    <Box sx={{ marginTop: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleEditClick(whiteboard)}
                        disabled={user?._id !== whiteboard.user}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(whiteboard._id)}
                        disabled={user?._id !== whiteboard.user}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 3,
              gap: 10,
            }}
          >
            <FormControl>
              <InputLabel>Items Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items per Page"
                size="small"
                sx={{ width: 120 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              count={data?.totalPages || 0}
              page={page}
              onChange={handlePageChange}
              color="primary"
              siblingCount={1}
              boundaryCount={2}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ViewDrawingPage;
