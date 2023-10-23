/// <reference types="vite/client" />

type Currency = string;

type AccountRecord = {
  id: string;
  storage: string;
  amount: number;
  description: string;
  dateAdded: { seconds: number };
};

type Storage = {
  id: string;
  shortName: string;
  currency: Currency;
  startTotal: number;
};
