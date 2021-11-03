import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    updateAuth(state, action) {
      return action.payload;
    },
  },
});

const { actions, reducer } = authSlice;

export default reducer;

export const { updateAuth } = actions;

export const selectAuth = (state) => state.auth;

export const selectClientToken = (state) => state.auth.clientToken;
