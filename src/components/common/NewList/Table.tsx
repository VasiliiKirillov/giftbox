import React, { memo, useEffect, useState } from 'react';

import { TableProps, RowData } from './types';
import { TableStyled } from './styles';

import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableBody } from './TableBody';
import { TableRowWrapper } from './TableRowWrapper';
import { ContextTableHelpers } from './ContextTableHelpers';

type TableComponent = <
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
>(
  props: TableProps<T, H>
) => JSX.Element | null;

export const Table: TableComponent = memo(
  ({
    data,
    options,
    headerData,
    isDraggable = false,
    isDragAndDropActive = false,
    handleDragStart,
    handleDragEnd,
    reorderOptions,
    optionsDropdownOffset,
  }) => {
    const [items, setItems] = useState(data);

    // subscribe to external data changing
    useEffect(() => {
      setItems(data);
    }, [data]);

    return (
      <ContextTableHelpers>
        <TableStyled>
          <TableHeader
            headerData={headerData}
            options={options}
            reorderOptions={reorderOptions}
          />
          <TableBody
            isDragAndDropActive={isDragAndDropActive}
            isDraggable={isDraggable}
            items={items}
            setItems={setItems}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          >
            {(props) => (
              <>
                {items.map((row, index) => (
                  <TableRowWrapper
                    key={row.id}
                    index={index}
                    rowId={row.id}
                    isDragAndDropActive={isDragAndDropActive}
                    isDraggable={isDraggable}
                  >
                    {(rowDraggableProps) => (
                      <TableRow
                        row={row}
                        headerData={headerData}
                        options={options}
                        optionsDropdownOffset={optionsDropdownOffset}
                        {...rowDraggableProps}
                        {...props}
                      />
                    )}
                  </TableRowWrapper>
                ))}
              </>
            )}
          </TableBody>
        </TableStyled>
      </ContextTableHelpers>
    );
  }
);
