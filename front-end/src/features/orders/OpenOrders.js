import React from 'react';
import { useGetOrdersQuery } from '../../app/api';

import { Stack } from '@material-ui/core';

export default function OpenOrders() {
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  console.log(orders);

  return isLoading ? (
    <h1>loading</h1>
  ) : error ? (
    <h1>you done messed up a-a-ron!</h1>
  ) : orders ? (
    <Stack spacing={2} alignItems="center">
      {orders.map((o) => (
        <p key={o.sk}>{o.status}</p>
      ))}
    </Stack>
  ) : null;
}
