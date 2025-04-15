import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapes: [],
  selectedShapeIndex: null,
  mode: "draw",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setShapes: (state, action) => {
      state.shapes = action.payload;
    },
    setSelectedShapeIndex: (state, action) => {
      state.selectedShapeIndex = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === "draw" ? "move" : "draw";
    },
    setDrawingMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setShapes, setSelectedShapeIndex, toggleMode, setDrawingMode } =
  canvasSlice.actions;
export default canvasSlice.reducer;
