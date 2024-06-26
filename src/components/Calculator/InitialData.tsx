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
        <InitialValuesConatiner>
          <Input
            isRequired={true}
            value={totalAmount}
            labelText="Total amount"
            additionalInfo="Please enter total amount"
            changeAction={setTotalAmount}
          />
          <Input
            isRequired={true}
            value={assetsAmount}
            labelText="Assets amount"
            additionalInfo="Please enter assets amount"
            changeAction={setAssetsAmount}
          />
          <Input
            isRequired={true}
            value={assetsCurrency}
            labelText="Assets currency"
            additionalInfo="Please enter assets currency"
            changeAction={setAssetsCurrency}
          />
          <Input
            isRequired={true}
            value={assetsPercent}
            labelText="Desirable assets percent"
            additionalInfo="Please enter desirable assets percent"
            changeAction={setAssetsPercent}
          />
        </InitialValuesConatiner>
        <PieChart />
      </InitialDataContainer>
    );
  }
);

const InitialDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InitialValuesConatiner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const PieChart = styled.div`
  width: 100px;
  height: 100px;
  background-color: wheat;
`;
