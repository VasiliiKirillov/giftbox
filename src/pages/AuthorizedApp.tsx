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
    <>
      <HeaderContainer>
        <SignOutButton />
      </HeaderContainer>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </>
  );
});

const ContentContainer = styled.div`
  padding: 32px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  flex-direction: row;
  height: 48px;
  width: 100%;
  background-color: gainsboro;
  padding: 0 32px;
  box-sizing: border-box;
`;
