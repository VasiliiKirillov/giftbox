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

declare module '*.svg?react' {
  import React = require('react');
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
