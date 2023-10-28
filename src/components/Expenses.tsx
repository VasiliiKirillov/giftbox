import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { AccountingTable } from './AccountingTable';
import { getExpenses, getExpensesSum } from '../store/expensesState';

export const Expenses = memo(() => {
  const expensesData = useSelector(getExpenses);
  const expensesSum = useSelector(getExpensesSum);

  const putNewRecord = useCallback(
    (amount: string, description: string, pickedStorage: StorageType) => {
      // TODO Implement saving procedure
      console.log('gov expenses', amount, description, pickedStorage);
    },
    []
  );

  return (
    <ExpensesStyled>
      <ExpensesInfoStyled>
        <ExpensesTitleStyled>Expenses</ExpensesTitleStyled>
        <ExpensesSumStyled>{expensesSum}</ExpensesSumStyled>
        <AccountingTable data={expensesData} putNewRecord={putNewRecord} />
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
