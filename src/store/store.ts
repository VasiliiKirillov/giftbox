import { configureStore } from '@reduxjs/toolkit';

import { IncomesSlice } from './incomesState';
import { ExpensesSlice } from './expensesState';

export const store = configureStore({
  reducer: {
    incomes: IncomesSlice.reducer,
    expenses: ExpensesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
