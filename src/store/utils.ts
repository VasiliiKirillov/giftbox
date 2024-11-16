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

import { auth, db, getMonthAPI } from '../utils/api';
import { getLastDay, getYear, months, monthsMap } from '../utils/main';
import { addNewStorage } from './storagesState';
import { AccountRecordRef } from './common';
import { AppDispatch } from './store';
import { setIsUserHasDB } from './user';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { provider } from '../pages/Auth.page';

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
  defaultCurrency = 'USD',
  requiredCurrencies: string[]
) => {
  const response = await fetch(
    /*`http://data.fixer.io/api/${prevDateInfo.year}-${
      monthsMap[prevDateInfo.month]
    }-${getLastDay(
      Number(prevDateInfo.year),
      Number(monthsMap[prevDateInfo.month])
    )}?access_key=af51371a4012ccd4d0c852db20ac7c05&base=${defaultCurrency}&symbols=${requiredCurrencies.join(
      ','
    )}`*/
    `https://openexchangerates.org/api/historical/${prevDateInfo.year}-${
      monthsMap[prevDateInfo.month]
    }-${getLastDay(
      Number(prevDateInfo.year),
      Number(monthsMap[prevDateInfo.month])
    )}?app_id=d090a84e92d044fdb4c03656de42c6b1&base=${defaultCurrency}&symbols=${requiredCurrencies.join(
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

export const fetchSheetData = async (
  spreadsheetId: string,
  RANGE: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw Error('No token');

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${RANGE}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Google Sheets Data:', response.data.values);
    return response.data.values;
  } catch (error: any) {
    if (error?.status === 401) {
      await refreshGoogleAccessToken();
      return await fetchSheetData(spreadsheetId, RANGE);
    }
    console.error('Error fetching Google Sheets data:', error);
    return 'error';
  }
};

export const fetchCurrencyRates = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw Error('No token');

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?x_cg_demo_api_key=CG-QGCaqTLDgT1YSBpg9cqpZnnv&ids=bitcoin,ethereum,the-open-network,notcoin,hamster-kombat,solana&vs_currencies=usd',
      {
        headers: {
          accept: 'application/json',
        },
      }
    );
    return {
      btc: response.data['bitcoin'].usd as string,
      eth: response.data['ethereum'].usd as string,
      sol: response.data['solana'].usd as string,
      ton: response.data['the-open-network'].usd as string,
      not: response.data['notcoin'].usd as string,
      hmstr: response.data['hamster-kombat'].usd as string,
    };
  } catch (error: any) {
    console.error('Gekko Error fetching:', error);
    return 'error';
  }
};

const refreshGoogleAccessToken = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const newAccessToken = credential?.accessToken as string;

    // Store the new token and expiration time
    localStorage.setItem('accessToken', newAccessToken);

    console.log('Access token refreshed:', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

type CurrencyRangeUpdateType = {
  range: string;
  values: string[][];
};

export const writeBatchToSpreadsheet = async (
  spreadsheetId: string,
  currencyRangeUpdate: CurrencyRangeUpdateType[]
) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw Error('No token');
    const response = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        data: currencyRangeUpdate,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          valueInputOption: 'USER_ENTERED', // Allows user-entered data format
        },
      }
    );
    console.log('Data written to Google Sheets:', response.data);
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
  }
};

export const writeDataToSpreadsheet = async (
  spreadsheetId: string,
  RANGE: string,
  values: Array<string>
) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw Error('No token');
    const response = await axios.put(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${RANGE}`,
      {
        range: RANGE,
        majorDimension: 'ROWS',
        values: [values], // The data to write, as an array of arrays
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          valueInputOption: 'USER_ENTERED', // Allows user-entered data format
        },
      }
    );
    console.log('Data written to Google Sheets:', response.data);
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
  }
};

export const getSheetsList = async (spreadsheetId: string) => {
  try {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) throw Error('No access token');

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'sheets(properties(title,sheetId,hidden))', // Limit the fields to only the sheet properties
        },
      }
    );

    const currentYearLastTwoDigits = new Date().getFullYear() % 100;
    const sheets = response.data.sheets
      .filter(
        (sheet: any) =>
          !sheet.properties.hidden &&
          sheet.properties.title.includes(currentYearLastTwoDigits)
      )
      .map((sheet: any) => ({
        name: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
      }));
    console.log('List of sheets:', sheets);
    return sheets;
  } catch (error) {
    console.error('Error fetching sheets list:', error);
  }
};
