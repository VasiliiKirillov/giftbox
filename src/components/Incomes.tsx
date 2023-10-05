import React, { memo } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { useSelector } from 'react-redux';
import { getIncomes, getIncomesSum } from '../store/incomesState';

export const Incomes = memo(() => {
  const incomesData = useSelector(getIncomes);
  const incomesSum = useSelector(getIncomesSum);

  return (
    <IncomesStyled>
      <IncomesInfoStyled>
        <IncomesTitleStyled>Incomes</IncomesTitleStyled>
        <IncomesSumStyled>{incomesSum}</IncomesSumStyled>
        <AccountingTable data={incomesData} />
      </IncomesInfoStyled>
    </IncomesStyled>
  );
});

// styles
const IncomesSumStyled = styled.div``;

const IncomesTitleStyled = styled.div``;

const IncomesInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const IncomesStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
