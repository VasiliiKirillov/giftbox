import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Storages } from './Storages';
import { Accounting } from './Accounting';
import { Calendar } from './Calendar';
import { fetchExpenses } from '../store/expensesState';
import { fetchIncomes } from '../store/incomesState';
import { fetchStorages } from '../store/storagesState';
import { AppDispatch } from '../store/store';

const useFetchInitialData = () => {
  const dispatch: AppDispatch = useDispatch();

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
      <Storages />
      <Accounting />
      <Calendar />
    </>
  );
});
