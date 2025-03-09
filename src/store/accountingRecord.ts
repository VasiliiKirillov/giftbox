import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import axios from 'axios';

export interface AccountingRecord {
  accountingRecordId: number;
  amount: number;
  record: string;
  report: string;
  storage: string;
  technicalMessage: string;
  transactionMonth: number;
  transactionYear: number;
  type: 'expense' | 'income';
}

interface AccountingRecordState {
  records: AccountingRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountingRecordState = {
  records: [],
  isLoading: false,
  error: null,
};

export const fetchAllAccountingRecords = createAsyncThunk(
  'accountingRecord/fetchAll',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/accounting-records`
    );
    return response.data;
  }
);

export const AccountingRecordSlice = createSlice({
  name: 'accountingRecord',
  initialState,
  reducers: {
    addAccountingRecord: (state, action: PayloadAction<AccountingRecord>) => {
      state.records.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAccountingRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAccountingRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
        state.error = null;
      })
      .addCase(fetchAllAccountingRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Failed to fetch accounting records';
        state.records = [];
      });
  },
});

export const { addAccountingRecord } = AccountingRecordSlice.actions;

// Selectors
export const getAccountingRecords = (state: RootState) =>
  state.accountingRecord.records;
export const getAccountingRecordIsLoading = (state: RootState) =>
  state.accountingRecord.isLoading;
export const getAccountingRecordError = (state: RootState) =>
  state.accountingRecord.error;

export const getAccountingRecordsByType = createSelector(
  [getAccountingRecords],
  (records) => {
    return records.reduce(
      (acc, record) => {
        if (!acc[record.type]) {
          acc[record.type] = [];
        }
        acc[record.type].push(record);
        return acc;
      },
      {} as { [key: string]: AccountingRecord[] }
    );
  }
);

export default AccountingRecordSlice.reducer;
