import Decimal from 'decimal.js';
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { addIncome, fetchIncomes, getIncomesSum } from './incomesState';
import { addExpense, fetchExpenses, getExpensesSum } from './expensesState';
import { db, getMonthAPI } from '../utils/api';
import { getUserUID } from './user';
import { RootState } from './store';
import { fetchStorages } from './storagesState';
import { getMonth, getYear } from '../utils/main';
import { handleNewMonthCreation } from './utils';

// types
export type AccountRecordRef = AccountRecordBase & {
  dateAdded: Timestamp;
};

// selectors
export const getProfitAmount = createSelector(
  getIncomesSum,
  getExpensesSum,
  (incomes, expenses) => new Decimal(incomes).minus(expenses).toNumber()
);

// async thunks
export const saveAccountRecord = createAsyncThunk(
  'saveAccountRecord',
  async (
    accountData: {
      accountType: 'expenses' | 'incomes';
      amount: number;
      description: string;
      storageId: StorageType['id'];
      currency: CurrencyKey;
    },
    thunkAPI
  ) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const accountCollectionRef = collection(
      db,
      `${getMonthAPI(userUID)}/${accountData.accountType}`
    );
    const docRef = await addDoc(accountCollectionRef, {
      amount: accountData.amount,
      dateAdded: serverTimestamp(),
      description: accountData.description,
      storageId: accountData.storageId,
      currency: accountData.currency,
    });

    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    if (!docData) throw Error('No account record after creation!');

    const accountRecordData: AccountRecord = {
      id: docSnap.id,
      storageId: docData.storageId,
      amount: docData.amount,
      description: docData.description,
      currency: docData.currency,
      dateAdded: docData?.dateAdded.toMillis(),
    };

    if (accountData.accountType === 'expenses') {
      thunkAPI.dispatch(addExpense(accountRecordData));
    } else if (accountData.accountType === 'incomes') {
      thunkAPI.dispatch(addIncome(accountRecordData));
    }
  }
);

export const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async (_, thunkAPI) => {
    const userUID = getUserUID(thunkAPI.getState() as RootState);
    if (!userUID) throw Error('No user UID!');

    const currentMonthDocRef = doc(
      db,
      `/users/${userUID}/months/${getMonth()}-${getYear()}`
    );
    const currentMonthDocSnap = await getDoc(currentMonthDocRef);

    if (currentMonthDocSnap.exists()) {
      thunkAPI.dispatch(fetchStorages());
      thunkAPI.dispatch(fetchIncomes());
      thunkAPI.dispatch(fetchExpenses());
    } else {
      await handleNewMonthCreation(userUID, thunkAPI);
    }
  }
);
