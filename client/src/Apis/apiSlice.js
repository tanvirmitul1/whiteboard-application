import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const apiBaseUrl =
  "http://localhost:5000/api" || process.env.REACT_APP_API_BASE_URL;
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  keepUnusedDataFor: 60,
  tagTypes: ["ALLDRAWINGS", "ALLUSERS", "ALLNOTIFICATIONS"],
  endpoints: () => ({}),
});
