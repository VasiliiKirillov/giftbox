import { memo } from 'react';
import styled from 'styled-components';
import { Storage } from './Storage';

export const Storages = memo(() => {
  return (
    <StoragesStyled>
      <Storage />
      <Storage />
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
