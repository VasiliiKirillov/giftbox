import { configureStore } from '@reduxjs/toolkit';

import { IncomesSlice } from './incomesState';
import { ExpensesSlice } from './expensesState';
import { StoragesSlice } from './storagesState';
import { UserSlice } from './user';

export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    incomes: IncomesSlice.reducer,
    expenses: ExpensesSlice.reducer,
    storages: StoragesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
