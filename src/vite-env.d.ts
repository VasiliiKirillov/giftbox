/// <reference types="vite/client" />

type Currency = string;

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
  currency: Currency;
  startTotal: number;
};
