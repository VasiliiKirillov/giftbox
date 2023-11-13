import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../utils/api';

export type UserState = {
  isSignedId?: boolean;
  name?: string;
  uid?: string;
  isUserHasDB?: boolean;
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
      delete state.isUserHasDB;
    },
    setIsUserHasDB: (state, action) => {
      state.isUserHasDB = action.payload;
    },
  },
});

// actions
export const { setSingedInUser, setSingedOutUser, setIsUserHasDB } =
  UserSlice.actions;

// selectors
export const getUserUID = (state: RootState) => state.user.uid;
export const getIsUserHasDB = (state: RootState) => state.user.isUserHasDB;
export const getIsUserSignedId = (state: RootState) => state.user.isSignedId;

// async actions
export const fetchUserData = createAsyncThunk(
  'fetchUserData',
  async (userUID: string, thunkAPI) => {
    const userDocRef = doc(db, `/users/${userUID}`);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      thunkAPI.dispatch(setIsUserHasDB(true));
    } else {
      thunkAPI.dispatch(setIsUserHasDB(false));
    }
  }
);
