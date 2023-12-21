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

export type ExpensesState = {
  status: DataStatus;
  data: AccountRecord[];
};

const initialState: ExpensesState = {
  status: DataStatus.idle,
  data: [],
};

export const ExpensesSlice = createSlice({
  name: 'expensesState',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.data = [action.payload].concat(state.data);
    },
    resetExpenses: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      });
  },
});

export const { addExpense, resetExpenses } = ExpensesSlice.actions;

export const getExpenses = (store: RootState) => store.expenses.data;
export const getExpensesStatus = (store: RootState) => store.expenses.status;
export const getIsExpensesLoading = createSelector(
  getExpensesStatus,
  (status) => {
    return status === DataStatus.loading;
  }
);
export const getExpensesSum = createSelector(
  getExpenses,
  getCurrencyRates,
  (expenses, currencyRates) => {
    if (expenses.length === 0 || Object.keys(currencyRates).length === 0)
      return 0;

    return expenses.reduce((acc, income) => {
      return new Decimal(income.amount)
        .times(currencyRates[income.currency])
        .plus(acc)
        .toNumber();
    }, 0);
  }
);
export const getExpensesSumByStorageId = createSelector(
  getExpenses,
  (expenses) =>
    expenses.reduce(
      (acc: { [key: StorageId]: number }, { storageId, amount }) => {
        if (acc[storageId]) {
          acc[storageId] = acc[storageId] + amount;
        } else {
          acc[storageId] = amount;
        }
        return acc;
      },
      {}
    )
);

export const fetchExpenses = createAsyncThunk(
  'fetchExpenses',
  async (_, thunkAPI) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const expensesRef = collection(db, `${getMonthAPI(userUID)}/expenses`);
    const expensesSnap = await getDocs(expensesRef);
    const expenses: AccountRecord[] = [];
    expensesSnap.forEach((doc) => {
      const docData = {
        ...(doc.data() as AccountRecordRef),
      };
      expenses.push({
        id: doc.id,
        ...docData,
        dateAdded: docData.dateAdded.toMillis(),
      });
    });
    return sortAccountingData(expenses);
  }
);
