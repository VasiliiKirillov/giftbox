import React, { memo } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';

export const Incomes = memo(() => {
  return (
    <IncomesStyled>
      <IncomesInfoStyled>
        <IncomesTitleStyled>Incomes</IncomesTitleStyled>
        <IncomesSumStyled>123</IncomesSumStyled>
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

const incomesData = [
  {
    storage: 'Bog',
    amount: 123,
    description: 'test',
  },
  {
    storage: 'Aaaa',
    amount: 1237,
    description: 'testtest',
  },
  {
    storage: 'Bb',
    amount: 123.54,
    description: 'test test',
  },
  {
    storage: 'Bogg',
    amount: 123,
    description: 'test test',
  },
];
