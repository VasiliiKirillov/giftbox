import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/api';

export type UserState = {
  isSignedId?: boolean;
  name?: string;
  uid?: string;
  isUserHasDB?: boolean;
  defaultCurrency?: CurrencyKey;
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
    setDefaultCurrency: (state, action) => {
      state.defaultCurrency = action.payload;
    },
  },
});

// actions
export const {
  setSingedInUser,
  setSingedOutUser,
  setIsUserHasDB,
  setDefaultCurrency,
} = UserSlice.actions;

// selectors
export const getUserUID = (state: RootState) => state.user.uid;
export const getIsUserHasDB = (state: RootState) => state.user.isUserHasDB;
export const getIsUserSignedId = (state: RootState) => state.user.isSignedId;
export const getDefaultCurrencyKey = (state: RootState) =>
  state.user.defaultCurrency;

// async actions
export const fetchUserData = createAsyncThunk(
  'fetchUserData',
  async (userUID: string, thunkAPI) => {
    const userDocRef = doc(db, `/users/${userUID}`);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      thunkAPI.dispatch(setIsUserHasDB(true));
      const userData = userDocSnap.data();
      thunkAPI.dispatch(setDefaultCurrency(userData.defaultCurrency));
    } else {
      thunkAPI.dispatch(setIsUserHasDB(false));
    }
  }
);

export const updateDefaultCurrency = createAsyncThunk(
  'updateDefaultCurrency',
  async (currencyKey: CurrencyKey, thunkAPI) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    await updateDoc(doc(db, 'users', userUID), {
      defaultCurrency: currencyKey,
    });
    thunkAPI.dispatch(setDefaultCurrency(currencyKey));
  }
);
