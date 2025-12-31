import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getChurchMembers: builder.query({
      query: () => 'churchMembers',
    }),
    getChurchMemberById: builder.query({
      query: (id) => `churchMembers/${id}`,
    }),
    addChurchMember: builder.mutation({
      query: (member) => ({
        url: 'churchMembers',
        method: 'POST',
        body: member,
      }),
    }),
    updateChurchMember: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `churchMembers/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteChurchMember: builder.mutation({
      query: (id) => ({
        url: `churchMembers/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetChurchMembersQuery,
  useGetChurchMemberByIdQuery,
  useAddChurchMemberMutation,
  useUpdateChurchMemberMutation,
  useDeleteChurchMemberMutation,
} = membersApi;