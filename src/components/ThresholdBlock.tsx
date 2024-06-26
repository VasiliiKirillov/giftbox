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
}> = memo(
  ({
    thresholdName,
    thresholdValue,
    setThresholdValue,
    desiredCurrency,
    orderPrice,
    orderAmount,
  }) => {
    return (
      <ThresholdBlockContainer>
        <Input
          isRequired={true}
          value={thresholdValue}
          labelText={thresholdName + ' threshold'}
          additionalInfo="Please enter threshold percent"
          changeAction={setThresholdValue}
        />
        <Input disabled value={desiredCurrency} labelText="Desired currency" />
        <Input disabled value={orderPrice} labelText="Order price" />
        <Input disabled value={orderAmount} labelText="Order amount" />
      </ThresholdBlockContainer>
    );
  }
);

const ThresholdBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
