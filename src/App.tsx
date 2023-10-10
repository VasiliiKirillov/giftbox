import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { Storages } from './components/Storages';
import { Accounting } from './components/Accounting';
import { Calendar } from './components/Calendar';
import { fetchIncomes } from './store/incomesState';
import { AppDispatch } from './store/store';
import { fetchExpenses } from './store/expensesState';

const useFetchInitialData = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, []);
};

export const App = () => {
  useFetchInitialData();

  return (
    <AppContainerStyled>
      <MainContentStyled>
        <Storages />
        <Accounting />
        <Calendar />
      </MainContentStyled>
    </AppContainerStyled>
  );
};

// styles
const AppContainerStyled = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
