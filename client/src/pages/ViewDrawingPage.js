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
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { drawShapes } from "../components/DrawShapes";
import DrawPageLoader from "../components/DrawPageLoader";
import Swal from "sweetalert2";
import DrawingFilters from "../components/viewPage/DrawingFilters";
import useAuth from "../customHooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import ActionButton from "../components/viewPage/ActionButton";
import useColors from "../customHooks/useColors";
import Reactions from "../components/viewPage/Reactions";
import Logo from "../files/dp.jpg";

const ViewDrawingPage = () => {
  const { user } = useAuth();
  const { colors } = useColors();
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
    console.log("edit", whiteboard);
    const whiteboardId = whiteboard._id;
    if (whiteboard.user._id === user._id) {
      navigate(`/edit/${whiteboardId}`);
    } else {
      console.log("You do not have permission to edit this whiteboard.");
    }
  };
  const handleDownload = (whiteboard, canvasId) => {
    const canvas = document.getElementById(canvasId);
    const link = document.createElement("a");

    // Create a scaled canvas for higher resolution
    const scaledCanvas = document.createElement("canvas");
    const scaleFactor = 10; // Increase this for higher resolution
    scaledCanvas.width = canvas.width * scaleFactor;
    scaledCanvas.height = canvas.height * scaleFactor;

    const ctx = scaledCanvas.getContext("2d");

    // Disable image smoothing to avoid blur during scaling
    ctx.imageSmoothingEnabled = false;

    // Set background color if necessary (e.g., #242526)
    ctx.fillStyle = "#242526";
    ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);

    // Scale the canvas drawing
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(canvas, 0, 0); // Draw the original canvas onto the scaled one

    // Generate the high-resolution image
    link.href = scaledCanvas.toDataURL("image/jpeg", 1); // Use full quality
    link.download = `${whiteboard.drawingTitle}.jpg`;
    link.click();
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
              {data.whiteboards.map((whiteboard, index) => (
                <Grid item xs={12} sm={6} md={4} key={whiteboard._id}>
                  <Box className="drawing-card">
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="drawing-title"
                    >
                      {whiteboard.drawingTitle}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <Box
                        className="canvas-container"
                        onClick={() => handleViewSingleDrawing(whiteboard._id)}
                      >
                        <canvas
                          id={`drawingCanvas-${index}`}
                          ref={(canvas) => {
                            if (canvas) {
                              drawShapes(canvas, whiteboard.shapes, colors);
                            }
                          }}
                          className="canvas-style"
                        />
                      </Box>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <Avatar
                          sx={{ height: "15px", width: "15px" }}
                          src={Logo}
                        />
                        <a
                          style={{
                            fontSize: "12px",
                          }}
                          href={`/user-list?type=profile&user_id=${whiteboard.user._id}`}
                          className="user-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {whiteboard.user.username}
                        </a>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "gray",
                            opacity: 0.5,
                          }}
                        >
                          {formatDistanceToNow(
                            new Date(whiteboard?.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <Reactions whiteboard={whiteboard} />

                    <ActionButton
                      whiteboard={whiteboard}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      handleDownload={() =>
                        handleDownload(whiteboard, `drawingCanvas-${index}`)
                      } // Pass unique ID
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          <Box className="pagination-container">
            <FormControl>
              <InputLabel sx={{ color: "white" }}>Items Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items per Page"
                size="small"
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
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                },
                "& .MuiPaginationItem-previousNext": {
                  color: "white",
                },
                "& .Mui-selected": {
                  backgroundColor: "white",
                  color: "black",
                },
                "& .MuiPaginationItem-ellipsis": {
                  color: "white",
                },
              }}
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
