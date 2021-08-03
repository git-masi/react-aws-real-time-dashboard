import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ewpm8v8dp4.execute-api.us-east-1.amazonaws.com/dev/',
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
