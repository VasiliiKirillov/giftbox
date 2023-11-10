import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../utils/api';

export type UserState = {
  isSignedId?: boolean;
  name?: string;
  uid?: string;
  isNewUser?: boolean;
};

const initialState: UserState = {};

export const UserSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setSingedInUser: (state, action) => {
      state.isSignedId = true;
      state.name = action.payload.name;
      state.uid = action.payload.uid;
    },
    setSingedOutUser: (state) => {
      state.isSignedId = false;
      delete state.name;
      delete state.uid;
      delete state.isNewUser;
    },
    setIsNewUser: (state, action) => {
      state.isNewUser = action.payload;
    },
  },
});

// actions
export const { setSingedInUser, setSingedOutUser, setIsNewUser } =
  UserSlice.actions;

// selectors
export const getUserUID = (state: RootState) => state.user.uid;
export const getNewUserStatus = (state: RootState) => state.user.isNewUser;
export const getIsUserSignedId = (state: RootState) => state.user.isSignedId;

// async actions
export const fetchUserData = createAsyncThunk(
  'fetchUserData',
  async (userUID: string, thunkAPI) => {
    const userDocRef = doc(db, `/users/${userUID}`);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      console.log('Document data:', userDocSnap.data());
      // take last Month-Year from Months and create current Month-Year, create and link storages
      thunkAPI.dispatch(setIsNewUser(false));
    } else {
      thunkAPI.dispatch(setIsNewUser(true));
    }
  }
);
