import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Input } from '../common/Input/Input';

type InitialDataProps = {
  totalAmount: string;
  setTotalAmount: (a: string) => void;
  assetsAmount: string;
  setAssetsAmount: (a: string) => void;
  assetsCurrency: string;
  setAssetsCurrency: (a: string) => void;
  assetsPercent: string;
  setAssetsPercent: (a: string) => void;
};

export const InitialData: FC<InitialDataProps> = memo(
  ({
    totalAmount,
    setTotalAmount,
    assetsAmount,
    setAssetsAmount,
    assetsCurrency,
    setAssetsCurrency,
    assetsPercent,
    setAssetsPercent,
  }) => {
    return (
      <InitialDataContainer>
        <InitialValuesContainer>
          <Input
            isRequired
            value={totalAmount}
            labelText="Total amount"
            additionalInfo="Please enter total amount"
            changeAction={setTotalAmount}
            type="number"
          />
          <Input
            isRequired
            value={assetsAmount}
            labelText="Assets amount"
            additionalInfo="Please enter assets amount"
            changeAction={setAssetsAmount}
            type="number"
          />
          <Input
            isRequired
            value={assetsCurrency}
            labelText="Assets currency"
            additionalInfo="Please enter assets currency"
            changeAction={setAssetsCurrency}
            type="number"
          />
          <Input
            isRequired
            value={assetsPercent}
            labelText="Desirable assets percent"
            additionalInfo="Please enter desirable assets percent"
            changeAction={setAssetsPercent}
            type="number"
          />
        </InitialValuesContainer>
        <PieChart />
      </InitialDataContainer>
    );
  }
);

const InitialDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InitialValuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  min-width: 200px;
`;

const PieChart = styled.div`
  width: 100px;
  height: 100px;
  background-color: wheat;
  margin: 64px;
`;
