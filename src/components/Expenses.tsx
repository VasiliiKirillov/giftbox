import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { AccountingTable } from './AccountingTable';
import { getExpenses, getExpensesSum } from '../store/expensesState';
import { saveAccountRecord } from '../store/common';
import { AppDispatch } from '../store/store';

export const Expenses = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const expensesData = useSelector(getExpenses);
  const expensesSum = useSelector(getExpensesSum);

  const putNewExpense = useCallback(
    (amount: number, description: string, pickedStorage: StorageType) => {
      dispatch(
        saveAccountRecord({
          accountType: 'expenses',
          amount,
          description,
          storage: pickedStorage.id,
        })
      );
    },
    []
  );

  return (
    <ExpensesStyled>
      <ExpensesInfoStyled>
        <ExpensesTitleStyled>Expenses</ExpensesTitleStyled>
        <ExpensesSumStyled>{expensesSum}</ExpensesSumStyled>
        <AccountingTable data={expensesData} putNewRecord={putNewExpense} />
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
