import { memo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { getProfitAmount } from '../store/commonSelectors';

export const Profit = memo(() => {
  const profitAmount = useSelector(getProfitAmount);
  return (
    <ProfitStyled>
      <ProfitTitleStyled>Profit</ProfitTitleStyled>
      <ProfitSumStyled>{profitAmount}</ProfitSumStyled>
    </ProfitStyled>
  );
});

// styles
const ProfitSumStyled = styled.div``;

const ProfitTitleStyled = styled.div``;

const ProfitStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
`;
