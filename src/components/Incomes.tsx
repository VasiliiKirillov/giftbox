import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { useSelector } from 'react-redux';
import { getIncomes, getIncomesSum } from '../store/incomesState';

export const Incomes = memo(() => {
  const incomesData = useSelector(getIncomes);
  const incomesSum = useSelector(getIncomesSum);

  const putNewRecord = useCallback(
    (amount: string, description: string, pickedStorage: StorageType) => {
      // TODO Implement saving procedure
      console.log('gov incomes', amount, description, pickedStorage);
    },
    []
  );

  return (
    <IncomesStyled>
      <IncomesInfoStyled>
        <IncomesTitleStyled>Incomes</IncomesTitleStyled>
        <IncomesSumStyled>{incomesSum}</IncomesSumStyled>
        <AccountingTable data={incomesData} putNewRecord={putNewRecord} />
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
