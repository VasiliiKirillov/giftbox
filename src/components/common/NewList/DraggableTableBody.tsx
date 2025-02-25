import React, { useCallback, useContext } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { DraggableTableBodyStyled } from './styles';
import { RowData, DraggableTableBodyProps, ColumnWidthType } from './types';

import { ColumnWidthContext, HeaderRefContext } from './ContextTableHelpers';

const columnWidth: ColumnWidthType = {};

function reorder<T = unknown>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

type DraggableTableBodyComponent = <T extends RowData>(
  props: DraggableTableBodyProps<T>
) => JSX.Element | null;

export const DraggableTableBody: DraggableTableBodyComponent = ({
  children,
  isDragAndDropActive,
  items,
  setItems,
  handleDragStart,
  handleDragEnd,
}) => {
  const { setColumnWidth } = useContext(ColumnWidthContext);
  const tableHeaderRowRef = useContext(HeaderRefContext);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      );

      setItems(newItems);

      const isElementPlacedOnSamePosition =
        result.source.index === result.destination.index;

      const nextElementIndex = result.destination.index + 1;
      const prevElementIndex = result.destination.index - 1;

      const isElementMovedAtLastPosition = items.length === nextElementIndex;

      const shiftedElement =
        newItems[
          isElementMovedAtLastPosition ? prevElementIndex : nextElementIndex
        ];

      const draggedElementId = newItems[result.destination.index].id;

      handleDragEnd?.(
        isElementPlacedOnSamePosition,
        draggedElementId,
        shiftedElement,
        () => {
          setItems(items);
          return items;
        },
        newItems
      );
    },
    [items]
  );

  // Capture width of each column for prettify dragged row
  const onBeforeDragStart = useCallback(() => {
    handleDragStart?.();
    if (!tableHeaderRowRef?.current) return;

    const tableHeaderRow = Array.from(tableHeaderRowRef.current.children);
    tableHeaderRow.forEach(({ clientWidth }, index) => {
      columnWidth[index] = `${clientWidth}px`;
    });
    setColumnWidth?.(columnWidth);
  }, []);

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Droppable droppableId="droppable">
        {(provided, { isDraggingOver }) => (
          <DraggableTableBodyStyled
            isDragAndDropActive={isDragAndDropActive}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {children({ isDraggingOver })}
            {provided.placeholder}
          </DraggableTableBodyStyled>
        )}
      </Droppable>
    </DragDropContext>
  );
};
