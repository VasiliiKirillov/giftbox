import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  CurrencyDataType,
  getSpreadsheetList,
  setCurrencyData,
  setTotalAmount,
  SpreadsheetType,
} from '../../store/spreadsheetList';
import { DropdownComponent } from '../common/Dropdown/Dropdown';
import { fetchSheetData } from '../../store/utils';
import { SpreadsheetConnection } from './SpreadsheetConnection';

export const SpreadsheetDataElement = memo(() => {
  const dispatch = useDispatch();
  const spreadsheetList = useSelector(getSpreadsheetList);

  const [pickedSpreadsheet, setPickedSpreadsheet] =
    useState<SpreadsheetType | null>(null);
  const [storagesData, setStoragesData] = useState<Array<CurrencyDataType>>([]);
  const [pickedCurrencyData, setPickedCurrencyData] =
    useState<CurrencyDataType | null>(null);

  useEffect(() => {
    if (!spreadsheetList || !spreadsheetList[0]?.name) return;

    setPickedSpreadsheet(spreadsheetList[0]);
    loadTotalAmount(spreadsheetList[0].name);
  }, [spreadsheetList]);

  const loadTotalAmount = async (sheetName: string) => {
    const spreadsheetId = localStorage.getItem('spreadsheetId') ?? '';
    const totalAmount = await fetchSheetData(spreadsheetId, `${sheetName}!L1`);
    dispatch(setTotalAmount(totalAmount?.[0]?.[0]));
  };

  const handlePickSpreadsheet = useCallback((element: SpreadsheetType) => {
    setPickedSpreadsheet(element);
  }, []);

  useEffect(() => {
    if (!pickedSpreadsheet) return;
    loadCurrenciesData();
  }, [pickedSpreadsheet]);

  const loadCurrenciesData = async () => {
    if (!pickedSpreadsheet) return;
    const spreadsheetId = localStorage.getItem('spreadsheetId') ?? '';
    const currencyDataRange = `${pickedSpreadsheet.name}!A6:J10`;
    const currencyDataRange2 = `${pickedSpreadsheet.name}!G1:J5`;
    const thresholdDataRange = `${pickedSpreadsheet.name}!X1:X7`;

    const [currData, currData2, currThresholds] = await Promise.all([
      fetchSheetData(spreadsheetId, currencyDataRange),
      fetchSheetData(spreadsheetId, currencyDataRange2),
      fetchSheetData(spreadsheetId, thresholdDataRange),
    ]);

    const thresholds = mapThresholds(currThresholds);
    const formattedStoragesData = formatStoragesData(
      [
        [...currData[0], ...currData2[0]],
        [...currData[1], ...currData2[1]],
        [...currData[2], ...currData2[2]],
        [...currData[3], ...currData2[3]],
        [...currData[4], ...currData2[4]],
      ],
      thresholds
    );
    setStoragesData(formattedStoragesData);
  };

  type ThresholdsData = [string][]; // Each inner array contains exactly one string

  const mapThresholds = (thresholdsData: ThresholdsData) => {
    return thresholdsData.reduce((acc: ThresholdsMap, [str]: Array<string>) => {
      const [key, values] = str.split(' ');
      const [desirablePercent, belowThreshold, aboveThreshold] =
        values.split('-');
      acc[key] = { desirablePercent, belowThreshold, aboveThreshold };
      return acc;
    }, {});
  };

  type ThresholdsMap = Record<
    string,
    { desirablePercent: string; belowThreshold: string; aboveThreshold: string }
  >;
  type CurrDataArray = string[][];

  const formatStoragesData = (
    currData: CurrDataArray,
    thresholds: ThresholdsMap
  ) => {
    return currData[0]
      .map((storeName, index) => {
        if (!storeName) return null;
        const storageData = {
          id: storeName,
          name: storeName,
          desirablePercent: thresholds[storeName].desirablePercent,
          belowThreshold: thresholds[storeName].belowThreshold,
          aboveThreshold: thresholds[storeName].aboveThreshold,
          amount: currData[currData[0][index + 1] === '' ? 2 : 4][index],
          currencyRate:
            currData[1][currData[0][index + 1] === '' ? index + 1 : index],
        };
        return storageData;
      })
      .filter((item): item is CurrencyDataType => item !== null);
  };

  const handlePickCurrencyData = useCallback(
    (currencyData: CurrencyDataType) => {
      dispatch(setCurrencyData(currencyData));
      setPickedCurrencyData(currencyData);
    },
    [dispatch]
  );

  return (
    <SpreadsheetDataContainer>
      <SpreadsheetConnection />
      <CurrencyContainer>
        <DropdownElement>
          <DropdownComponent
            listData={spreadsheetList || []}
            placeholderValue="Loading..."
            currentItem={pickedSpreadsheet?.name ?? ''}
            changeItemAction={handlePickSpreadsheet}
          />
        </DropdownElement>
        <DropdownElement>
          <DropdownComponent
            listData={storagesData}
            placeholderValue={
              storagesData.length ? 'Pick currency' : 'Loading...'
            }
            currentItem={pickedCurrencyData?.name ?? ''}
            changeItemAction={handlePickCurrencyData}
          />
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
