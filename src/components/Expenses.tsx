import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../main';
import { getMonth, getYear } from '../utils/main';

type Expense = {
  id: string;
  storage: string;
  amount: number;
  description: string;
  dateAdded: { seconds: number };
};

// type ExpensesType = Record<string, Expense>;

export const Expenses = memo(() => {
  const expensesData = useFetchExpensesData();

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

//hooks
const useFetchExpensesData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    const expensesRef = collection(
      db,
      `months/${getMonth()}-${getYear() + 1}/expenses`
    );
    const expensesSnap = await getDocs(expensesRef);
    const expenses: Expense[] = [];
    expensesSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      expenses.push({ id: doc.id, ...(doc.data() as Omit<Expense, 'id'>) });
    });
    console.log('gov expenses', expenses);
    setExpenses(
      expenses.sort((a, b) => {
        if (a.dateAdded.seconds < b.dateAdded.seconds) {
          return -1;
        }
        if (a.dateAdded.seconds > b.dateAdded.seconds) {
          return 1;
        }
        return 0;
      })
    );
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  return expenses;
};

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
