import React, { useState, useEffect, useRef } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  Stack,
} from '@material-ui/core';
import AllOrders from './features/orders/AllOrders';
import UpdateOrderStatuses from './features/orders/UpdateOrderStatuses';
import { titleCase } from './utils/strings';

const views = Object.freeze({
  none: 'none',
  allOrders: 'allOrders',
  updateStatuses: 'updateStatuses',
});

export default function App() {
  const [display, setDisplay] = useState(views.none);
  const [showActiveDialog, setShowActiveDialog] = useState(false);
  const previousView = useRef(null);

  const toggleActiveDialog = () => setShowActiveDialog((prev) => !prev);

  const setView = (newView) =>
    setDisplay((prev) => {
      previousView.current = prev;
      return newView;
    });

  const showPreviousView = () => {
    const { current } = previousView;
    toggleActiveDialog();
    setDisplay(current ? current : views.none);
  };

  useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: () => {
      console.log('the user is idle');
      setView(views.none);
      toggleActiveDialog();
    },
    onActive: () => {
      console.log('the user is active');
    },
    onAction: () => {
      console.log('the user took some action');
    },
    debounce: 500,
  });

  useEffect(() => {
    function handleVisibilityChange() {
      console.log('visibility state:', document.visibilityState);
    }

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Container maxWidth="md">
      <Nav setView={setView} />

      {display === views.none && <h1>Nothing to see here</h1>}

      {display === views.allOrders && <AllOrders />}

      {display === views.updateStatuses && <UpdateOrderStatuses />}

      {showActiveDialog && (
        <Dialog open={showActiveDialog}>
          <DialogTitle>Set Yourself To Active?</DialogTitle>
          <Button onClick={showPreviousView}>Yes</Button>
        </Dialog>
      )}
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
