import { memo } from 'react';
import styled from 'styled-components';

export const Profit = memo(() => {
  return (
    <ProfitStyled>
      <ProfitTitleStyled>Profit</ProfitTitleStyled>
      <ProfitSumStyled>456</ProfitSumStyled>
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
