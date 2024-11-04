import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Input } from '../common/Input/Input';

type CurrencyTitleProps = {
  baseCurrencyName: string;
  setBaseCurrencyName: (a: string) => void;
  assetsCurrencyName: string;
  setAssetsCurrencyName: (a: string) => void;
};

export const CurrencyTitle: FC<CurrencyTitleProps> = memo(
  ({
    baseCurrencyName,
    setBaseCurrencyName,
    assetsCurrencyName,
    setAssetsCurrencyName,
  }) => {
    return (
      <InitialDataContainer>
        <ThresholdBlockContainer>
          <Input
            value={baseCurrencyName}
            labelText="Base currency name"
            additionalInfo="Please enter base currency name"
            changeAction={setBaseCurrencyName}
          />
        </ThresholdBlockContainer>
        <ThresholdBlockContainer>
          <Input
            value={assetsCurrencyName}
            labelText="Assets currency name"
            additionalInfo="Please enter assets currency name"
            changeAction={setAssetsCurrencyName}
          />
        </ThresholdBlockContainer>
        <ThresholdBlockContainer>
          <Input
            value={assetsCurrencyName}
            labelText="Average purchase price"
            additionalInfo="Please enter average purchase price"
            changeAction={setAssetsCurrencyName}
          />
        </ThresholdBlockContainer>
      </InitialDataContainer>
    );
  }
);

const ThresholdBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  min-width: 200px;
`;

const InitialDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
