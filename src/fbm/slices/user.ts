import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { BaseError } from '../misc/commonTypes';
import { RootState } from '../misc/store';
import { fakeDelay } from '../misc/utils';

export type UserData = {
  name: string | null;
  email: string | null;
  remainingDailyQuota: number | null;
  subscriptionActive: boolean | null;
  serviceActive: boolean | null;
};

type UserDataState = {
  user: UserData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UserDataState = {
  user: {
    name: null,
    email: null,
    remainingDailyQuota: null,
    subscriptionActive: null,
    serviceActive: null,
  },
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '';
      });
  },
});

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    await fakeDelay();
    return {
      name: 'test',
      email: 'test@test.com',
      remainingDailyQuota: 10,
      subscriptionActive: true,
      serviceActive: true,
    };
  } catch (error) {
    const baseError = error as BaseError;
    const errorStatus = baseError?.response.status;
    const errorDetail = baseError?.response?.data?.detail;
    const errorMessage = `Fetching user data error
          ${errorStatus ? `Status: ${errorStatus};` : ''}
          ${errorDetail ? `Details: ${errorDetail}` : ''}`;

    toast.error(errorMessage);
    return Promise.reject(errorMessage);
  }
});

export const getUserDataStatus = (state: RootState) => state.userData.status;

export default userSlice.reducer;
