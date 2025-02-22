import React from 'react';
import styled from 'styled-components';

import { CalculatorPage } from './Calculator.page';
import { SpreadsheetDataElement } from '../components/SpreadsheetDataElement';

const isShowSpreadsheetPart = localStorage.getItem('isShowSpreadsheetPart');

export const App = () => {
  return (
    <AppContainerStyled>
      <ContentContainer>
        <CalculatorPage />
        {isShowSpreadsheetPart && <SpreadsheetDataElement />}
      </ContentContainer>
    </AppContainerStyled>
  );
};

const ContentContainer = styled.div`
  padding: 32px 16px;
  display: flex;
  flex-direction: row;
`;
// styles
const AppContainerStyled = styled.div`
  width: 100vw;
  height: 100vh;
`;
