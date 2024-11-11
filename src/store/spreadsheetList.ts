import { createSlice } from '@reduxjs/toolkit';
import { DataStatus } from '../utils/api';
import { RootState } from './store';
export type CurrencyDataType = {
  id: string;
  name: string;
  amount: string;
  currencyRate: string;
};
export type SpreadsheetType = { id: string; name: string };
export type SpreadsheetListType = Array<SpreadsheetType>;

export type SpreadsheetListState = {
  status: DataStatus;
  data: SpreadsheetListType;
  currencyData: CurrencyDataType | null;
  totalAmount: string | null;
};

const initialState: SpreadsheetListState = {
  status: DataStatus.idle,
  data: [],
  currencyData: null,
  totalAmount: null,
};

export const SpreadsheetListSlice = createSlice({
  name: 'spreadsheetList',
  initialState,
  reducers: {
    resetSpreadsheetList: () => initialState,
    setSpreadsheetList: (state, action) => {
      state.data = action.payload;
    },
    setCurrencyData: (state, action) => {
      state.currencyData = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
  },
});

export const {
  resetSpreadsheetList,
  setSpreadsheetList,
  setCurrencyData,
  setTotalAmount,
} = SpreadsheetListSlice.actions;

export const getSpreadsheetList = (store: RootState) =>
  store.spreadsheetList.data;
export const getCurrencyData = (store: RootState) =>
  store.spreadsheetList.currencyData;
export const getTotalAmount = (store: RootState) =>
  store.spreadsheetList.totalAmount;
