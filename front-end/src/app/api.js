import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ewpm8v8dp4.execute-api.us-east-1.amazonaws.com/dev/',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      // const token = (getState()).auth.token
      const token = '98765';

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => 'orders',
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: 'orders',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = api;
