import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { SpreadsheetDataElement } from '../components/Spreadsheet/SpreadsheetDataElement';
import { AccountingRecordPage } from '../components/AccountingRecord/AccountingRecordPage';

const isShowSpreadsheetPart = localStorage.getItem('isShowSpreadsheetPart');

export const MainPage = () => {
  return (
    <ContentContainer>
      <LeftColumnContainer>
        <Outlet />
      </LeftColumnContainer>
      <RightColumnContainer>
        {isShowSpreadsheetPart && <SpreadsheetDataElement />}
        <AccountingRecordPage />
      </RightColumnContainer>
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  padding: 16px 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const LeftColumnContainer = styled.div`
  min-width: 648px;
`;

const RightColumnContainer = styled.div`
  gap: 32px;
  display: flex;
  flex-direction: column;
`;
