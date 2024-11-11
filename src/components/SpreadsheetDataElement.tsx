import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  CurrencyDataType,
  getSpreadsheetList,
  setCurrencyData,
  setTotalAmount,
  SpreadsheetType,
} from '../store/spreadsheetList';
import { DropdownComponent } from './common/Dropdown/Dropdown';
import { fetchSheetData } from '../store/utils';

export const SpreadsheetDataElement = memo(() => {
  const spreadsheetList = useSelector(getSpreadsheetList);
  const [pickedSpreadsheet, setPickedSpreadsheet] =
    useState<SpreadsheetType | null>(null);

  useEffect(() => {
    if (!spreadsheetList) return;
    setPickedSpreadsheet(spreadsheetList[0]);

    const fetchTotalAmount = async (spreadsheetId: string, range: string) => {
      console.log('gov range', range);
      const totalAmount = await fetchSheetData(spreadsheetId, range);
      dispatch(setTotalAmount(totalAmount[0][0]));
    };
    if (!spreadsheetList[0]?.name) return;
    fetchTotalAmount(
      localStorage.getItem('spreadsheetId') ?? '',
      `${spreadsheetList[0].name}!L1`
    );
  }, [spreadsheetList]);

  const handlePickSpreadsheet = useCallback((element: SpreadsheetType) => {
    setPickedSpreadsheet(element);
  }, []);

  const [storagesData, setStoragesData] =
    useState<Array<CurrencyDataType> | null>(null);

  // fetch currencies with related data (btc, eth, currentPrice, my amount, etc)
  useEffect(() => {
    const spreadsheetId = localStorage.getItem('spreadsheetId');
    if (!pickedSpreadsheet?.name || !spreadsheetId) return;
    const fetchCurrencies = async () => {
      const resp = await fetchSheetData(
        spreadsheetId,
        `${pickedSpreadsheet.name}!A1:J5`
      );
      const storagesData: Array<CurrencyDataType> = [];
      resp[0].forEach((storeName: string, index: number) => {
        if (storeName === '') return;
        const newStorageData = {} as CurrencyDataType;
        newStorageData.id = storeName;
        newStorageData.name = storeName;
        if (resp[0][index + 1] === '') {
          newStorageData.amount = resp[2][index];
          newStorageData.currencyRate = resp[1][index + 1];
        } else {
          newStorageData.amount = resp[4][index];
          newStorageData.currencyRate = resp[1][index];
        }
        storagesData.push(newStorageData);
      });
      setStoragesData(storagesData);
    };

    fetchCurrencies();
  }, [pickedSpreadsheet]);

  const [pickedCurrencyData, setPickedCurrencyData] =
    useState<CurrencyDataType | null>(null);

  const dispatch = useDispatch();
  const handlePickCurrencyData = useCallback(
    (pickedCurrencyData: CurrencyDataType) => {
      dispatch(setCurrencyData(pickedCurrencyData));
      setPickedCurrencyData(pickedCurrencyData);
    },
    []
  );

  return (
    <SpreadsheetDataContainer>
      <CurrencyContainer>
        <DropdownElement>
          {spreadsheetList && (
            <DropdownComponent
              listData={spreadsheetList}
              placeholderValue={'Pick sheet'}
              currentItem={pickedSpreadsheet?.name ?? ''}
              changeItemAction={handlePickSpreadsheet}
            />
          )}
        </DropdownElement>
        <DropdownElement>
          {storagesData && (
            <DropdownComponent
              listData={storagesData}
              placeholderValue={'Pick storage'}
              currentItem={pickedCurrencyData?.name ?? ''}
              changeItemAction={handlePickCurrencyData}
            />
          )}
        </DropdownElement>
      </CurrencyContainer>
    </SpreadsheetDataContainer>
  );
});

const CurrencyContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const DropdownElement = styled.div`
  display: flex;
  flex-direction: column;
  height: 40px;
  width: 200px;
  margin: 8px;
  margin-top: 34px;
`;

const SpreadsheetDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 432px;
`;
