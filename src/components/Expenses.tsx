import React, { memo } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';

export const Expenses = memo(() => {
  return (
    <ExpensesStyled>
      <ExpensesInfoStyled>
        <ExpensesTitleStyled>Expenses</ExpensesTitleStyled>
        <ExpensesSumStyled>123</ExpensesSumStyled>
        <AccountingTable data={expensesData} />
      </ExpensesInfoStyled>
    </ExpensesStyled>
  );
});

// styles
const ExpensesSumStyled = styled.div``;

const ExpensesTitleStyled = styled.div``;

const ExpensesInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const ExpensesStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const expensesData = [
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
    description: 'test test test test',
  },
  {
    storage: 'Bogg',
    amount: 123,
    description: 'test test',
  },
];
