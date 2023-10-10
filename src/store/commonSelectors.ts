import { createSelector } from '@reduxjs/toolkit';
import { getIncomesSum } from './incomesState';
import { getExpensesSum } from './expensesState';

export const getProfitAmount = createSelector(
  getIncomesSum,
  getExpensesSum,
  (incomes, expenses) => incomes - expenses
);
