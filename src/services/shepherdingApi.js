import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../baseQuery';

export const shepherdingApi = createApi({
  reducerPath: 'shepherdingApi',
  baseQuery: mockBaseQuery(),
  endpoints: (builder) => ({
    getShepherdingContacts: builder.query({
      query: () => 'shepherdingContacts',
    }),
    getShepherdingContactById: builder.query({
      query: (id) => `shepherdingContacts/${id}`,
    }),
    addShepherdingContact: builder.mutation({
      query: (contact) => ({
        url: 'shepherdingContacts',
        method: 'POST',
        body: contact,
      }),
    }),
    updateShepherdingContact: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `shepherdingContacts/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteShepherdingContact: builder.mutation({
      query: (id) => ({
        url: `shepherdingContacts/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetShepherdingContactsQuery,
  useGetShepherdingContactByIdQuery,
  useAddShepherdingContactMutation,
  useUpdateShepherdingContactMutation,
  useDeleteShepherdingContactMutation,
} = shepherdingApi;