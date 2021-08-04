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
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        let ws = new WebSocket(
          'wss://4kh1b6ad2e.execute-api.us-east-1.amazonaws.com/dev?authorization=98765'
        );

        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event) => {
            const data = JSON.parse(event.data);
            // if (!isMessage(data) || data.channel !== arg) return

            updateCachedData((draft) => {
              draft.push(data);
            });
          };

          ws.addEventListener('message', listener);
        } catch (error) {
          console.log(error);
          console.info('Error with WebSocket connection');
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close?.();
      },
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
