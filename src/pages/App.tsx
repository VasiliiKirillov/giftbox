import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

export const App = () => {
  return (
    <AppContainerStyled>
      <Outlet />
    </AppContainerStyled>
  );
};

// styles
const AppContainerStyled = styled.div`
  width: 100vw;
  height: 100vh;
`;
