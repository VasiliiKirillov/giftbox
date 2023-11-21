import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import { DataStatus } from '../utils/api';
import { getDefaultCurrencyKey } from './user';
import { getIsCurrencyInUseById } from './storagesState';

type CurrenciesMap = Record<CurrencyKey, string>;

export type AvailableCurrenciesState = {
  status: DataStatus;
  data: CurrenciesMap;
};

const initialState: AvailableCurrenciesState = {
  status: DataStatus.idle,
  data: {},
};

export const AvailableCurrenciesSlice = createSlice({
  name: 'availableCurrenciesState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCurrencies.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchAvailableCurrencies.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      })
      .addCase(fetchAvailableCurrencies.rejected, (state) => {
        state.status = DataStatus.failed;
      });
  },
});

export const getAvailableCurrencies = (store: RootState) =>
  store.availableCurrencies.data;
export const getCurrenciesList = createSelector(
  getAvailableCurrencies,
  (availableCurrencies) => {
    return Object.entries(availableCurrencies).map(([key, value]) => ({
      id: key,
      name: value,
    }));
  }
);
export const getSortedForNewStorageCurrenciesList = createSelector(
  getCurrenciesList,
  getDefaultCurrencyKey,
  (currenciesList, defaultCurrencyKey) => {
    const comparerArray = ['USD', defaultCurrencyKey].filter(Boolean);
    return currenciesList.sort((a, b) => {
      {
        if (comparerArray.includes(a.id)) {
          return -1;
        } else if (comparerArray.includes(b.id)) {
          return 1;
        }
        return 0;
      }
    });
  }
);
export const getInUseCurrenciesList = createSelector(
  getCurrenciesList,
  getIsCurrencyInUseById,
  (currenciesList, isCurrencyInUseById) =>
    currenciesList.filter((currency) => isCurrencyInUseById[currency.id])
);

export const fetchAvailableCurrencies = createAsyncThunk(
  'fetchAvailableCurrencies',
  async () => {
    try {
      const response = await fetch(
        'http://data.fixer.io/api/symbols?access_key=2accd0dee4f82ccc1ae565dde6a3288d'
      );
      const result = await response.json();
      return result.symbols;
    } catch {
      return Promise.reject();
    }
  }
);
