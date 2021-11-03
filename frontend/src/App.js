import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useIdleTimer } from 'react-idle-timer';
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  Tooltip,
} from '@material-ui/core';
import AllOrders from './features/orders/AllOrders';
import UpdateOrderStatuses from './features/orders/UpdateOrderStatuses';
import { titleCase } from './utils/strings';
import { selectClientToken } from './app/authSlice';
import { borderRadius } from '@material-ui/system';

const views = Object.freeze({
  none: 'none',
  allOrders: 'allOrders',
  updateStatuses: 'updateStatuses',
});

export default function App() {
  const [display, setDisplay] = useState(views.none);

  const previousView = useRef(null);

  const setView = (newView) =>
    setDisplay((prev) => {
      previousView.current = prev;
      return newView;
    });

  return (
    <Container maxWidth="md">
      <Nav setView={setView} />

      {display === views.none && <ClientForm />}

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

function ClientForm() {
  const login = (e) => {
    e.preventDefault();
    console.log('login');
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: '1rem',
        border: '1px solid #42a5f5',
        borderRadius: '3px',
      }}
    >
      <form onSubmit={login}>
        <Stack direction={'column'} sx={{ padding: '1rem 0' }} spacing={2}>
          <Tooltip title="This can be anything" placement="bottom-start">
            <TextField
              id="outlined-basic"
              label="username"
              variant="outlined"
              required
              size="small"
            />
          </Tooltip>

          <Tooltip title="This can be anything" placement="bottom-start">
            <TextField
              id="outlined-basic"
              label="password"
              variant="outlined"
              required
              size="small"
            />
          </Tooltip>

          <Button type="submit" variant="outlined">
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

// function IdleTimer() {
// const [showActiveDialog, setShowActiveDialog] = useState(false);
// const showPreviousView = () => {
//   const { current } = previousView;
//   toggleActiveDialog();
//   setDisplay(current ? current : views.none);
// };
//   const { isIdle, pause, resume } = useIdleTimer({
//     timeout: 1000 * 60 * 15,
//     onIdle: () => {
//       console.log('the user is idle');
//       setView(views.none);
//       toggleActiveDialog();
//     },
//     onActive: () => {
//       console.log('the user is active');
//     },
//     onAction: () => {
//       console.log('the user took some action');
//     },
//     debounce: 500,
//   });

//   const setToActive = () => {
//     showPreviousView();
//     resume();
//   };

//   useEffect(() => {
//     if (isIdle()) pause();
//   });

//   useEffect(() => {
//     function handleVisibilityChange() {
//       console.log('visibility state:', document.visibilityState);
//     }

//     window.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       window.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   return (
//     <Dialog open={showActiveDialog}>
//       <DialogTitle>Set Yourself To Active?</DialogTitle>
//       <Button onClick={setToActive}>Yes</Button>
//     </Dialog>
//   );
// }
