import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import Decimal from 'decimal.js';
import { collection, getDocs } from 'firebase/firestore';

import { RootState } from './store';
import { db, DataStatus, getMonthAPI } from '../utils/api';
import { sortAccountingData } from '../utils/main';
import { AccountRecordRef } from './common';
import { getUserUID } from './user';
import { getCurrencyRates } from './currencyRatesState';

export type IncomesState = {
  status: DataStatus;
  data: AccountRecord[];
};

const initialState: IncomesState = {
  status: DataStatus.idle,
  data: [],
};

export const IncomesSlice = createSlice({
  name: 'incomesState',
  initialState,
  reducers: {
    addIncome: (state, action) => {
      state.data = [action.payload].concat(state.data);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      });
    // .addCase(fetchIncomes.rejected, (state, action) => {
    //   state.status = DataStatus.failed;
    //   state.error = action.error.message ?? "";
    // });
  },
});

export const { addIncome } = IncomesSlice.actions;

export const getIncomes = (store: RootState) => store.incomes.data;
export const getIncomesStatus = (store: RootState) => store.expenses.status;
export const getIsIncomesLoading = createSelector(
  getIncomesStatus,
  (status) => {
    return status === DataStatus.loading;
  }
);
export const getIncomesSum = createSelector(
  getIncomes,
  getCurrencyRates,
  (incomes, currencyRates) => {
    if (incomes.length === 0 || Object.keys(currencyRates).length === 0)
      return 0;

    return incomes.reduce((acc, income) => {
      return new Decimal(income.amount)
        .times(currencyRates[income.currency])
        .plus(acc)
        .toNumber();
    }, 0);
  }
);
export const getIncomesSumByStorageId = createSelector(getIncomes, (incomes) =>
  incomes.reduce((acc: { [key: StorageId]: number }, { storageId, amount }) => {
    if (acc[storageId]) {
      acc[storageId] = acc[storageId] + amount;
    } else {
      acc[storageId] = amount;
    }
    return acc;
  }, {})
);

export const fetchIncomes = createAsyncThunk(
  'fetchIncomes',
  async (_, thunkAPI) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const incomesRef = collection(db, `${getMonthAPI(userUID)}/incomes`);
    const incomesSnap = await getDocs(incomesRef);
    const incomes: AccountRecord[] = [];
    incomesSnap.forEach((doc) => {
      const docData = {
        ...(doc.data() as AccountRecordRef),
      };
      incomes.push({
        id: doc.id,
        ...docData,
        dateAdded: docData.dateAdded.toMillis(),
      });
    });
    return sortAccountingData(incomes);
  }
);
