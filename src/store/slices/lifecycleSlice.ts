import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LifecycleEntry = {
  state: string;
  at: number;
};

type LifecycleState = {
  current: string;
  history: LifecycleEntry[];
};

const HISTORY_LIMIT = 24;

const initialState: LifecycleState = {
  current: 'unknown',
  history: [],
};

const lifecycleSlice = createSlice({
  name: 'lifecycle',
  initialState,
  reducers: {
    appStateChanged(state, action: PayloadAction<string>) {
      const next = action.payload;
      state.current = next;
      state.history.unshift({ state: next, at: Date.now() });
      if (state.history.length > HISTORY_LIMIT) {
        state.history.length = HISTORY_LIMIT;
      }
    },
  },
});

export const { appStateChanged } = lifecycleSlice.actions;
export default lifecycleSlice.reducer;
