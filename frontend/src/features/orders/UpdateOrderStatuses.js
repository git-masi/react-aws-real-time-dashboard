import React from 'react';
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from '../../app/services/api';
import { formatUsd } from '../../utils/currency';
import {
  Stack,
  CircularProgress,
  Skeleton,
  Alert,
  AlertTitle,
  Paper,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

export const orderStatuses = Object.freeze({
  open: 'open',
  cancelled: 'cancelled',
  paid: 'paid',
});

export default function UpdateOrderStatuses() {
  const { data: orders, error, isLoading, refetch } = useGetOrdersQuery();

  console.log(
    '%cUpdateOrderStatuses component cache subscription:',
    'color: goldenrod',
    orders
  );

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
      <Button
        onClick={refetch}
        variant="contained"
        sx={{ marginBottom: '1rem' }}
      >
        refetch data
      </Button>

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
  const [
    updatePost, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useUpdateOrderMutation();

  const handleChange = (e) => {
    const { value: status } = e.target;
    updatePost({ pk: order.pk, sk: order.sk, status });
  };

  return (
    <Paper elevation={2} sx={{ padding: '.5rem' }}>
      <Stack spacing={1}>
        <h3>{`${order.firstName} ${order.lastName}`}</h3>
        {isUpdating ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Order Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order.status}
              label="Order Status"
              onChange={handleChange}
            >
              {Object.values(orderStatuses).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <p>Total: {formatUsd(order.total)}</p>
        <p>Created: {order.created.split('T')[0]}</p>
      </Stack>
    </Paper>
  );
}
