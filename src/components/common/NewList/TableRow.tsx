import React, { memo, useContext } from 'react';

import { RowData, TableRowProps } from './types';
import { ColumnWidthContext } from './ContextTableHelpers';
import { TableOptions } from 'Components/common/TableOptions/TableOptions';
import { LIST_WRAPPER_ID } from '.';

import { TableCellStyled, TableRowStyled } from './styles';

type TableRowComponent = <
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
>(
  props: TableRowProps<T, H>
) => JSX.Element | null;

export const TableRow: TableRowComponent = memo(
  ({
    row,
    provided,
    isDragging = false,
    isDraggingOver = false,
    headerData,
    options,
    optionsDropdownOffset,
  }) => {
    const { columnWidth } = useContext(ColumnWidthContext);

    return (
      <TableRowStyled
        ref={provided?.innerRef}
        isElementDragging={isDragging}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        style={{ ...provided?.draggableProps.style }}
      >
        {Object.keys(headerData).map((key, index) => {
          const cellContent = row[key];
          return (
            <TableCellStyled
              key={key}
              isElementDragging={isDragging}
              columnWidth={
                isDraggingOver && columnWidth ? columnWidth[index] : 'initial'
              }
            >
              {typeof cellContent === 'function'
                ? cellContent(row.id)
                : cellContent || `No data for ${key}`}
            </TableCellStyled>
          );
        })}
        {options ? (
          <TableCellStyled
            isElementDragging={isDragging}
            columnWidth={
              isDraggingOver && columnWidth
                ? columnWidth[Object.keys(columnWidth).length - 1]
                : 'initial'
            }
          >
            <TableOptions
              parentElementId={LIST_WRAPPER_ID}
              item={row}
              options={options}
              optionsDropdownOffset={optionsDropdownOffset}
            />
          </TableCellStyled>
        ) : null}
      </TableRowStyled>
    );
  }
);
