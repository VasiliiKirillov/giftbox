import { configureStore } from '@reduxjs/toolkit';

import { IncomesSlice } from './incomesState';
import { ExpensesSlice } from './expensesState';
import { StoragesSlice } from './storagesState';
import { UserSlice } from './user';
import { AvailableCurrenciesSlice } from './availableCurrencies';
import { CurrencyRatesSlice } from './currencyRatesState';
import { SpreadsheetListSlice } from './spreadsheetList';

export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    incomes: IncomesSlice.reducer,
    expenses: ExpensesSlice.reducer,
    storages: StoragesSlice.reducer,
    availableCurrencies: AvailableCurrenciesSlice.reducer,
    currencyRates: CurrencyRatesSlice.reducer,
    spreadsheetList: SpreadsheetListSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
