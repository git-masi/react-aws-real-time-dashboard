// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { useIdleTimer } from 'react-idle-timer';
// import {
//   Button,
//   Container,
//   Dialog,
//   DialogTitle,
//   TextField,
//   Stack,
//   Tooltip,
// } from '@material-ui/core';
// import AllOrders from './features/orders/AllOrders';
// import UpdateOrderStatuses from './features/orders/UpdateOrderStatuses';
// import { titleCase } from './utils/strings';
// import { selectClientToken } from './app/authSlice';
// import { ClientForm } from './features/login/ClientForm';

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
