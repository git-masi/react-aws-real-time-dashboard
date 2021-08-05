import React, { useState } from 'react';
import { Button, Container, Stack } from '@material-ui/core';
import AllOrders from './features/orders/AllOrders';

const views = Object.freeze({
  none: 'none',
  allOrders: 'allOrders',
});

export default function App() {
  const [display, setDisplay] = useState(views.none);

  return (
    <Container maxWidth="md">
      <Nav setView={setDisplay} />
      {display === views.none && <h1>Nothing to see here</h1>}
      {display === views.allOrders && <AllOrders />}
    </Container>
  );
}

function Nav(props) {
  const { setView } = props;
  const buttons = Object.values(views).map((path) => (
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

function titleCase(str) {
  const split = str.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2');
  return split.substring(0, 1).toUpperCase() + split.substring(1);
}
