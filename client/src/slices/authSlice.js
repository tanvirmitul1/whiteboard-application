import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  profilePicture: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setProfilePicture, setUser } = authSlice.actions;
export default authSlice.reducer;
