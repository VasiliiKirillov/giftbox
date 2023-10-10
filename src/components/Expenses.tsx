import React, { memo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { AccountingTable } from './AccountingTable';
import { getExpenses, getExpensesSum } from '../store/expensesState';

export const Expenses = memo(() => {
  const expensesData = useSelector(getExpenses);
  const expensesSum = useSelector(getExpensesSum);

  return (
    <ExpensesStyled>
      <ExpensesInfoStyled>
        <ExpensesTitleStyled>Expenses</ExpensesTitleStyled>
        <ExpensesSumStyled>{expensesSum}</ExpensesSumStyled>
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
