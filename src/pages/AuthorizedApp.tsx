import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
import {
  resetSpreadsheetList,
  setSpreadsheetList,
} from '../store/spreadsheetList';
import { fetchSheetData } from '../store/utils';

const getSheetsList = async (spreadsheetId: string) => {
  try {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    if (!accessToken) throw Error('No access token');

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'sheets(properties(title,sheetId,hidden))', // Limit the fields to only the sheet properties
        },
      }
    );

    const currentYearLastTwoDigits = new Date().getFullYear() % 100;
    const sheets = response.data.sheets
      .filter(
        (sheet: any) =>
          !sheet.properties.hidden &&
          sheet.properties.title.includes(currentYearLastTwoDigits)
      )
      .map((sheet: any) => ({
        name: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
      }));
    console.log('List of sheets:', sheets);
    return sheets;
  } catch (error) {
    console.error('Error fetching sheets list:', error);
  }
};

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
      dispatch(resetSpreadsheetList());
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

  const [spreadsheetId, setSpreadsheetId] = useState(
    localStorage.getItem('spreadsheetId') ?? ''
  );

  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    localStorage.setItem('spreadsheetId', spreadsheetId ?? '');
  }, [spreadsheetId]);

  useEffect(() => {
    const fetchFunc = async () => {
      setConnectionStatus('Loading... ⏳');
      const resp = await fetchSheetData(spreadsheetId, 'assets!B4');
      if (resp === 'error') {
        setConnectionStatus('Not connected 🚫');
      } else if (resp[0][0] === 'btc') {
        setConnectionStatus('Connected ✅');
        const sheets = await getSheetsList(spreadsheetId);
        dispatch(setSpreadsheetList(sheets));
      } else {
        setConnectionStatus('Connected ⚠️');
      }
    };
    if (spreadsheetId) {
      fetchFunc();
    }
  }, [spreadsheetId]);

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
