import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { SpreadsheetListSlice } from './spreadsheetList';
import { LimitOrdersSlice } from './limitOrders';
import { AppSlice } from './app';
import { ChatSlice } from './chat';
import storageReducer from './storage';
import accountingRecordReducer from './accountingRecord';
export const store = configureStore({
  reducer: {
    spreadsheetList: SpreadsheetListSlice.reducer,
    limitOrders: LimitOrdersSlice.reducer,
    app: AppSlice.reducer,
    chat: ChatSlice.reducer,
    storage: storageReducer,
    accountingRecord: accountingRecordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
