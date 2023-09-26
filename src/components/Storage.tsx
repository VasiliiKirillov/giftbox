import { memo } from 'react';
import styled from 'styled-components';

export const Storage = memo(() => {
  return (
    <StorageStyled>
      <CurrencyStyled>USD</CurrencyStyled>
      <StorageDataStyled>
        <StorageNameStyled>Bog</StorageNameStyled>
        <StorageAmountStyled>1234</StorageAmountStyled>
      </StorageDataStyled>
    </StorageStyled>
  );
});

// styles
const StorageStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: solid;
  width: 256px;
  min-height: 128px;
  box-sizing: border-box;
  padding: 8px;
  justify-content: space-between;
  flex-grow: 1;
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
