import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, DataStatus, getMonthAPI } from '../utils/api';
import { getUserUID, setIsUserHasDB } from './user';
import { getMonth, getYear } from '../utils/main';

export type StoragesState = {
  status: DataStatus;
  data: Array<StorageType>;
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

export const fetchStorages = createAsyncThunk(
  'fetchStorages',
  async (_, thunkAPI) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const storagesRef = collection(db, `${getMonthAPI(userUID)}/storages`);
    const storagesSnap = await getDocs(storagesRef);
    const storages: StorageType[] = [];
    storagesSnap.forEach((doc) => {
      storages.push({
        ...(doc.data() as StorageType),
      });
    });
    return storages;
  }
);

export const addFirstStorage = createAsyncThunk(
  'addFirstStorage',
  async (
    arg: {
      pickedCurrency: CurrencyType;
      storageName: string;
      storageAmount: number;
    },
    thunkAPI
  ) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const { pickedCurrency, storageName, storageAmount } = arg;

    // creation user's DB:
    // init user record + add default currency
    await setDoc(doc(db, 'users', userUID), {
      defaultCurrency: pickedCurrency.id,
    });
    const monthDocRef = doc(
      db,
      `users/${userUID}/months`,
      `${getMonth()}-${getYear()}`
    );
    const storageRef = doc(monthDocRef, 'storages', storageName.toLowerCase());
    // init first storage
    await setDoc(storageRef, {
      currency: pickedCurrency.id,
      id: storageName.toLowerCase(),
      name: storageName.toUpperCase(),
      startTotal: storageAmount,
    });
    thunkAPI.dispatch(setIsUserHasDB(true));
  }
);
