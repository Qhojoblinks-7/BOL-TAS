import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const usherApi = createApi({
  reducerPath: 'usherApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getUsherAssignments: builder.query({
      query: () => 'usherAssignments',
    }),
    getUsherAssignmentById: builder.query({
      query: (id) => `usherAssignments/${id}`,
    }),
    addUsherAssignment: builder.mutation({
      query: (assignment) => ({
        url: 'usherAssignments',
        method: 'POST',
        body: assignment,
      }),
    }),
    updateUsherAssignment: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `usherAssignments/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteUsherAssignment: builder.mutation({
      query: (id) => ({
        url: `usherAssignments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsherAssignmentsQuery,
  useGetUsherAssignmentByIdQuery,
  useAddUsherAssignmentMutation,
  useUpdateUsherAssignmentMutation,
  useDeleteUsherAssignmentMutation,
} = usherApi;