import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapes: [],
  selectedShapeIndex: null,
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
  },
});

export const { setShapes, setSelectedShapeIndex } = canvasSlice.actions;
export default canvasSlice.reducer;
