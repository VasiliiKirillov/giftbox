import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Storages } from './Storages';
import { Accounting } from './Accounting';
import { Calendar } from './Calendar';
import { AppDispatch } from '../store/store';
import { DefaultCurrencyPicker } from './DefaultCurrencyPicker';
import { getInUseCurrenciesList } from '../store/availableCurrencies';
import { getDefaultCurrencyKey } from '../store/user';
import { fetchCurrencyRates } from '../store/currencyRatesState';
import { fetchInitialData } from '../store/common';

const useFetchInitialData = () => {
  const dispatch: AppDispatch = useDispatch();

  const inUseCurrenciesList = useSelector(getInUseCurrenciesList);
  const defaultCurrencyKey = useSelector(getDefaultCurrencyKey);

  // fetch currency rates
  useEffect(() => {
    if (inUseCurrenciesList.length === 0 || !defaultCurrencyKey) return;
    const requiredCurrencies = inUseCurrenciesList.map(
      (currency) => currency.id
    );
    dispatch(fetchCurrencyRates({ defaultCurrencyKey, requiredCurrencies }));
  }, [inUseCurrenciesList, defaultCurrencyKey]);

  useEffect(() => {
    dispatch(fetchInitialData());
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
