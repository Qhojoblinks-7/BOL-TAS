import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const weeklyAttendanceApi = createApi({
  reducerPath: 'weeklyAttendanceApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getWeeklyAttendance: builder.query({
      query: () => 'weeklyAttendance',
    }),
    getWeeklyAttendanceById: builder.query({
      query: (id) => `weeklyAttendance/${id}`,
    }),
    addWeeklyAttendance: builder.mutation({
      query: (record) => ({
        url: 'weeklyAttendance',
        method: 'POST',
        body: record,
      }),
    }),
    updateWeeklyAttendance: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `weeklyAttendance/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteWeeklyAttendance: builder.mutation({
      query: (id) => ({
        url: `weeklyAttendance/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetWeeklyAttendanceQuery,
  useGetWeeklyAttendanceByIdQuery,
  useAddWeeklyAttendanceMutation,
  useUpdateWeeklyAttendanceMutation,
  useDeleteWeeklyAttendanceMutation,
} = weeklyAttendanceApi;