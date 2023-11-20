export const getMonth = () => {
  const month = [
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

  const d = new Date();
  return month[d.getMonth()];
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
