import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AppDispatch } from '../store/store';
import {
  fetchCurrencyRates,
  fetchSheetData,
  getSheetsList,
  refreshGoogleAccessTokenViaSignIn,
  writeBatchToSpreadsheet,
} from '../store/utils';
import {
  CurrencyRatesData,
  setCurrencyRatesData,
  setSpreadsheetList,
} from '../store/spreadsheetList';
import { useDispatch } from 'react-redux';

const CONNECTION_STATUS = {
  NOT_CONNECTED: 'Not connected',
  LOADING: 'Loading... ⏳',
  CONNECTED: 'Connected ✅',
  CONNECTED_WARNING: 'Connected ⚠️',
  ERROR: 'Error 🚫',
  NOT_AUTHORIZED: 'Not connected 🔑',
  UNKNOWN: '???',
} as const;

type ConnectionStatusType =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

export const SpreadsheetConnection = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const [spreadsheetId, setSpreadsheetId] = useState(
    localStorage.getItem('spreadsheetId') ?? ''
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusType>(CONNECTION_STATUS.NOT_CONNECTED);

  // Save spreadsheetId to localStorage and check connection
  const handleConnect = useCallback(async () => {
    setConnectionStatus(CONNECTION_STATUS.LOADING);

    await refreshGoogleAccessTokenViaSignIn();

    localStorage.setItem('spreadsheetId', spreadsheetId);
    checkSpreadsheetConnection();
  }, [spreadsheetId]);

  useEffect(() => {
    if (!spreadsheetId) return;
    setConnectionStatus(CONNECTION_STATUS.LOADING);
    localStorage.setItem('spreadsheetId', spreadsheetId);
    checkSpreadsheetConnection();
  }, [spreadsheetId]);

  // Check connection status and update currency rates
  const checkSpreadsheetConnection = async () => {
    const connectionResult = await loadSpreadsheetData(dispatch, spreadsheetId);
    setConnectionStatus(connectionResult);
  };

  return (
    <SpreadsheetConnectionContainer>
      <ConnectionStatus>{connectionStatus}</ConnectionStatus>
      <InputStyled
        onChange={(e) => setSpreadsheetId(e.target.value)}
        value={spreadsheetId}
      />
      <ConnectContainer>
        <SignInStyled
          disabled={
            !spreadsheetId ||
            connectionStatus === CONNECTION_STATUS.CONNECTED ||
            connectionStatus === CONNECTION_STATUS.LOADING
          }
          onClick={handleConnect}
        >
          Connect to spreadsheet
        </SignInStyled>
      </ConnectContainer>
    </SpreadsheetConnectionContainer>
  );
});

const ConnectionStatus = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 8px;
  line-height: 20px;
`;

const SignInStyled = styled.button`
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid gainsboro;
  padding: 4px;
  height: 28px;
  margin-top: 4px;
  width: 100%;
`;

const ConnectContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`;

const SpreadsheetConnectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
`;

// spreadsheetUtils.js
const loadSpreadsheetData = async (
  dispatch: AppDispatch,
  spreadsheetId: string
) => {
  const response = await fetchSheetData(spreadsheetId, 'assets!B4');
  if (response === 'error') {
    return CONNECTION_STATUS.ERROR;
  }
  if (response === 'not authorized') {
    return CONNECTION_STATUS.NOT_AUTHORIZED;
  }

  if (response?.[0]?.[0] === 'btc') {
    const currencyRates = await fetchCurrencyRates();
    if (currencyRates !== 'error') {
      await updateCurrencyRates(dispatch, spreadsheetId, currencyRates);

      const sheets = await getSheetsList(spreadsheetId);
      dispatch(setSpreadsheetList(sheets));

      return CONNECTION_STATUS.CONNECTED;
    }
    return CONNECTION_STATUS.CONNECTED_WARNING;
  }
  return CONNECTION_STATUS.UNKNOWN;
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
    { range: 'assets!V5', values: [[currencyRates.not]] },
    { range: 'assets!AA5', values: [[currencyRates.hmstr]] },
    { range: 'assets!AF5', values: [[currencyRates.snx]] },
    { range: 'assets!AK5', values: [[currencyRates.atom]] },
    { range: 'assets!AU5', values: [[currencyRates.flow]] },
  ];
  await writeBatchToSpreadsheet(spreadsheetId, currRangeUpdate);
};

const InputStyled = styled.input`
  background: rgba(233, 233, 233, 0.5);
  height: 32px;
  font-size: 16px;
  color: #1b1b1b;
  padding: 4px;
  border: none;
`;
