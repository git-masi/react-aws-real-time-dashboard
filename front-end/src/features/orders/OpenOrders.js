import React from 'react';
import { useGetOrdersQuery } from '../../app/services/api';

import {
  Stack,
  CircularProgress,
  Skeleton,
  Alert,
  AlertTitle,
  Paper,
  Container,
} from '@material-ui/core';
import { formatUsd } from '../../utils/currency';

export default function OpenOrders() {
  // Polling example:
  //    useGetOrdersQuery(null, { pollingInterval: 20000 });
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  console.log(orders);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Everything is on fire!
        </Alert>
      ) : orders ? (
        <Stack spacing={2} alignItems="center">
          {orders.map((o) => (
            <Order key={o.sk} order={o} />
          ))}
        </Stack>
      ) : (
        <Skeleton variant="rectangular" width={210} height={118} />
      )}
    </Container>
  );
}

function Order(props) {
  const { order } = props;

  return (
    <Paper elevation={2} sx={{ padding: '.5rem' }}>
      <Stack spacing={1}>
        <h3>{`${order.firstName} ${order.lastName}`}</h3>
        <p>Order Status: {order.status}</p>
        <p>Total: {formatUsd(order.total)}</p>
        <p>Created: {order.created.split('T')[0]}</p>
      </Stack>
    </Paper>
  );
}
