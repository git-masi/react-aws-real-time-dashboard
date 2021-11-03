import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Container,
  TextField,
  Stack,
  Tooltip,
} from '@material-ui/core';
import { useCreateClientMutation } from '../../app/services/api';
import { updateAuth } from '../../app/authSlice';

export function ClientForm(props) {
  const { onLogin } = props;
  const [trigger] = useCreateClientMutation();
  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    const auth = await trigger().unwrap();
    dispatch(updateAuth(auth));
    onLogin();
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
              type="password"
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
