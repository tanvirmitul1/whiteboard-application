import { apiSlice } from "./apiSlice";

const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    storeComments: build.mutation({
      query: (body) => ({
        url: `/comments/store-comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ALLCOMMENTS"],
    }),

    // Get all comments
    getAllComments: build.query({
      query: (drawingId) => ({
        url: `/comments/get-all-comments/${drawingId}`,
        method: "GET",
      }),
      providesTags: ["ALLCOMMENTS"],
    }),
  }),
});

export const { useStoreCommentsMutation, useGetAllCommentsQuery } =
  commentsApiSlice;
