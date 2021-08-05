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
      query: () => {
        console.log('%cfetching orders', 'color: darkSeaGreen');
        return 'orders';
      },
      // keepUnusedDataFor configuration for an individual endpoint, overriding the api setting (if it exists)
      // when the time expires the component will unsubscribe which will have the side effect or closing the WebSocket
      keepUnusedDataFor: 5,
      async onCacheEntryAdded(
        // In the documentation example this arge is a specific "channel"
        // that the ws is subscribed to
        // The channel is passed as an argument to the query like so:
        //    query: (channel) => `path/${channel}`
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket(
          'wss://4kh1b6ad2e.execute-api.us-east-1.amazonaws.com/dev?authorization=98765'
        );

        // This may be where we try some kind of fallback logic or at least display
        // a toast or something to indicate there was an error with the connection
        ws.addEventListener('error', () =>
          console.log('%cYou done messed up A-a-ron!', 'color: tomato')
        );

        ws.addEventListener('open', () => {
          console.log('%cWebSocket open', 'color: cornflowerBlue');
        });

        ws.addEventListener('close', () => {
          console.log('%cWebSocket closed', 'color: coral');
        });

        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event) => {
            const data = JSON.parse(event.data);

            console.log('data', data);

            updateCachedData((draft) => {
              const orderIndex = draft.findIndex(
                (order) => order.sk === data.sk
              );

              if (orderIndex === -1) {
                draft.push(data);
              } else {
                draft[orderIndex] = data;
              }
            });
          };

          ws.addEventListener('message', listener);
        } catch {
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
