import { FC, memo } from 'react';
import styled from 'styled-components';

type StorageProps = {
  name: string;
  currency: string;
  amount: number;
};

export const Storage: FC<StorageProps> = memo(({ name, currency, amount }) => {
  return (
    <StorageStyled>
      <CurrencyStyled>{currency}</CurrencyStyled>
      <StorageDataStyled>
        <StorageNameStyled>{name}</StorageNameStyled>
        <StorageAmountStyled>{amount}</StorageAmountStyled>
      </StorageDataStyled>
    </StorageStyled>
  );
});

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
