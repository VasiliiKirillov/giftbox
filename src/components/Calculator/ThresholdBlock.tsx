import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Input } from '../common/Input/Input';
import { postLimitOrder } from '../../store/limitOrders';
import { useAppDispatch } from '../../store/store';

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
    const dispatch = useAppDispatch();

    const handleSaveOrder = () => {
      console.log('handleSaveOrder');
      dispatch(postLimitOrder(isBuy ? 'BUY' : 'SELL'));
    };

    return (
      <ThresholdBlockContainer>
        <ThresholdContainer>
          <HeaderWrapper>
            <ThresholdTitle isBuy={isBuy}>
              {isBuy ? 'BUY' : 'SELL'}
            </ThresholdTitle>
            <SaveButton onClick={handleSaveOrder}>{'Save Order'}</SaveButton>
          </HeaderWrapper>
          <Input
            disabled
            value={desiredCurrency}
            labelText={`Currency price (${baseCurrencyName})`}
          />
        </ThresholdContainer>
        <ThresholdContainer>
          <Input
            isRequired
            value={thresholdValue}
            labelText={thresholdName + ' threshold (%)'}
            changeAction={setThresholdValue}
            type="number"
          />
          <Input
            disabled
            value={orderAmount}
            labelText={`Asset Quantity (${assetsCurrencyName})`}
          />
        </ThresholdContainer>
        <ThresholdContainer>
          <Input disabled value={multiplier} labelText={'Multiplier (%)'} />
          <Input
            disabled
            value={orderPrice}
            labelText={`Order value (${baseCurrencyName})`}
          />
        </ThresholdContainer>
      </ThresholdBlockContainer>
    );
  }
);

const ThresholdTitle = styled.div<{
  isBuy: boolean;
}>`
  font-size: 24px;
  font-family: 'Readex Pro', sans-serif;
  color: ${(props) => (props.isBuy ? '#37ea5b' : '#ff5656')};
  height: 84px;
  display: flex;
  align-items: center;
`;

const ThresholdContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  width: 200px;
`;

const ThresholdBlockContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SaveButton = styled.button`
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
