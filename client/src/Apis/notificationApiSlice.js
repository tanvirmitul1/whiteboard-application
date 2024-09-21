import { apiSlice } from "./apiSlice";

const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Fetch all drawings
    getAllNotifications: build.query({
      query: () => ({
        url: `/notifications/all-notifications`,
        method: "GET",
      }),
      providesTags: ["ALLNOTIFICATIONS"],
    }),

    updateNotification: build.mutation({
      query: ({ notificationId, read }) => ({
        url: `/notifications/${notificationId}`,
        method: "PUT",
        body: { read },
      }),
      invalidatesTags: ["ALLNOTIFICATIONS"],
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationMutation } =
  notificationApiSlice;
