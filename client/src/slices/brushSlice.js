import { createSlice } from "@reduxjs/toolkit";

const initialBrush = {
  type: "pencil",
  size: 20,
  hardness: 0.4,
  color: "#F01461",
};
const brushTypes = [
  "pencil",
  "star",
  "diamond",
  "spray",
  "wet",
  "nature",
  "pixel",
  "texture",
  "calligraphy",
  "airbrush",
  "round",
  "square",
];

const brushSlice = createSlice({
  name: "brush",
  initialState: { currentBrush: initialBrush, brushTypes: brushTypes },
  reducers: {
    setBrush: (state, action) => {
      state.currentBrush = action.payload;
    },
    updateBrushProperty: (state, action) => {
      const { key, value } = action.payload;
      state.currentBrush[key] = value;
    },
    setBrushType: (state, action) => {
      state.currentBrush.type = action.payload;
    },
  },
});

export const { setBrush, updateBrushProperty, setBrushType } =
  brushSlice.actions;
export default brushSlice.reducer;
