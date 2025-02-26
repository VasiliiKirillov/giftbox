import React, { memo, useMemo } from 'react';
import { List } from '../common/NewList';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { getLimitOrdersByCurrency } from '../../store/limitOrders';

export const LimitOrderDetails = memo(() => {
  const orders = useSelector(getLimitOrdersByCurrency);

  const headerData = useMemo(
    () => ({
      currencyName: 'Currency',
      desirableAssetsPercent: 'Target %',
      currencyPrice: 'Price',
      assetsQuantity: 'Quantity',
      orderValue: 'Value',
      orderType: 'Type',
      status: 'Status',
      createdAt: 'Created',
    }),
    []
  );

  const formattedOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      id: String(order.id),
      desirableAssetsPercent: `${order.desirableAssetsPercent}%`,
      currencyPrice: `$${order.currencyPrice.toLocaleString()}`,
      orderValue: `$${order.orderValue.toLocaleString()}`,
      createdAt: new Date(order.createdAt).toLocaleDateString(),
    }));
  }, [orders]);

  const buyOrders = useMemo(
    () => orders.filter((order) => order.orderType === 'BUY'),
    [orders]
  );

  const sellOrders = useMemo(
    () => orders.filter((order) => order.orderType === 'SELL'),
    [orders]
  );

  return (
    <OrderDetailsContainer>
      <OrderInfo>
        <InfoItem>Total Orders: {orders.length}</InfoItem>
        <InfoItem>Buy Orders: {buyOrders.length}</InfoItem>
        <InfoItem>Sell Orders: {sellOrders.length}</InfoItem>
      </OrderInfo>
      <InfoItem>Limit Orders</InfoItem>
      <ListStyled>
        <List data={formattedOrders} headerData={headerData} />
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
