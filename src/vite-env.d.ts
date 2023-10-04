/// <reference types="vite/client" />

type AccountRecord = {
  id: string;
  storage: string;
  amount: number;
  description: string;
  dateAdded: { seconds: number };
};
