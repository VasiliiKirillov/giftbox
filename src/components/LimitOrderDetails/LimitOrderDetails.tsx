import React, { memo, useMemo } from 'react';
import { List } from '../common/NewList';
import styled from 'styled-components';

type LimitOrderData = {
  id: string;
  currencyName: string;
  desirableAssetsPercent: string;
  currencyPrice: string;
  assetsQuantity: string;
  orderValue: string;
  orderType: 'BUY' | 'SELL';
};

// Mock data
const mockLimitOrders: LimitOrderData[] = [
  {
    id: '1',
    currencyName: 'BTC',
    desirableAssetsPercent: '25%',
    currencyPrice: '$45,000',
    assetsQuantity: '0.5',
    orderValue: '$22,500',
    orderType: 'BUY',
  },
  {
    id: '2',
    currencyName: 'ETH',
    desirableAssetsPercent: '15%',
    currencyPrice: '$2,500',
    assetsQuantity: '4.0',
    orderValue: '$10,000',
    orderType: 'SELL',
  },
  {
    id: '3',
    currencyName: 'SOL',
    desirableAssetsPercent: '10%',
    currencyPrice: '$120',
    assetsQuantity: '50',
    orderValue: '$6,000',
    orderType: 'BUY',
  },
];

export const LimitOrderDetails = memo(() => {
  const headerData = useMemo(
    () => ({
      id: 'ID',
      currencyName: 'Currency',
      desirableAssetsPercent: 'Target %',
      currencyPrice: 'Price',
      assetsQuantity: 'Quantity',
      orderValue: 'Value',
      orderType: 'Type',
    }),
    []
  );

  return (
    <OrderDetailsContainer>
      <OrderInfo>
        <InfoItem>Total Orders: {mockLimitOrders.length}</InfoItem>
        <InfoItem>
          Buy Orders:{' '}
          {mockLimitOrders.filter((order) => order.orderType === 'BUY').length}
        </InfoItem>
        <InfoItem>
          Sell Orders:{' '}
          {mockLimitOrders.filter((order) => order.orderType === 'SELL').length}
        </InfoItem>
      </OrderInfo>
      <InfoItem>Limit Orders</InfoItem>
      <ListStyled>
        <List data={mockLimitOrders} headerData={headerData} />
      </ListStyled>
    </OrderDetailsContainer>
  );
});

// Styled components
const OrderDetailsContainer = styled.div`
  margin-top: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  min-width: 550px;
`;

const ListStyled = styled.div`
  height: 470px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: 36px;
`;

const InfoItem = styled.div`
  font-size: 24px;
  flex: 1;
  padding: 0 8px;
  font-family: 'Readex Pro', sans-serif;
  color: #1b1b1b;
`;
