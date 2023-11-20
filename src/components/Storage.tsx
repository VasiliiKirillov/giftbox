import { FC, memo, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  getExpensesSumByStorageId,
  getIsExpensesLoading,
} from '../store/expensesState';
import {
  getIncomesSumByStorageId,
  getIsIncomesLoading,
} from '../store/incomesState';

type StorageProps = {
  id: string;
  name: string;
  currency: string;
  startTotal: number;
};

export const Storage: FC<StorageProps> = memo(
  ({ id, name, currency, startTotal }) => {
    const expensesSumByStorageId = useSelector(getExpensesSumByStorageId);
    const incomesSumByStorageId = useSelector(getIncomesSumByStorageId);
    const isExpensesLoading = useSelector(getIsExpensesLoading);
    const isIncomesLoading = useSelector(getIsIncomesLoading);

    const isTotalLoading = isExpensesLoading || isIncomesLoading;

    const total = useMemo(() => {
      const expensesSum = expensesSumByStorageId[id] ?? 0;
      const incomesSum = incomesSumByStorageId[id] ?? 0;
      return startTotal - expensesSum + incomesSum;
    }, [startTotal, expensesSumByStorageId, incomesSumByStorageId]);

    return (
      <StorageStyled>
        <CurrencyStyled>{currency}</CurrencyStyled>
        <StorageDataStyled>
          <StorageNameStyled>{name}</StorageNameStyled>
          <StorageAmountStyled>
            {isTotalLoading ? 'Loading...' : total}
          </StorageAmountStyled>
        </StorageDataStyled>
      </StorageStyled>
    );
  }
);

// styles
const StorageStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: solid;
  max-width: 256px;
  min-height: 128px;
  box-sizing: border-box;
  padding: 8px;
  justify-content: space-between;
  flex-grow: 1;
  width: 240px;
`;

const StorageDataStyled = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  justify-content: space-between;
`;

const CurrencyStyled = styled.div`
  font-size: 12px;
`;

const StorageNameStyled = styled.div`
  font-weight: 500;
`;

const StorageAmountStyled = styled.div`
  font-weight: 500;
`;
