import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getAttendanceRecords: builder.query({
      query: () => 'attendanceRecords',
    }),
    getAttendanceRecordById: builder.query({
      query: (id) => `attendanceRecords/${id}`,
    }),
    addAttendanceRecord: builder.mutation({
      query: (record) => ({
        url: 'attendanceRecords',
        method: 'POST',
        body: record,
      }),
    }),
    updateAttendanceRecord: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `attendanceRecords/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteAttendanceRecord: builder.mutation({
      query: (id) => ({
        url: `attendanceRecords/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAttendanceRecordsQuery,
  useGetAttendanceRecordByIdQuery,
  useAddAttendanceRecordMutation,
  useUpdateAttendanceRecordMutation,
  useDeleteAttendanceRecordMutation,
} = attendanceApi;