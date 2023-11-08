import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Storages } from '../components/Storages';
import { Accounting } from '../components/Accounting';
import { Calendar } from '../components/Calendar';
import { AppDispatch } from '../store/store';
import { fetchStorages } from '../store/storagesState';
import { fetchIncomes } from '../store/incomesState';
import { fetchExpenses } from '../store/expensesState';
import { SignOutButton } from '../components/SignOutButton';

const useFetchInitialData = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStorages());
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, []);
};

export const MainPage = memo(() => {
  useFetchInitialData();

  return (
    <MainContentStyled>
      <SignOutButton />
      <Storages />
      <Accounting />
      <Calendar />
    </MainContentStyled>
  );
});

// styles
const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
