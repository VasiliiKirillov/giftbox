import { configureStore } from '@reduxjs/toolkit';

import { SpreadsheetListSlice } from './spreadsheetList';

export const store = configureStore({
  reducer: {
    spreadsheetList: SpreadsheetListSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
