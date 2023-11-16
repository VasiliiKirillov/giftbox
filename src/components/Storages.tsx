import React, { memo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Storage } from './Storage';
import { getStorages } from '../store/storagesState';
import { AddNewStorageButton } from './AddNewStorageButton';

export const Storages = memo(() => {
  const storages = useSelector(getStorages);

  return (
    <StoragesStyled>
      <AddNewStorageButton />
      <StoragesContainerStyled>
        {storages.map((storage) => (
          <Storage
            key={storage.id}
            name={storage.name}
            currency={storage.currency}
            amount={storage.startTotal}
          />
        ))}
      </StoragesContainerStyled>
    </StoragesStyled>
  );
});

// styles
const StoragesStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StoragesContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
`;
