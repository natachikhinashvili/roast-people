import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialCounterState = { token: null };

const tokenSlice = createSlice({
  name: 'token',
  initialState: initialCounterState,
  reducers: {
    reset(state, action) {
      state.token = action.payload
    }
  }
});

const store = configureStore({
  reducer: { token: tokenSlice.reducer},
});

export const tokenActions = tokenSlice.actions

export default store