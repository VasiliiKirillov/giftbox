import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { RecordContainerStyled } from './CommonStyles';
import { RecordInput } from './RecordInput';

type AccountingRecord = {
  storage: string;
  amount: number;
  description: string;
  id: string;
};

type AccountingTableProps = {
  data: Array<AccountingRecord>;
  putNewRecord: (
    amount: string,
    description: string,
    pickedStorage: StorageType
  ) => void;
};

const MAX_ROWS_AMOUNT = 8;

export const AccountingTable: FC<AccountingTableProps> = memo(
  ({ data, putNewRecord }) => {
    const [storageRef, setStorageRef] = useState<HTMLDivElement | null>(null);
    const [amountRef, setAmountRef] = useState<HTMLDivElement | null>(null);
    const [descriptionRef, setDescriptionRef] = useState<HTMLDivElement | null>(
      null
    );

    const emptyRows = useMemo(() => {
      if (data.length < MAX_ROWS_AMOUNT) {
        return new Array(MAX_ROWS_AMOUNT - data.length)
          .fill(0)
          .map((el, index) => <RecordContainerStyled key={index} />);
      }
    }, [data]);

    const [isNewItemAddition, setIsNewItemAddition] = useState(false);

    const closeRecordInput = useCallback(() => {
      setIsNewItemAddition(false);
    }, []);

    return (
      <AccountingTableStyled>
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
        {isNewItemAddition ? (
          <RecordInput
            putNewRecord={putNewRecord}
            storageWidth={storageRef?.clientWidth ?? 0}
            amountWidth={amountRef?.clientWidth ?? 0}
            descriptionWidth={descriptionRef?.clientWidth ?? 0}
            closeAction={closeRecordInput}
          />
        ) : (
          <AddNewButtonStyled onClick={() => setIsNewItemAddition(true)}>
            +
          </AddNewButtonStyled>
        )}
        {data.map((record) => {
          return (
            <RecordContainerStyled key={record.id}>
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
        {emptyRows}
      </AccountingTableStyled>
    );
  }
);

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

const AddNewButtonStyled = styled.div`
  display: flex;
  justify-content: center;
  border: solid;
  height: 32px;
  align-items: center;
  cursor: pointer;
`;

const AccountingTableStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
