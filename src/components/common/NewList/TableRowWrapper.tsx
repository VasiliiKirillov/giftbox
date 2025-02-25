import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TableRowWrapperProps } from './types';

export const TableRowWrapper: React.FC<TableRowWrapperProps> = ({
  children,
  index,
  rowId,
  isDragAndDropActive,
  isDraggable,
}) => {
  return !isDraggable ? (
    children()
  ) : (
    <Draggable
      key={rowId}
      draggableId={rowId}
      index={index}
      isDragDisabled={!isDragAndDropActive}
    >
      {(provided, { isDragging }) => children({ provided, isDragging })}
    </Draggable>
  );
};
