import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import Swal from "sweetalert2";
import {
  useCreateDrawMutation,
  useGetTotalDrawCountQuery,
} from "../Apis/whiteboardApiSlice";
import LeftSidebar from "../components/createPage/LeftSidebar";
import { useNavigate } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import Whiteboard from "../components/Whiteboard";
import { useDispatch, useSelector } from "react-redux";
import { setShapes } from "../slices/canvasSlice";
const CreateDrawingPage = () => {
  const { data: totalDrawCount } = useGetTotalDrawCountQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shapes = useSelector((state) => state.canvas.shapes);

  const [drawingTitle, setDrawingTitle] = useState(
    `New Drawing ${totalDrawCount?.totalDrawCount}`
  );
  const [shapeType, setShapeType] = useState("line");
  const [drawColor, setDrawColor] = useState("#C735BB");
  const [backgroundColor, setBackgroundColor] = useState("#242441");
  const [fillColor, setFillColor] = useState("#DC0DB6");

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [createDraw, { isLoading }] = useCreateDrawMutation();
  const { userId, token } = useAuth();
  const [isFillColorActive, setIsFillColorActive] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
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
  const handleShapeUpdate = (newShapes) => {
    // const filteredShapes = newShapes.filter(
    //   (item) => !(item.type === "pen" && item.path.length === 0)
    // );

    // dispatch(setShapes(filteredShapes));
    setHistory([...history, newShapes]);
    setRedoStack([]);
  };

  // Wrap handleUndo in useCallback
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack([shapes, ...redoStack]);
      dispatch(setShapes(prevState));
      setHistory(history.slice(0, -1));
    }
  }, [history, shapes, redoStack]);

  // Wrap handleRedo in useCallback
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const restoredState = redoStack[0];
      setHistory([...history, shapes]);
      dispatch(setShapes(restoredState));
      setRedoStack(redoStack.slice(1));
    }
  }, [redoStack, history, shapes, dispatch]);

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
        const validShapes = shapes.filter((shape) => shape.type?.trim());
        await createDraw({
          drawingTitle,
          shapes: validShapes,
          canvasSize,
          userId,
          token,
          backgroundColor,
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
            dispatch(setShapes([]));
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
      dispatch(setShapes(JSON.parse(savedShapes)));
    }
  }, [navigate, dispatch]);

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFillColorActive(false);
        setShapeType("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (totalDrawCount) {
      setDrawingTitle(`New Drawing ${totalDrawCount?.totalDrawCount}`);
    }
  }, [totalDrawCount]);

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
            xs: "72%",
            md: "85%",
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
        />
      </Box>
    </Box>
  );
};

export default CreateDrawingPage;
