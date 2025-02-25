import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  profilePicture: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
  },
});

export const { setProfilePicture } = authSlice.actions;
export default authSlice.reducer;
