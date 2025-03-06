import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import axios from 'axios';

export interface Storage {
  metaData: string;
  name: string;
}

interface StorageState {
  storages: Storage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StorageState = {
  storages: [],
  isLoading: false,
  error: null,
};

export const fetchAllStorages = createAsyncThunk(
  'storage/fetchAll',
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/storage`);
    return response.data;
  }
);

export const StorageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStorages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllStorages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storages = action.payload;
        state.error = null;
      })
      .addCase(fetchAllStorages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch storages';
        state.storages = [];
      });
  },
});

// Selectors
export const getStorages = (state: RootState) => state.storage.storages;
export const getStorageIsLoading = (state: RootState) =>
  state.storage.isLoading;
export const getStorageError = (state: RootState) => state.storage.error;

export const getStoragesByName = createSelector([getStorages], (storages) => {
  return storages.reduce(
    (acc, storage) => {
      acc[storage.name] = storage;
      return acc;
    },
    {} as { [key: string]: Storage }
  );
});

export default StorageSlice.reducer;
