import { configureStore } from '@reduxjs/toolkit';

import { SpreadsheetListSlice } from './spreadsheetList';
import { LimitOrdersSlice } from './limitOrders';

export const store = configureStore({
  reducer: {
    spreadsheetList: SpreadsheetListSlice.reducer,
    limitOrders: LimitOrdersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
