import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, DataStatus, getMonthAPI } from '../utils/api';
import { getUserUID, setDefaultCurrency, setIsUserHasDB } from './user';

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
  reducers: {
    addStorage: (state, action) => {
      state.data = state.data.concat(action.payload);
    },
  },
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

export const { addStorage } = StoragesSlice.actions;

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

export const addNewStorage = createAsyncThunk(
  'addNewStorage',
  async (
    arg: {
      currency: CurrencyKey;
      storageName: string;
      storageAmount: number;
    },
    thunkAPI
  ) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const { currency, storageName, storageAmount } = arg;

    const storageRef = doc(
      db,
      `${getMonthAPI(userUID)}/storages`,
      storageName.toLowerCase()
    );
    const newStorageData = {
      currency,
      id: storageName.toLowerCase(),
      name: storageName.toUpperCase(),
      startTotal: storageAmount,
    };
    await setDoc(storageRef, newStorageData);
    thunkAPI.dispatch(addStorage(newStorageData));
  }
);

export const addFirstStorage = createAsyncThunk(
  'addFirstStorage',
  async (
    arg: {
      currency: CurrencyKey;
      storageName: string;
      storageAmount: number;
    },
    thunkAPI
  ) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const { currency, storageName, storageAmount } = arg;

    // creation user's DB:
    // init user record + add default currency
    await setDoc(doc(db, 'users', userUID), {
      defaultCurrency: currency,
    });
    await thunkAPI.dispatch(
      addNewStorage({
        currency,
        storageName,
        storageAmount,
      })
    );
    thunkAPI.dispatch(setDefaultCurrency(currency));
    thunkAPI.dispatch(setIsUserHasDB(true));
  }
);
