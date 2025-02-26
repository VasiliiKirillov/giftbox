import React from 'react';
import styled from 'styled-components';

import { Calculator } from '../components/Calculator/Calculator';
import { SpreadsheetDataElement } from '../components/Spreadsheet/SpreadsheetDataElement';
import { LimitOrderDetailsPage } from '../components/LimitOrderDetails/LimitOrderDetailsPage';
const isShowSpreadsheetPart = localStorage.getItem('isShowSpreadsheetPart');

export const App = () => {
  return (
    <AppContainerStyled>
      <ContentContainer>
        <Calculator />
        <RightColumnContainer>
          {isShowSpreadsheetPart && <SpreadsheetDataElement />}
          <LimitOrderDetailsPage />
        </RightColumnContainer>
      </ContentContainer>
    </AppContainerStyled>
  );
};

const ContentContainer = styled.div`
  padding: 16px 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
`;
const RightColumnContainer = styled.div`
  gap: 32px;
  display: flex;
  flex-direction: column;
`;
// styles
const AppContainerStyled = styled.div`
  width: 100vw;
  height: 100vh;
`;
