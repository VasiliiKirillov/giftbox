import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputStyled } from '../pages/AuthorizedApp';
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

export const SpreadsheetConnection = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const [spreadsheetId, setSpreadsheetId] = useState(
    localStorage.getItem('spreadsheetId') ?? ''
  );
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

  // Save spreadsheetId to localStorage and check connection
  const handleConnect = useCallback(async () => {
    setConnectionStatus('Loading... ⏳');

    await refreshGoogleAccessTokenViaSignIn();

    localStorage.setItem('spreadsheetId', spreadsheetId);
    checkSpreadsheetConnection();
  }, [spreadsheetId]);

  useEffect(() => {
    if (!spreadsheetId) return;
    setConnectionStatus('Loading... ⏳');
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
            connectionStatus === 'Connected ✅' ||
            connectionStatus === 'Loading... ⏳'
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
    return 'Error 🚫';
  }
  if (response === 'not authorized') {
    return 'Not connected 🚫';
  }

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
  return '???';
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
