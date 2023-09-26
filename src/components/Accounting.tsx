import { memo } from 'react';
import styled from 'styled-components';
import { Expenses } from './Expenses';
import { Incomes } from './Incomes';
import { Profit } from './Profit';

export const Accounting = memo(() => {
  return (
    <AccountingStyled>
      <Expenses />
      <Profit />
      <Incomes />
    </AccountingStyled>
  );
});

//styles
const AccountingStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 32px;
`;
