import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import { collection, getDocs } from 'firebase/firestore';
import { db, API_MONTHS, DataStatus } from '../utils/api';
import { sortAccountingData } from '../utils/main';

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      });
    // .addCase(fetchExpenses.rejected, (state, action) => {
    //   state.status = DataStatus.failed;
    //   state.error = action.error.message ?? "";
    // });
  },
});

// export const { } = ExpensesSlice.actions;

export const getExpenses = (store: RootState) => store.expenses.data;
export const getExpensesSum = createSelector(getExpenses, (expenses) =>
  expenses.reduce((acc, curr) => acc + curr.amount, 0)
);

export const fetchExpenses = createAsyncThunk('fetchExpenses', async () => {
  const expensesRef = collection(db, `${API_MONTHS}/expenses`);
  const expensesSnap = await getDocs(expensesRef);
  const expenses: AccountRecord[] = [];
  expensesSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    expenses.push({
      id: doc.id,
      ...(doc.data() as Omit<AccountRecord, 'id'>),
    });
  });
  return sortAccountingData(expenses);
});
