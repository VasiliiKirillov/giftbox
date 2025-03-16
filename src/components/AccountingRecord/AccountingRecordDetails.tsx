import { memo, useMemo } from 'react';
import { List } from '../common/NewList';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  getAccountingRecordsByType,
  getAccountingRecordsWithStorageNames,
} from '../../store/accountingRecord';

export const AccountingRecordDetails = memo(() => {
  const records = useSelector(getAccountingRecordsWithStorageNames);
  const recordsByType = useSelector(getAccountingRecordsByType);

  const headerData = useMemo(
    () => ({
      description: 'Description',
      amount: 'Amount',
      type: 'Type',
      storageName: 'Storage',
      transactionPeriod: 'Transaction Period',
    }),
    []
  );

  const formattedRecords = useMemo(() => {
    return records.map((record) => ({
      ...record,
      id: String(record.id),
      amount: `${record.amount.toLocaleString()} ${record.currency}`,
      transactionPeriod: new Date(record.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    }));
  }, [records]);

  const expenseRecords = recordsByType['expense'] || [];
  const incomeRecords = recordsByType['income'] || [];

  return (
    <RecordDetailsContainer>
      <RecordInfo>
        <InfoItem>Total Records: {records.length}</InfoItem>
        <InfoItem>Expenses: {expenseRecords.length}</InfoItem>
        <InfoItem>Income: {incomeRecords.length}</InfoItem>
      </RecordInfo>
      <InfoItem>Accounting Records</InfoItem>
      <ListStyled>
        <List data={formattedRecords} headerData={headerData} />
      </ListStyled>
    </RecordDetailsContainer>
  );
});

// Styled components
const RecordDetailsContainer = styled.div`
  margin-top: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  min-width: 550px;
`;

const ListStyled = styled.div`
  height: 470px;
`;

const RecordInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: 36px;
`;

const InfoItem = styled.div`
  font-size: 24px;
  flex: 1;
  padding: 0 8px;
  font-family: 'Readex Pro', sans-serif;
  color: #1b1b1b;
`;
