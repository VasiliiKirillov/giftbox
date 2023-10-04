import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../main';
import { API } from '../utils/main';

export const Expenses = memo(() => {
  const expensesData = useFetchExpensesData();

  const expensesSum = expensesData.reduce((acc, curr) => acc + curr.amount, 0);

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

//hooks
const useFetchExpensesData = () => {
  const [expenses, setExpenses] = useState<AccountRecord[]>([]);

  const fetchExpenses = async () => {
    const expensesRef = collection(db, `${API}/expenses`);
    const expensesSnap = await getDocs(expensesRef);
    const expenses: AccountRecord[] = [];
    expensesSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      expenses.push({
        id: doc.id,
        ...(doc.data() as Omit<AccountRecord, 'id'>),
      });
    });
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
