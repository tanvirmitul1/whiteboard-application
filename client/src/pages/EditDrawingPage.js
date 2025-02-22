/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDrawingByIdQuery,
  useUpdateDrawingMutation,
} from "../Apis/whiteboardApiSlice";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

import LeftSidebar from "../components/createPage/LeftSidebar";
import Whiteboard from "../components/Whiteboard";
import Swal from "sweetalert2";
import useAuth from "../customHooks/useAuth";

import { MdUpdate } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../slices/canvasSlice";
import RightSideBar from "../components/createPage/RightSideBar";

const EditDrawingPage = () => {
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shapeType, setShapeType] = useState("line");

  const [isSaved, setIsSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [drawColor, setDrawColor] = useState("#C735BB");
  const [backgroundColor, setBackgroundColor] = useState("#242441");
  const [fillColor, setFillColor] = useState("#58da1d");
  const [isFillColorActive, setIsFillColorActive] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  // Update canvas size dynamically
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.getElementById("drawing-canvas");
      if (container) {
        setCanvasSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);
  const { userId } = useAuth();

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch drawing data
  const { data, error, isLoading, refetch } = useGetDrawingByIdQuery(id);

  useEffect(() => {
    // Refetch the data whenever this component is mounted to get the latest data
    refetch();
  }, [id, refetch]);
  const [updateDrawing, { isLoading: isUpdating }] = useUpdateDrawingMutation();

  useEffect(() => {
    if (data) {
      setDrawingTitle(data.drawingTitle || "");
      dispatch(setShapes(data.shapes || []));
      setBackgroundColor(data.backgroundColor || "#242441");
    }
  }, [data]);

  const handleShapeUpdate = (newShapes) => {
    // const filteredShapes = newShapes.filter(
    //   (item) => !(item.type === "pen" && item.path.length === 0)
    // );

    // dispatch(setShapes(filteredShapes));
    setHistory([...history, newShapes]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack([shapes, ...redoStack]);
      dispatch(setShapes(prevState));
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const restoredState = redoStack[0];
      setHistory([...history, shapes]);
      dispatch(setShapes(restoredState));
      setRedoStack(redoStack.slice(1));
    }
  };

  // Ctrl+Z for Undo and Ctrl+Y for Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault(); // prevent the default browser undo action
        handleUndo();
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault(); // prevent the default browser redo action
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo, history, redoStack, shapes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFillColorActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleSave = async () => {
    const validShapes = shapes.filter((shape) => shape.type?.trim());
    try {
      await updateDrawing({
        id,
        shapes: validShapes,
        drawingTitle,
        canvasSize,
        userId,
        backgroundColor,
      })
        .unwrap()
        .then((res) => {
          setIsSaved(true);

          Swal.fire({
            title: "Saved!",
            text: "Your drawing has been saved.",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          navigate("/drawing-list");
        });
    } catch (error) {
      console.error("Failed to save drawing", error);
    }
  };

  if (isLoading || isUpdating)
    return (
      <CircularProgress
        sx={{ display: "block", margin: "auto", marginTop: 4 }}
      />
    );
  if (error)
    return (
      <Typography color="error" variant="h6" align="center">
        Failed to load drawing
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: 1,
        gap: 1,
        maxHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "18%",
            md: "7%",
          },
        }}
      >
        <LeftSidebar
          drawingTitle={drawingTitle}
          setDrawingTitle={setDrawingTitle}
          shapeType={shapeType}
          setShapeType={setShapeType}
          isLoading={isUpdating}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          drawColor={drawColor}
          setDrawColor={setDrawColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          fillColor={fillColor}
          setFillColor={setFillColor}
          setIsFillColorActive={setIsFillColorActive}
          isFillColorActive={isFillColorActive}
        />
      </Box>
      <Box
        sx={{
          width: {
            xs: "64%",
            md: "82%",
          },
        }}
      >
        <Whiteboard
          shapeType={shapeType}
          onShapesUpdate={handleShapeUpdate}
          drawColor={drawColor}
          backgroundColor={backgroundColor}
          fillColor={fillColor}
          drawingTitle={drawingTitle}
          selectedShapeIndex={selectedShapeIndex}
          setSelectedShapeIndex={setSelectedShapeIndex}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            marginTop: 1,
            gap: 2,
          }}
        >
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: "none" }}
          >
            <MdUpdate size={20} style={{ marginRight: "10px" }} />
            Update drawing
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => navigate(-1)}
            sx={{ textTransform: "none" }}
          >
            <IoMdArrowRoundBack size={20} style={{ marginRight: "10px" }} />
            Go Back
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: {
            xs: "15%",
            md: "8%",
          },
        }}
      >
        <RightSideBar shapeType={shapeType} />
      </Box>
    </Box>
  );
};

export default EditDrawingPage;
