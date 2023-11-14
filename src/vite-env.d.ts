/// <reference types="vite/client" />

type CurrencyKey = string; // "USD", "EUR" and etc

type AccountRecordBase = {
  storage: string;
  amount: number;
  description: string;
};

type AccountRecord = AccountRecordBase & {
  id: string;
  dateAdded: number;
};

type StorageType = {
  id: string;
  name: string;
  currency: CurrencyKey;
  startTotal: number;
};
