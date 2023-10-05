import { configureStore } from '@reduxjs/toolkit';

import { IncomesSlice } from './incomesState';

export const store = configureStore({
  reducer: {
    incomes: IncomesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
