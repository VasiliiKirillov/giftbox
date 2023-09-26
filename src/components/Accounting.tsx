import { memo } from 'react';
import styled from 'styled-components';

export const Accounting = memo(() => {
  return (
    <AccountingStyled>
      <div>Expenses</div>
      <div>Profit</div>
      <div>Incomes</div>
    </AccountingStyled>
  );
});

//styles
const AccountingStyled = styled.div`
  display: flex;
  flex-direction: row;
`;
