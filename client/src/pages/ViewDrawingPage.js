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

  const handleTitleChange = useCallback(
    debounce((value) => {
      setFilterTitle(value);
      setPage(1);
    }, 200),
    []
  );

  const { data: usersData } = useGetAllUsersQuery();
  const { data, error, isLoading, refetch } = useGetAllDrawingsQuery({
    searchedUser: selectedUser,
    titleFilter: filterTitle,
    page,
    limit: itemsPerPage,
  });

  const [deleteDrawing] = useDeleteDrawingMutation();

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setPage(1);
  };

  const handleEditClick = (whiteboard) => {
    const whiteboardId = whiteboard._id;
    if (whiteboard.user === user._id) {
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
        await deleteDrawing(whiteboardId);
        Swal.fire("Deleted!", "Your drawing has been deleted.", "success");
        refetch();
      }
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handleViewSingleDrawing = (whiteboardId) => {
    navigate(`/drawing/${whiteboardId}`);
  };

  return (
    <Box className="page-container">
      <DrawingFilters
        selectedUser={selectedUser}
        onUserChange={handleUserChange}
        filterTitle={filterTitle}
        onTitleChange={(value) => handleTitleChange(value)}
        users={usersData || []}
      />

      {data?.whiteboards.length === 0 ? (
        <Typography align="center" className="drawing-title">
          No drawings found
        </Typography>
      ) : (
        <>
          {/* <Typography variant="h5" align="center" className="drawing-title">
            Total Drawings: {data?.totalDrawings}
          </Typography> */}

          {isLoading ? (
            <DrawPageLoader />
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {data.whiteboards.map((whiteboard) => (
                <Grid item xs={12} sm={6} md={4} key={whiteboard._id}>
                  <Box className="drawing-card">
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="drawing-title"
                    >
                      {whiteboard.drawingTitle}
                    </Typography>

                    <Box
                      className="canvas-container"
                      onClick={() => handleViewSingleDrawing(whiteboard._id)}
                    >
                      <canvas
                        ref={(canvas) => {
                          if (canvas) {
                            drawShapes(canvas, whiteboard.shapes);
                          }
                        }}
                        className="canvas-style"
                      />
                    </Box>

                    <Box className="button-container">
                      <Button
                        variant="contained"
                        color="primary"
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
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          <Box className="pagination-container">
            <FormControl>
              <InputLabel>Items Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items per Page"
                size="small"
                style={{ width: 120 }}
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

      <Box className="back-button-container">
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
