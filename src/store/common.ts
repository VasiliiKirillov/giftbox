import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { addIncome, getIncomesSum } from './incomesState';
import { addExpense, getExpensesSum } from './expensesState';
import {
  collection,
  getDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, getMonthAPI } from '../utils/api';
import { getUserUID } from './user';
import { RootState } from './store';

// types
export type AccountRecordRef = AccountRecordBase & {
  dateAdded: Timestamp;
};

// selectors
export const getProfitAmount = createSelector(
  getIncomesSum,
  getExpensesSum,
  (incomes, expenses) => incomes - expenses
);

// async thunks
export const saveAccountRecord = createAsyncThunk(
  'saveAccountRecord',
  async (
    accountData: {
      accountType: 'expenses' | 'incomes';
      amount: number;
      description: string;
      storage: string;
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
      storage: accountData.storage,
    });

    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    if (accountData.accountType === 'expenses') {
      thunkAPI.dispatch(
        addExpense({
          ...docData,
          dateAdded: docData?.dateAdded.toMillis(),
        })
      );
    } else if (accountData.accountType === 'incomes') {
      thunkAPI.dispatch(
        addIncome({
          ...docData,
          dateAdded: docData?.dateAdded.toMillis(),
        })
      );
    }
  }
);
