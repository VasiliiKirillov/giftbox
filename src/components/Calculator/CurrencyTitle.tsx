import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Input } from '../common/Input/Input';
import { SwitchComponent } from '../common/SwitchComponent/SwitchComponent';

type CurrencyTitleProps = {
  baseCurrencyName: string;
  setBaseCurrencyName: (a: string) => void;
  assetsCurrencyName: string;
  setAssetsCurrencyName: (a: string) => void;
  averagePurchasePrice: string;
  setAveragePurchasePrice: (a: string) => void;
  isUseAveragePurchasePrice: boolean;
  setIsUseAveragePurchasePrice: (a: boolean) => void;
};

export const CurrencyTitle: FC<CurrencyTitleProps> = memo(
  ({
    baseCurrencyName,
    setBaseCurrencyName,
    assetsCurrencyName,
    setAssetsCurrencyName,
    averagePurchasePrice,
    setAveragePurchasePrice,
    isUseAveragePurchasePrice,
    setIsUseAveragePurchasePrice,
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
          <AveragePriceContainer>
            <Input
              value={averagePurchasePrice}
              labelText="Average purchase price"
              additionalInfo="Please enter average purchase price"
              changeAction={setAveragePurchasePrice}
            />
            <SwitchContainer>
              <SwitchComponent
                isSelected={isUseAveragePurchasePrice}
                setSelectedStatus={setIsUseAveragePurchasePrice}
              />
            </SwitchContainer>
          </AveragePriceContainer>
        </ThresholdBlockContainer>
      </InitialDataContainer>
    );
  }
);

const SwitchContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const AveragePriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

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
