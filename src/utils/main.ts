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

export const API = `months/${getMonth()}-${getYear() + 1}`;
