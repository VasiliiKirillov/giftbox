import { auth, provider } from '../utils/api';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const fetchSheetData = async (
  spreadsheetId: string,
  RANGE: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw Error('error');

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
      return 'not authorized';
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
      'https://api.coingecko.com/api/v3/simple/price?x_cg_demo_api_key=CG-QGCaqTLDgT1YSBpg9cqpZnnv&ids=bitcoin,ethereum,the-open-network,notcoin,hamster-kombat,flow,havven,cosmos&vs_currencies=usd',
      {
        headers: {
          accept: 'application/json',
        },
      }
    );
    return {
      btc: response.data['bitcoin'].usd as string,
      eth: response.data['ethereum'].usd as string,
      ton: response.data['the-open-network'].usd as string,
      not: response.data['notcoin'].usd as string,
      hmstr: response.data['hamster-kombat'].usd as string,
      flow: response.data['flow'].usd as string,
      snx: response.data['havven'].usd as string,
      atom: response.data['cosmos'].usd as string,
    };
  } catch (error: any) {
    console.error('Gekko Error fetching:', error);
    return 'error';
  }
};

export const refreshGoogleAccessTokenViaSignIn = async () => {
  try {
    provider.addScope('https://www.googleapis.com/auth/spreadsheets'); // Add Sheets API scope
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const newAccessToken = credential?.accessToken as string;

    // Store the new token and expiration time
    localStorage.setItem('accessToken', newAccessToken);

    console.log('Access token refreshed:', newAccessToken);
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
