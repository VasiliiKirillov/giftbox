import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { AccountingTable } from './AccountingTable';
import { useDispatch, useSelector } from 'react-redux';
import { getIncomes, getIncomesSum } from '../store/incomesState';
import { saveAccountRecord } from '../store/common';
import { AppDispatch } from '../store/store';

export const Incomes = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const incomesData = useSelector(getIncomes);
  const incomesSum = useSelector(getIncomesSum);

  const putNewIncome = useCallback(
    (amount: number, description: string, pickedStorage: StorageType) => {
      dispatch(
        saveAccountRecord({
          accountType: 'incomes',
          amount,
          description,
          storageId: pickedStorage.id,
          currency: pickedStorage.currency,
        })
      );
    },
    []
  );

  return (
    <IncomesStyled>
      <IncomesInfoStyled>
        <IncomesTitleStyled>Incomes</IncomesTitleStyled>
        <IncomesSumStyled>{incomesSum}</IncomesSumStyled>
        <AccountingTable data={incomesData} putNewRecord={putNewIncome} />
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
