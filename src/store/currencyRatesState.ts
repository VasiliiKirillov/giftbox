import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DataStatus } from '../utils/api';
import { RootState } from './store';
import Decimal from 'decimal.js';

type CurrencyRatesMap = Record<CurrencyKey, number>;

export type CurrencyRatesState = {
  status: DataStatus;
  data: CurrencyRatesMap;
};

const initialState: CurrencyRatesState = {
  status: DataStatus.idle,
  data: {},
};

export const CurrencyRatesSlice = createSlice({
  name: 'currencyRatesState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      })
      .addCase(fetchCurrencyRates.rejected, (state) => {
        state.status = DataStatus.failed;
      });
  },
});

export const getCurrencyRates = (store: RootState) => store.currencyRates.data;

export const fetchCurrencyRates = createAsyncThunk(
  'fetchCurrencyRates',
  async (arg: {
    defaultCurrencyKey: CurrencyKey;
    requiredCurrencies: Array<CurrencyKey>;
  }) => {
    try {
      const currencyBase = 'EUR'; // arg.defaultCurrencyKey
      const parsedRequiredCurrencies = arg.requiredCurrencies.join(',');
      const response = await fetch(
        `http://data.fixer.io/api/latest?access_key=2accd0dee4f82ccc1ae565dde6a3288d&base=${currencyBase}&symbols=${parsedRequiredCurrencies}`
      );
      const result = await response.json();
      const exchangeRates = result.rates;
      for (const currency in exchangeRates) {
        exchangeRates[currency] = new Decimal(1)
          .dividedBy(exchangeRates[currency])
          .toNumber()
          .toPrecision(5);
      }
      return exchangeRates;
    } catch {
      return Promise.reject();
    }
  }
);
