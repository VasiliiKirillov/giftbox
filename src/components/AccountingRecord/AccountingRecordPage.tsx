import React, { useEffect } from 'react';
import { AccountingRecordDetails } from './AccountingRecordDetails';
import { fetchAllAccountingRecords } from '../../store/accountingRecord';
import { useAppDispatch } from '../../store/store';

export const AccountingRecordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllAccountingRecords());
  }, []);

  return <AccountingRecordDetails />;
};
