import React, { memo, useEffect, useState } from 'react';
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
import {
  CurrencyRatesData,
  resetSpreadsheetList,
  setCurrencyRatesData,
  setSpreadsheetList,
} from '../store/spreadsheetList';
import {
  fetchCurrencyRates,
  fetchSheetData,
  getSheetsList,
  writeBatchToSpreadsheet,
} from '../store/utils';

export const AuthorizedApp = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const userUID = useSelector(getUserUID);
  const isUserHasDB = useSelector(getIsUserHasDB);

  const [spreadsheetId, setSpreadsheetId] = useState(
    localStorage.getItem('spreadsheetId') ?? ''
  );
  const [connectionStatus, setConnectionStatus] = useState('');

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

  // Save spreadsheetId to localStorage and check connection
  useEffect(() => {
    localStorage.setItem('spreadsheetId', spreadsheetId);
    if (spreadsheetId) checkSpreadsheetConnection();
  }, [spreadsheetId]);

  // Check connection status and update currency rates
  const checkSpreadsheetConnection = async () => {
    setConnectionStatus('Loading... ⏳');
    const connectionResult = await loadSpreadsheetData(dispatch, spreadsheetId);
    setConnectionStatus(connectionResult);
  };

  return (
    <>
      <HeaderContainer>
        <ConnectContainer>
          <InputStyled
            onChange={(e) => setSpreadsheetId(e.target.value)}
            value={spreadsheetId}
          />
          <div>{connectionStatus}</div>
        </ConnectContainer>
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
  width: 400px;
`;

const ConnectContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
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

// spreadsheetUtils.js
const loadSpreadsheetData = async (
  dispatch: AppDispatch,
  spreadsheetId: string
) => {
  const response = await fetchSheetData(spreadsheetId, 'assets!B4');
  if (response === 'error') return 'Not connected 🚫';

  if (response?.[0]?.[0] === 'btc') {
    const currencyRates = await fetchCurrencyRates();
    if (currencyRates !== 'error') {
      await updateCurrencyRates(dispatch, spreadsheetId, currencyRates);

      const sheets = await getSheetsList(spreadsheetId);
      dispatch(setSpreadsheetList(sheets));

      return 'Connected ✅';
    }
    return 'Connected ⚠️';
  }
  return 'Connected ⚠️';
};

const updateCurrencyRates = async (
  dispatch: AppDispatch,
  spreadsheetId: string,
  currencyRates: CurrencyRatesData
) => {
  dispatch(setCurrencyRatesData(currencyRates));
  const currRangeUpdate = [
    { range: 'assets!Q5', values: [[currencyRates.ton]] },
    { range: 'assets!B5', values: [[currencyRates.btc]] },
    { range: 'assets!G5', values: [[currencyRates.eth]] },
    { range: 'assets!L5', values: [[currencyRates.sol]] },
    { range: 'assets!V5', values: [[currencyRates.not]] },
    { range: 'assets!AA5', values: [[currencyRates.hmstr]] },
  ];
  await writeBatchToSpreadsheet(spreadsheetId, currRangeUpdate);
};
