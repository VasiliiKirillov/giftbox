import { FC, memo, useState } from 'react';
import styled from 'styled-components';

type AccountingRecord = {
  storage: string;
  amount: number;
  description: string;
};

type AccountingTableProps = {
  data: Array<AccountingRecord>;
};

export const AccountingTable: FC<AccountingTableProps> = memo(({ data }) => {
  const [storageRef, setStorageRef] = useState<HTMLDivElement | null>(null);
  const [amountRef, setAmountRef] = useState<HTMLDivElement | null>(null);
  const [descriptionRef, setDescriptionRef] = useState<HTMLDivElement | null>(
    null
  );
  return (
    <AccountingTableStyled>
      <AddNewButtonStyled>+</AddNewButtonStyled>
      <RecordContainerStyled>
        <TitleStorageStyled ref={(newRef) => setStorageRef(newRef)}>
          Storage
        </TitleStorageStyled>
        <TitleAmountStyled ref={(newRef) => setAmountRef(newRef)}>
          Amount
        </TitleAmountStyled>
        <TitleDescriptionStyled ref={(newRef) => setDescriptionRef(newRef)}>
          Description
        </TitleDescriptionStyled>
      </RecordContainerStyled>
      {data.map((record) => {
        return (
          <RecordContainerStyled>
            <RecordItemStyled width={storageRef?.clientWidth ?? 0}>
              {record.storage}
            </RecordItemStyled>
            <RecordItemStyled width={amountRef?.clientWidth ?? 0}>
              {record.amount}
            </RecordItemStyled>
            <RecordItemStyled width={descriptionRef?.clientWidth ?? 0}>
              {record.description}
            </RecordItemStyled>
          </RecordContainerStyled>
        );
      })}
    </AccountingTableStyled>
  );
});

// styles
const TitleStorageStyled = styled.div`
  padding: 4px;
`;

const TitleAmountStyled = styled.div`
  padding: 4px;
`;

const TitleDescriptionStyled = styled.div`
  padding: 4px;
`;

const RecordItemStyled = styled.div<{ width: number }>`
  padding: 4px;
  box-sizing: border-box;
  width: ${(props) => props.width}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecordContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  border: solid;
  gap: 8px;
`;

const AddNewButtonStyled = styled.div`
  display: flex;
  justify-content: center;
  border: solid;
`;

const AccountingTableStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
