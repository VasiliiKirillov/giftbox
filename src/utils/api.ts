import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import { getMonth, getYear } from './main';

export const getMonthAPI = (userUID: string) =>
  `users/${userUID}/months/${getMonth()}-${getYear()}`;

const firebaseConfig = {
  apiKey: 'AIzaSyDf6EmJoSfqMXI1bbvXHPIDh0flGyhtrsw',
  authDomain: 'giftbox-af946.firebaseapp.com',
  projectId: 'giftbox-af946',
  storageBucket: 'giftbox-af946.appspot.com',
  messagingSenderId: '346863241139',
  appId: '1:346863241139:web:98437796089c9e3d50edc6',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets'); // Add Sheets API scope

export enum DataStatus {
  idle = 'idle',
  loading = 'loading',
  succeeded = 'succeeded',
  failed = 'failed',
}
