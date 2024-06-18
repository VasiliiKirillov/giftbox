import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../store/store';
import { fetchUserData, getIsUserHasDB, getUserUID } from '../store/user';
import {
  fetchAvailableCurrencies,
  resetAvailableCurrencies,
} from '../store/availableCurrencies';
import { resetStorages } from '../store/storagesState';
import { resetIncomes } from '../store/incomesState';
import { resetExpenses } from '../store/expensesState';
import { resetCurrencyRates } from '../store/currencyRatesState';
import { SignOutButton } from '../components/SignOutButton';
import { FirstStorage } from '../components/FirstStorage';
import { MainContent } from '../components/MainContent';

export const MainPage = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const userUID = useSelector(getUserUID);
  const isUserHasDB = useSelector(getIsUserHasDB);

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
    return () => {
      dispatch(resetStorages());
      dispatch(resetIncomes());
      dispatch(resetExpenses());
      dispatch(resetCurrencyRates());
      dispatch(resetAvailableCurrencies());
    };
  }, []);
  console.log('gov !!!');

  useEffect(() => {
    if (!userUID) return;

    dispatch(fetchUserData(userUID));
  }, [userUID]);

  const content = useMemo(() => {
    if (isUserHasDB === true) return <MainContent />;
    else if (isUserHasDB === false) return <FirstStorage />;
    else return null;
  }, [isUserHasDB]);

  return (
    <MainContentStyled>
      <SignOutButton />
      {content}
    </MainContentStyled>
  );
});

// styles
const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
