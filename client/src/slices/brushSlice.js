import { createSlice } from "@reduxjs/toolkit";

const initialBrush = {
  type: "pencil",
  size: 20,
  hardness: 0.4,
  color: "#F01461",
};

const brushSlice = createSlice({
  name: "brush",
  initialState: { currentBrush: initialBrush },
  reducers: {
    setBrush: (state, action) => {
      state.currentBrush = action.payload;
    },
    updateBrushProperty: (state, action) => {
      const { key, value } = action.payload;
      state.currentBrush[key] = value;
    },
  },
});

export const { setBrush, updateBrushProperty } = brushSlice.actions;
export default brushSlice.reducer;
