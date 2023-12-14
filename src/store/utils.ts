import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import Decimal from 'decimal.js';
import { GetThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';

import { db, getMonthAPI } from '../utils/api';
import { getLastDay, getYear, months, monthsMap } from '../utils/main';
import { addNewStorage } from './storagesState';
import { AccountRecordRef } from './common';
import { AppDispatch } from './store';
import { setIsUserHasDB } from './user';

type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: AppDispatch;
};

type DateInfo = {
  month: string;
  year: string;
};

export const handleNewMonthCreation = async (
  userUID: string,
  thunkAPI: GetThunkAPI<AsyncThunkConfig>
) => {
  // find prev month
  const prevMonthData = await findPrevMonth(userUID);
  if (!prevMonthData) {
    // TODO test it!
    thunkAPI.dispatch(setIsUserHasDB(false));
    return;
  }

  // get prev month storages
  const prevMonthStorages = await getPrevMonthStorages(userUID, prevMonthData);
  const prevMonthStoragesByCurrency =
    getPrevMonthStoragesByCurrencyKey(prevMonthStorages);
  const prevMonthCurrencies = getUniqueCurrencies(prevMonthStoragesByCurrency);

  const currencyRatesForPrevAvailableMonth =
    await getCurrencyRatesForPrevAvailableMonth(
      prevMonthData,
      undefined,
      prevMonthCurrencies
    );

  await writeCurrencyRatesInPrevMonth(
    userUID,
    prevMonthData,
    prevMonthStoragesByCurrency,
    currencyRatesForPrevAvailableMonth
  );

  // calculate new started amounts
  const startedAmountsByStorageId: Record<StorageId, number> =
    await calculateStartedAmounts(userUID, prevMonthData, prevMonthStorages);

  await createStoragesForCurrentMonth(
    userUID,
    prevMonthStorages,
    startedAmountsByStorageId,
    thunkAPI
  );
};

const getUniqueCurrencies = (
  prevMonthStoragesByCurrency: Record<CurrencyKey, StorageType[]>
) => Array.from(new Set(Object.keys(prevMonthStoragesByCurrency)));

const createStoragesForCurrentMonth = async (
  userUID: string,
  prevMonthStorages: Record<StorageId, StorageType>,
  startedAmountsByStorageId: Record<StorageId, number>,
  thunkAPI: any
) => {
  await setDoc(doc(db, getMonthAPI(userUID)), {
    createdAt: serverTimestamp(),
  });

  const storageIds = Object.keys(prevMonthStorages);

  for (const storageId of storageIds) {
    await thunkAPI.dispatch(
      addNewStorage({
        currency: prevMonthStorages[storageId].currency,
        storageName: prevMonthStorages[storageId].name,
        storageAmount: startedAmountsByStorageId[storageId],
      })
    );
  }
};

const calculateStartedAmounts = async (
  userUID: string,
  prevDateInfo: DateInfo,
  prevMonthStoragesById: Record<StorageId, StorageType>
) => {
  const expensesSumByStorageId = await getExpensesSumByStorageId(
    userUID,
    prevDateInfo
  );
  const incomesSumByStorageId = await getIncomesSumByStorageId(
    userUID,
    prevDateInfo
  );

  const startedAmounts: Record<StorageId, number> = {};
  Object.keys(prevMonthStoragesById).forEach((storageId) => {
    startedAmounts[storageId] = new Decimal(
      prevMonthStoragesById[storageId].startTotal
    )
      .minus(expensesSumByStorageId[storageId])
      .plus(incomesSumByStorageId[storageId])
      .toNumber();
  });
  return startedAmounts;
};

const getIncomesSumByStorageId = async (
  userUID: string,
  dateInfo: DateInfo
) => {
  const incomesRef = collection(
    db,
    `users/${userUID}/months/${dateInfo.month}-${dateInfo.year}/incomes`
  );
  const incomesSnap = await getDocs(incomesRef);
  const incomesSum: Record<StorageId, number> = {};
  incomesSnap.forEach((doc) => {
    const docData = {
      ...(doc.data() as AccountRecordRef),
    };

    incomesSum[docData.storageId] = new Decimal(docData.amount)
      .plus(incomesSum[docData.storageId] || 0)
      .toNumber();
  });

  return incomesSum;
};

const getExpensesSumByStorageId = async (
  userUID: string,
  dateInfo: DateInfo
) => {
  const expensesRef = collection(
    db,
    `users/${userUID}/months/${dateInfo.month}-${dateInfo.year}/expenses`
  );
  const expensesSnap = await getDocs(expensesRef);
  const expensesSum: Record<StorageId, number> = {};
  expensesSnap.forEach((doc) => {
    const docData = {
      ...(doc.data() as AccountRecordRef),
    };

    expensesSum[docData.storageId] = new Decimal(docData.amount)
      .plus(expensesSum[docData.storageId] || 0)
      .toNumber();
  });

  return expensesSum;
};

const getPrevMonthStoragesByCurrencyKey = (
  prevMonthStoragesByCurrency: Record<StorageId, StorageType>
) => {
  const storagesByCurrencyKey: Record<CurrencyKey, StorageType[]> = {};
  Object.values(prevMonthStoragesByCurrency).forEach((storage) => {
    if (storagesByCurrencyKey[storage.currency]) {
      storagesByCurrencyKey[storage.currency] =
        storagesByCurrencyKey[storage.currency].concat(storage);
    } else {
      storagesByCurrencyKey[storage.currency] = [storage];
    }
  });
  return storagesByCurrencyKey;
};

const writeCurrencyRatesInPrevMonth = async (
  userUID: string,
  prevDateInfo: DateInfo,
  prevMonthStoragesByCurrency: Record<CurrencyKey, StorageType[]>,
  currencyRatesForPrevAvailableMonth: Record<CurrencyKey, number>
) => {
  const currencyKeys = Object.keys(currencyRatesForPrevAvailableMonth);

  for (const currencyKey of currencyKeys) {
    const storages = prevMonthStoragesByCurrency[currencyKey];

    for (const storage of storages) {
      const storageRef = doc(
        db,
        `/users/${userUID}/months/${prevDateInfo.month}-${prevDateInfo.year}/storages`,
        storage.id
      );

      // Set the "currencyRate" field of the storage document
      await updateDoc(storageRef, {
        currencyRate: currencyRatesForPrevAvailableMonth[currencyKey],
      });
    }
  }
};

const getPrevMonthStorages = async (
  userUID: string,
  prevDateInfo: DateInfo
) => {
  const prevMonthStoragesSnap = await getDocs(
    collection(
      db,
      `/users/${userUID}/months/${prevDateInfo.month}-${prevDateInfo.year}/storages`
    )
  );
  const prevMonthStoragesById: Record<StorageId, StorageType> = {};
  prevMonthStoragesSnap.forEach((doc) => {
    prevMonthStoragesById[doc.id] = doc.data() as StorageType;
  });
  return prevMonthStoragesById;
};

const getCurrencyRatesForPrevAvailableMonth = async (
  prevDateInfo: DateInfo,
  defaultCurrency = 'EUR',
  requiredCurrencies: string[]
) => {
  const response = await fetch(
    `http://data.fixer.io/api/${prevDateInfo.year}-${
      monthsMap[prevDateInfo.month]
    }-${getLastDay(
      Number(prevDateInfo.year),
      Number(monthsMap[prevDateInfo.month])
    )}?access_key=af51371a4012ccd4d0c852db20ac7c05&base=${defaultCurrency}&symbols=${requiredCurrencies.join(
      ','
    )}`
  );
  const result = await response.json();
  const parsedRates: Record<CurrencyKey, number> = {};
  for (const rate in result.rates) {
    parsedRates[rate] = new Decimal(1)
      .dividedBy(result.rates[rate])
      .toNumber()
      .toPrecision(5) as unknown as number;
  }
  return parsedRates;
};

const findPrevMonth = async (userUID: string) => {
  const monthsSnapshot = await getDocs(
    collection(db, `/users/${userUID}/months`)
  );
  const availableMonths: Record<string, any> = {};
  monthsSnapshot.forEach((doc) => {
    availableMonths[doc.id] = doc.data();
  });

  for (let year = getYear(); year >= 2022; year--) {
    for (const month of [...months].reverse()) {
      const key = `${month}-${year}`;
      if (availableMonths[key]) {
        return { month, year: String(year) };
      }
    }
  }
  return null;
};
