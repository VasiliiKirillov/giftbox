import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../main';
import { API } from '../utils/main';

export const Incomes = memo(() => {
  const incomesData = useFetchIncomesData();

  const incomesSum = incomesData.reduce((acc, curr) => acc + curr.amount, 0);

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

//hooks
const useFetchIncomesData = () => {
  const [incomes, setIncomes] = useState<AccountRecord[]>([]);

  const fetchExpenses = async () => {
    const incomesRef = collection(db, `${API}/incomes`);
    const incomesSnap = await getDocs(incomesRef);
    const expenses: AccountRecord[] = [];
    incomesSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      expenses.push({
        id: doc.id,
        ...(doc.data() as Omit<AccountRecord, 'id'>),
      });
    });
    setIncomes(
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
  return incomes;
};

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
