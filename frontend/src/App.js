import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

// Redux store
import { selectClientToken } from './app/authSlice';

// Utils
import { titleCase } from './utils/strings';

// Components
import AllOrders from './features/orders/AllOrders';
import UpdateOrderStatuses from './features/orders/UpdateOrderStatuses';
import { Button, Container, Stack } from '@material-ui/core';
import { ClientForm } from './features/login/ClientForm';

const views = Object.freeze({
  none: 'none',
  allOrders: 'allOrders',
  updateStatuses: 'updateStatuses',
});

export default function App() {
  const [display, setDisplay] = useState(views.none);
  // todo: implement the idle timer feature
  const previousView = useRef(null);

  const setView = (newView) =>
    setDisplay((prev) => {
      previousView.current = prev;
      return newView;
    });

  const handleLoginSuccess = () => {
    setView(views.allOrders);
  };

  return (
    <Container maxWidth="md">
      <Nav setView={setView} />

      {display === views.none && <ClientForm onLogin={handleLoginSuccess} />}

      {display === views.allOrders && <AllOrders />}

      {display === views.updateStatuses && <UpdateOrderStatuses />}
    </Container>
  );
}

function Nav(props) {
  const { setView } = props;
  const clientToken = useSelector(selectClientToken);

  if (!clientToken) return null;

  const buttons = Object.values(views)
    .filter((path) => path !== views.none)
    .map((path) => (
      <Button key={path} variant="outlined" onClick={() => setView(path)}>
        {titleCase(path)}
      </Button>
    ));

  return (
    <Stack direction={'row'} sx={{ padding: '1rem 0' }} spacing={2}>
      {buttons}
    </Stack>
  );
}
