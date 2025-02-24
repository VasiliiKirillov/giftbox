import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { SpreadsheetListSlice } from './spreadsheetList';
import { LimitOrdersSlice } from './limitOrders';
import { AppSlice } from './app';

export const store = configureStore({
  reducer: {
    spreadsheetList: SpreadsheetListSlice.reducer,
    limitOrders: LimitOrdersSlice.reducer,
    app: AppSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
