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
import { API_MONTHS, db } from '../utils/api';

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
    const accountCollectionRef = collection(
      db,
      `${API_MONTHS}/${accountData.accountType}`
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
