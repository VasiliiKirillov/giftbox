/// <reference types="vite/client" />

type CurrencyType = { name: string; id: string };

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
  currency: CurrencyType['name'];
  startTotal: number;
};
