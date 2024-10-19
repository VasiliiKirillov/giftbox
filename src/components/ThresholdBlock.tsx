import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Input } from './common/Input/Input';

export const ThresholdBlock: FC<{
  thresholdName: string;
  thresholdValue: string;
  setThresholdValue: (text: string) => void;
  desiredCurrency: string;
  orderPrice: string;
  orderAmount: string;
  baseCurrencyName: string;
  assetsCurrencyName: string;
  multiplier: string;
}> = memo(
  ({
    thresholdName,
    thresholdValue,
    setThresholdValue,
    desiredCurrency,
    orderPrice,
    orderAmount,
    baseCurrencyName,
    assetsCurrencyName,
    multiplier,
  }) => {
    const isBuy = thresholdName === 'Below';
    return (
      <ThresholdBlockContainer>
        <Input
          isRequired
          value={thresholdValue}
          labelText={thresholdName + ' threshold (%)'}
          additionalInfo="Please enter threshold percent"
          changeAction={setThresholdValue}
          type="number"
        />
        <ThresholdTitle isBuy={isBuy}>{isBuy ? 'BUY' : 'SELL'}</ThresholdTitle>
        <Input
          disabled
          value={orderPrice}
          labelText={`Order price (${baseCurrencyName})`}
        />
        <Input
          disabled
          value={desiredCurrency}
          labelText={`Order Quantity (${assetsCurrencyName})`}
        />
        <Input
          disabled
          value={orderAmount}
          labelText={`Order value (${baseCurrencyName})`}
        />
        <Input disabled value={multiplier} labelText={'Multiplier'} />
      </ThresholdBlockContainer>
    );
  }
);

const ThresholdTitle = styled.div<{
  isBuy: boolean;
}>`
  font-size: 24px;
  font-family: 'Readex Pro', sans-serif;
  color: ${(props) => (props.isBuy ? '#008000' : '#ff0000')};
`;

const ThresholdBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  min-width: 200px;
`;
