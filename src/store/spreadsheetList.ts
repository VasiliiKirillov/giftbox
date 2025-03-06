import { createSlice } from '@reduxjs/toolkit';
import { DataStatus } from '../utils/api';
import { RootState } from './store';
export type CurrencyDataType = {
  id: string;
  name: string;
  amount: string;
  currencyRate: string;
  desirablePercent: string;
  belowThreshold: string;
  aboveThreshold: string;
};
export type SpreadsheetType = { id: string; name: string };
export type SpreadsheetListType = Array<SpreadsheetType>;

export type CurrencyRatesData = {
  btc: string;
  eth: string;
  ton: string;
  not: string;
  hmstr: string;
  flow: string;
  snx: string;
  atom: string;
};

export type SpreadsheetListState = {
  status: DataStatus;
  data: SpreadsheetListType;
  pickedAsset: CurrencyDataType | null;
  pickedSpreadsheet: SpreadsheetType | null;
  totalAmount: string | null;
  currencyRatesData: CurrencyRatesData | null;
};

const initialState: SpreadsheetListState = {
  status: DataStatus.idle,
  data: [],
  pickedAsset: null,
  pickedSpreadsheet: null,
  totalAmount: null,
  currencyRatesData: null,
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
      state.pickedAsset = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setCurrencyRatesData: (state, action) => {
      state.currencyRatesData = action.payload;
    },
    setPickedSpreadsheetToStore: (state, action) => {
      state.pickedSpreadsheet = action.payload;
    },
  },
});

export const {
  resetSpreadsheetList,
  setSpreadsheetList,
  setCurrencyData,
  setTotalAmount,
  setCurrencyRatesData,
  setPickedSpreadsheetToStore,
} = SpreadsheetListSlice.actions;

export const getSpreadsheetList = (store: RootState) =>
  store.spreadsheetList.data;
export const getPickedAsset = (store: RootState) =>
  store.spreadsheetList.pickedAsset;
export const getTotalAmount = (store: RootState) =>
  store.spreadsheetList.totalAmount;
export const getPickedSpreadsheet = (store: RootState) =>
  store.spreadsheetList.pickedSpreadsheet;
