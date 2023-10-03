import { FC, memo, MutableRefObject, useRef } from 'react';
import styled from 'styled-components';

import { RecordContainerStyled } from './CommonStyles';
import { useOnClickOutside } from '../utils/hooks';

type RecordInputProps = {
  storageWidth: number;
  amountWidth: number;
  descriptionWidth: number;
  closeAction: () => void;
};

export const RecordInput: FC<RecordInputProps> = memo(
  ({ storageWidth, amountWidth, descriptionWidth, closeAction }) => {
    const containerRef = useRef() as MutableRefObject<HTMLDivElement>;

    useOnClickOutside(containerRef, closeAction);

    return (
      <RecordContainerStyled ref={containerRef}>
        <RecordInputStyled width={storageWidth} />
        <RecordInputStyled width={amountWidth} />
        <RecordInputStyled width={descriptionWidth} />
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
