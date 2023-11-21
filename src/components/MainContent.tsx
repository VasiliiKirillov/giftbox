import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Storages } from './Storages';
import { Accounting } from './Accounting';
import { Calendar } from './Calendar';
import { fetchExpenses } from '../store/expensesState';
import { fetchIncomes } from '../store/incomesState';
import { fetchStorages } from '../store/storagesState';
import { AppDispatch } from '../store/store';
import { DefaultCurrencyPicker } from './DefaultCurrencyPicker';
import { getInUseCurrenciesList } from '../store/availableCurrencies';
import { getDefaultCurrencyKey } from '../store/user';
import { fetchCurrencyRates } from '../store/currencyRatesState';

const useFetchInitialData = () => {
  const dispatch: AppDispatch = useDispatch();

  const inUseCurrenciesList = useSelector(getInUseCurrenciesList);
  const defaultCurrencyKey = useSelector(getDefaultCurrencyKey);

  useEffect(() => {
    if (inUseCurrenciesList.length === 0 || !defaultCurrencyKey) return;
    const requiredCurrencies = inUseCurrenciesList.map(
      (currency) => currency.id
    );
    dispatch(fetchCurrencyRates({ defaultCurrencyKey, requiredCurrencies }));
  }, [inUseCurrenciesList, defaultCurrencyKey]);

  useEffect(() => {
    // TODO add check for current month existence

    dispatch(fetchStorages());
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, []);
};

export const MainContent = memo(() => {
  useFetchInitialData();

  return (
    <>
      <DefaultCurrencyPicker />
      <Storages />
      <Accounting />
      <Calendar />
    </>
  );
});
