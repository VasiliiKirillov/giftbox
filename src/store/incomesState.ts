import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import { collection, getDocs } from 'firebase/firestore';
import { db, API_MONTHS, DataStatus } from '../utils/api';
import { sortAccountingData } from '../utils/main';

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
  reducers: {},
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

// export const { } = IncomesSlice.actions;

export const getIncomes = (store: RootState) => store.incomes.data;
export const getIncomesSum = createSelector(getIncomes, (incomes) =>
  incomes.reduce((acc, curr) => acc + curr.amount, 0)
);

export const fetchIncomes = createAsyncThunk('fetchIncomes', async () => {
  const incomesRef = collection(db, `${API_MONTHS}/incomes`);
  const incomesSnap = await getDocs(incomesRef);
  const incomes: AccountRecord[] = [];
  incomesSnap.forEach((doc) => {
    incomes.push({
      id: doc.id,
      ...(doc.data() as Omit<AccountRecord, 'id'>),
    });
  });
  return sortAccountingData(incomes);
});
