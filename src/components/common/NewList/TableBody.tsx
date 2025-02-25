import React from 'react';

import { CommonTableBodyStyled } from './styles';
import { RowData, TableBodyProps } from './types';

import { DraggableTableBody } from './DraggableTableBody';

type TableBodyComponent = <T extends RowData>(
  props: TableBodyProps<T>
) => JSX.Element | null;
export const TableBody: TableBodyComponent = ({
  children,
  isDraggable,
  isDragAndDropActive,
  items,
  setItems,
  handleDragStart,
  handleDragEnd,
}) => {
  return !isDraggable ? (
    <CommonTableBodyStyled>{children()}</CommonTableBodyStyled>
  ) : (
    <DraggableTableBody
      isDragAndDropActive={isDragAndDropActive}
      items={items}
      setItems={setItems}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
    >
      {(props) => children(props)}
    </DraggableTableBody>
  );
};
