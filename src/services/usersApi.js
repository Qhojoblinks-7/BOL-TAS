import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByPersonalCodeQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;