import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { collection, getDocs } from 'firebase/firestore';
import { db, API_MONTHS, DataStatus } from '../utils/api';

export type StoragesState = {
  status: DataStatus;
  data: Array<Storage>;
};

const initialState: StoragesState = {
  status: DataStatus.idle,
  data: [],
};

export const StoragesSlice = createSlice({
  name: 'storagesState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorages.pending, (state) => {
        state.status = DataStatus.loading;
      })
      .addCase(fetchStorages.fulfilled, (state, action) => {
        state.status = DataStatus.succeeded;
        state.data = action.payload;
      })
      .addCase(fetchStorages.rejected, (state) => {
        state.status = DataStatus.failed;
        state.data = initialState.data;
      });
  },
});

export const getStorages = (store: RootState) => store.storages.data;

export const fetchStorages = createAsyncThunk('fetchStorages', async () => {
  const storagesRef = collection(db, `${API_MONTHS}/storages`);
  const storagesSnap = await getDocs(storagesRef);
  const storages: Storage[] = [];
  storagesSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    storages.push({
      ...(doc.data() as Storage),
    });
  });
  return storages;
});
