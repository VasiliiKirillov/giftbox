/// <reference types="vite/client" />

type CurrencyKey = string; // "USD", "EUR" and etc

type StorageId = string;

type AccountRecordBase = {
  storageId: StorageId;
  amount: number;
  description: string;
  currency: CurrencyKey;
};

type AccountRecord = AccountRecordBase & {
  id: string;
  dateAdded: number;
};

type StorageType = {
  id: StorageId;
  name: string;
  currency: CurrencyKey;
  startTotal: number;
};
