import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../src/Apis/apiSlice";
import authReducer from "./slices/authSlice";
import canvasReducer from "./slices/canvasSlice";
import brushReducer from "./slices/brushSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    canvas: canvasReducer,
    brush: brushReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
