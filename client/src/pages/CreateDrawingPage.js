import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import Swal from "sweetalert2";
import { useCreateDrawMutation } from "../Apis/whiteboardApiSlice";
import LeftSidebar from "../components/createPage/LeftSidebar";
import { useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import Whiteboard from "../components/Whiteboard";

const CreateDrawingPage = () => {
  const navigate = useNavigate();
  const [drawingTitle, setDrawingTitle] = useState("New drawing 1");
  const [shapeType, setShapeType] = useState("line");

  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [createDraw, { isLoading }] = useCreateDrawMutation();
  const { userId, token } = useAuth();
  console.log({ shapes });

  const handleShapeUpdate = (newShapes) => {
    const filteredShapes = newShapes.filter(
      (item) => !(item.type === "pen" && item.path.length === 0)
    );

    console.log({ filteredShapes });
    setShapes(filteredShapes);

    console.log("shapes inside handleShapeUpdate", "shapes");
    setHistory([...history, newShapes]);
    setRedoStack([]);
  };

  // Wrap handleUndo in useCallback
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack([shapes, ...redoStack]);
      setShapes(prevState);
      setHistory(history.slice(0, -1));
    }
  }, [history, shapes, redoStack]);

  // Wrap handleRedo in useCallback
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const restoredState = redoStack[0];
      setHistory([...history, shapes]);
      setShapes(restoredState);
      setRedoStack(redoStack.slice(1));
    }
  }, [redoStack, history, shapes]);

  const handleSaveDrawing = async () => {
    if (!drawingTitle) {
      Swal.fire("Error!", "Please enter a drawing title.", "error");
      return;
    }
    if (shapes.length === 0) {
      Swal.fire("Error!", "Please draw something before saving.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this drawing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });

    if (result.isConfirmed) {
      try {
        await createDraw({
          drawingTitle,
          shapeType,
          shapes,
          userId,
          token,
        })
          .unwrap()
          .then((res) => {
            setDrawingTitle("");
            Swal.fire({
              title: "Saved!",
              text: "Your drawing has been saved.",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false,
            });

            navigate("/drawing-list");
            localStorage.removeItem("shapes");
          });
      } catch (error) {
        console.error("Error saving drawing:", error);
        Swal.fire("Error!", "There was an error saving your drawing.", "error");
      }
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
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    if (shapes.length > 0) {
      localStorage.setItem("shapes", JSON.stringify(shapes));
    }
  }, [shapes]);

  useEffect(() => {
    const savedShapes = localStorage.getItem("shapes");
    if (savedShapes) {
      setShapes(JSON.parse(savedShapes));
    }
  }, [navigate]);

  console.log({ shapes });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: 1,
        gap: 1,
        overflow: "hidden",
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
          handleSaveDrawing={handleSaveDrawing}
          isLoading={isLoading}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
        />
      </Box>
      <Box
        sx={{
          width: {
            xs: "72%",
            md: "85%",
          },
        }}
      >
        <Whiteboard
          shapeType={shapeType}
          onShapesUpdate={handleShapeUpdate}
          shapes={shapes}
          setShapes={setShapes}
        />
      </Box>
    </Box>
  );
};

export default CreateDrawingPage;
