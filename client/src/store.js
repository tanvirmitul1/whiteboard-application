import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../src/Apis/apiSlice";
import authReducer from "./slices/authSlice";
import canvasReducer from "./slices/canvasSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
