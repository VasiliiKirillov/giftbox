export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthsMap: Record<string, string> = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

export const getLastDay = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const getMonth = () => {
  const d = new Date();
  return months[d.getMonth()];
};

export const getYear = () => {
  const d = new Date();
  return d.getFullYear();
};

export const sortAccountingData = (data: AccountRecord[]) =>
  data.sort((a, b) => {
    if (a.dateAdded < b.dateAdded) {
      return 1;
    }
    if (a.dateAdded > b.dateAdded) {
      return -1;
    }
    return 0;
  });

export const generateStorageId = (
  storageName: string,
  currencyKey: CurrencyKey
) => `${storageName.trim().replaceAll(' ', '_')}-${currencyKey}`;
