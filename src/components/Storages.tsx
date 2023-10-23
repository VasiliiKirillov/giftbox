import { memo } from 'react';
import styled from 'styled-components';
import { Storage } from './Storage';
import { getStorages } from '../store/storagesState';
import { useSelector } from 'react-redux';

export const Storages = memo(() => {
  const storages = useSelector(getStorages);

  return (
    <StoragesStyled>
      {storages.map((storage) => (
        <Storage
          key={storage.id}
          name={storage.shortName}
          currency={storage.currency}
          amount={storage.startTotal}
        />
      ))}
    </StoragesStyled>
  );
});

// styles
const StoragesStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
`;
