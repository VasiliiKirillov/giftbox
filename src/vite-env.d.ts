/// <reference types="vite/client" />

type Currency = string;

type AccountRecord = {
  id: string;
  storage: string;
  amount: number;
  description: string;
  dateAdded: { seconds: number };
};

type StorageType = {
  id: string;
  name: string;
  currency: Currency;
  startTotal: number;
};
