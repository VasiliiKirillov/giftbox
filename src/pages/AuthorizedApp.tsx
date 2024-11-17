import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch } from '../store/store';
import { fetchUserData, getIsUserHasDB, getUserUID } from '../store/user';
import { resetAvailableCurrencies } from '../store/availableCurrencies';
import { resetStorages } from '../store/storagesState';
import { resetIncomes } from '../store/incomesState';
import { resetExpenses } from '../store/expensesState';
import { resetCurrencyRates } from '../store/currencyRatesState';
import { SignOutButton } from '../components/SignOutButton';
import { resetSpreadsheetList } from '../store/spreadsheetList';

export const AuthorizedApp = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const userUID = useSelector(getUserUID);
  const isUserHasDB = useSelector(getIsUserHasDB);

  // Handle resetting states on component unmount
  useEffect(() => {
    return () => dispatch(resetStates());
  }, [dispatch]);

  // Fetch user data when userUID changes
  useEffect(() => {
    if (userUID) dispatch(fetchUserData(userUID));
  }, [userUID, dispatch]);

  // Redirect if the user does not have a database
  useEffect(() => {
    if (isUserHasDB === false) {
      // TODO: init DB flow or create spreadsheet
    }
  }, [isUserHasDB, navigate]);

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

export const InputStyled = styled.input`
  background: rgba(233, 233, 233, 0.5);
  height: 32px;
  font-size: 16px;
  color: #1b1b1b;
  padding: 4px;
  border: none;
`;

const ContentContainer = styled.div`
  padding: 16px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  height: 48px;
  width: 100%;
  background-color: gainsboro;
  padding: 0 32px;
  box-sizing: border-box;
`;

// resetActions.js
const resetStates = () => (dispatch: AppDispatch) => {
  dispatch(resetStorages());
  dispatch(resetIncomes());
  dispatch(resetExpenses());
  dispatch(resetSpreadsheetList());
  dispatch(resetCurrencyRates());
  dispatch(resetAvailableCurrencies());
};
