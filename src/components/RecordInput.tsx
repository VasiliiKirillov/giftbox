import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { RecordContainerStyled } from './CommonStyles';
import { useOnClickOutside } from '../utils/hooks';
import { RecordDropdown } from './RecordDropdown';
import { useSelector } from 'react-redux';
import { getStorages } from '../store/storagesState';

type RecordInputProps = {
  storageWidth: number;
  amountWidth: number;
  descriptionWidth: number;
  closeAction: () => void;
  putNewRecord: (
    amount: number,
    description: string,
    pickedStorage: StorageType
  ) => void;
};

export const RecordInput: FC<RecordInputProps> = memo(
  ({
    storageWidth,
    amountWidth,
    descriptionWidth,
    closeAction,
    putNewRecord,
  }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const storages = useSelector(getStorages);

    const containerRef = useRef() as MutableRefObject<HTMLDivElement>;

    const [pickedStorage, setPickedStorage] = useState<StorageType | null>(
      null
    );

    const handleCloseRecordRow = useCallback(() => {
      if (amount && description && pickedStorage) {
        putNewRecord(Number(amount), description, pickedStorage);
      }
      closeAction();
    }, [putNewRecord, closeAction, amount, description, pickedStorage]);

    useOnClickOutside(containerRef, handleCloseRecordRow);

    return (
      <RecordContainerStyled ref={containerRef}>
        <RecordCommonStyled width={storageWidth}>
          <RecordDropdown
            setPickedElement={setPickedStorage}
            pickedElement={pickedStorage}
            placeholderValue={'Pick Storage'}
            listData={storages}
          />
        </RecordCommonStyled>
        <RecordInputStyled
          onChange={(e) => setAmount(e.currentTarget.value)}
          placeholder="type amount"
          value={amount}
          width={amountWidth}
        />
        <RecordInputStyled
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="type description"
          value={description}
          width={descriptionWidth}
        />
      </RecordContainerStyled>
    );
  }
);

// styles
const RecordInputStyled = styled.input<{ width: number }>`
  padding: 4px;
  box-sizing: border-box;
  width: ${(props) => props.width}px;
`;

const RecordCommonStyled = styled.div<{ width: number }>`
  padding: 4px;
  box-sizing: border-box;
  width: ${(props) => props.width}px;
`;
