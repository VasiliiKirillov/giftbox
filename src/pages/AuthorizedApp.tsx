import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
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
import { CalculatorButton } from '../components/CalculatorButton';

export const AuthorizedApp = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!userUID) return;

    dispatch(fetchUserData(userUID));
  }, [userUID]);

  useEffect(() => {
    if (isUserHasDB === false) {
      navigate('/first-storage');
    }
  }, [isUserHasDB]);

  return (
    <MainContentStyled>
      <HeaderContainer>
        <CalculatorButton />
        <SignOutButton />
      </HeaderContainer>
      <Outlet />
    </MainContentStyled>
  );
});

// styles
const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
