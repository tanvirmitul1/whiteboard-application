import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import {
  useGetAllDrawingsQuery,
  useDeleteDrawingMutation,
} from "../Apis/whiteboardApiSlice";
import { useGetAllUsersQuery } from "../Apis/userApiSlice";
import {
  Typography,
  Box,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { drawShapes } from "../components/DrawShapes";
import DrawPageLoader from "../components/DrawPageLoader";
import Swal from "sweetalert2";
import DrawingFilters from "../components/viewPage/DrawingFilters";
import useAuth from "../customHooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import ActionButton from "../components/viewPage/ActionButton";
import Reactions from "../components/viewPage/Reactions";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const ViewDrawingPage = () => {
  const theme = useTheme();
  const [whiteboards, setWhiteboards] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const handleTitleChange = useCallback(
    debounce((value) => {
      setFilterTitle(value);
      setPage(1);
    }, 200),
    []
  );

  const { data: usersData } = useGetAllUsersQuery();
  const { data, error, isLoading, isFetching, refetch } =
    useGetAllDrawingsQuery({
      searchedUser: selectedUser,
      titleFilter: filterTitle,
      page,
      limit: itemsPerPage,
    });

  useEffect(() => {
    if (data?.whiteboards) {
      setWhiteboards(data.whiteboards);
    }
  }, [data]);

  const [deleteDrawing] = useDeleteDrawingMutation();

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setPage(1);
  };

  const handleEditClick = (whiteboard) => {
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
    ctx.fillStyle =
      whiteboard.backgroundColor || theme.palette.background.default;
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
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDrawing(whiteboardId);
        setWhiteboards((prev) =>
          prev.filter((whiteboard) => whiteboard._id !== whiteboardId)
        );
        toast.success("Drawing deleted successfully!");
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
    <Box
      className="page-container"
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      <DrawingFilters
        selectedUser={selectedUser}
        onUserChange={handleUserChange}
        filterTitle={filterTitle}
        onTitleChange={(value) => handleTitleChange(value)}
        users={usersData || []}
      />

      {isLoading || isFetching ? (
        <DrawPageLoader />
      ) : (
        <>
          {data?.whiteboards?.length === 0 ? (
            <Typography
              align="center"
              className="drawing-title"
              sx={{ color: theme.palette.text.primary }}
            >
              No drawings found
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {whiteboards?.map((whiteboard, index) => (
                <Grid item xs={12} sm={6} md={4} key={whiteboard._id}>
                  <Box
                    className="drawing-card"
                    sx={{ backgroundColor: theme.palette.background.default }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="drawing-title"
                      sx={{ color: theme.palette.text.primary }}
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
                              drawShapes(
                                canvas,
                                whiteboard.shapes,
                                whiteboard.canvasSize || {
                                  width: 1400,
                                  height: 600,
                                }
                              );
                            }
                          }}
                          className="canvas-style"
                          style={{
                            backgroundColor:
                              whiteboard?.backgroundColor ||
                              theme.palette.background.default,
                          }}
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
                          src={whiteboard.user?.imageUrl}
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
                            color: theme.palette.text.secondary,
                            opacity: 0.5,
                          }}
                        >
                          {formatDistanceToNow(
                            new Date(whiteboard?.createdAt),
                            { addSuffix: true }
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
        </>
      )}
    </Box>
  );
};

export default ViewDrawingPage;
