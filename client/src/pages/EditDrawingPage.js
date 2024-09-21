import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDrawingByIdQuery,
  useUpdateDrawingMutation,
} from "../Apis/whiteboardApiSlice";
import {
  Button,
  Typography,
  Box,

  CircularProgress,
} from "@mui/material";

import LeftSidebar from "../components/createPage/LeftSidebar";
import Whiteboard from "../components/Whiteboard";
import Swal from "sweetalert2";
import useAuth from "../customHooks/useAuth";

const EditDrawingPage = () => {
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shapeType, setShapeType] = useState("line");

  const [isSaved, setIsSaved] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]); 
  const [redoStack, setRedoStack] = useState([]);

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
      setShapes(data.shapes|| []);
    }
  }, [data]);

  const handleShapeUpdate = (newShapes) => {
    const filteredShapes = newShapes.filter(
      (item) => !(item.type === "pen" && item.path.length === 0)
    );

    console.log({ filteredShapes });
    setShapes(filteredShapes);
    setHistory([...history, newShapes]);
    setRedoStack([]);
  };

  
  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack([shapes, ...redoStack]);
      setShapes(prevState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const restoredState = redoStack[0];
      setHistory([...history, shapes]);
      setShapes(restoredState);
      setRedoStack(redoStack.slice(1));
    }
  };

      // Ctrl+Z for Undo and Ctrl+Y for Redo
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.ctrlKey && e.key === 'z') {
            e.preventDefault(); // prevent the default browser undo action
            handleUndo();
          }
          if (e.ctrlKey && e.key === 'y') {
            e.preventDefault(); // prevent the default browser redo action
            handleRedo();
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [handleUndo, handleRedo, history, redoStack, shapes]);

  const handleSave = async () => {
    try {
      await updateDrawing({
        id,
        shapes: shapes,
        drawingTitle,
        userId,
      }).unwrap()
      .then(res=>{

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
      })


     
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
        backgroundColor: "#e0f6ff",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "25%",
            md: "10%",
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
        />
      </Box>
      <Box
        sx={{
          width: {
            xs: "68%",
            md: "83%",
          },
        }}
      >
        <Whiteboard
          shapeType={shapeType}
          onShapesUpdate={handleShapeUpdate}
          shapes={shapes}
          setShapes={setShapes}
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
            Update drawing
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => navigate(-1)}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditDrawingPage;
