import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export enum UserStatus {
  idle = 'idle',
  signedIn = 'signedIn',
  signedOut = 'signedOut',
}

export type UserState = {
  status: UserStatus;
  data: UserType | null;
};

const initialState: UserState = {
  status: UserStatus.idle,
  data: null,
};

export const UserSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setSingedInUser: (state, action) => {
      state.status = UserStatus.signedIn;
      state.data = action.payload;
    },
    setSingedOutUser: (state) => {
      state.status = UserStatus.signedOut;
      state.data = null;
    },
  },
});

export const { setSingedInUser, setSingedOutUser } = UserSlice.actions;

export const getUserData = (state: RootState) => state.user.data;
export const getUserStatus = (state: RootState) => state.user.status;
