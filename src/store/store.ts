import { configureStore } from '@reduxjs/toolkit';

import { IncomesSlice } from './incomesState';
import { ExpensesSlice } from './expensesState';
import { StoragesSlice } from './storagesState';

export const store = configureStore({
  reducer: {
    incomes: IncomesSlice.reducer,
    expenses: ExpensesSlice.reducer,
    storages: StoragesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
