import React, { memo, useContext } from 'react';

import {
  TableHeaderStyled,
  TableHeaderRowStyled,
  TableHeaderElementStyled,
  TableHeaderOptionsStyled,
  TableHeaderTitleStyled,
  TableHeaderContentWrapper,
  TableHeaderReorderStyled,
} from './styles';
import { RowData, TableHeaderProps } from './types';
import { ReactComponent as ReorderIcon } from './assets/reorder.svg';

import { HeaderRefContext } from './ContextTableHelpers';

type TableHeaderComponent = <
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
>(
  props: TableHeaderProps<T, H>
) => JSX.Element | null;

export const TableHeader: TableHeaderComponent = memo(
  ({ headerData, options, reorderOptions }) => {
    const tableHeaderRowRef = useContext(HeaderRefContext);

    return (
      <TableHeaderStyled>
        <TableHeaderRowStyled ref={tableHeaderRowRef}>
          {Object.entries(headerData).map(([key, columnName]) => (
            <TableHeaderElementStyled key={key}>
              <TableHeaderContentWrapper>
                <TableHeaderTitleStyled>{columnName}</TableHeaderTitleStyled>
                {reorderOptions?.[key] && (
                  <TableHeaderReorderStyled onClick={reorderOptions?.[key]}>
                    <ReorderIcon />
                  </TableHeaderReorderStyled>
                )}
              </TableHeaderContentWrapper>
            </TableHeaderElementStyled>
          ))}
          {options ? <TableHeaderOptionsStyled /> : null}
        </TableHeaderRowStyled>
      </TableHeaderStyled>
    );
  }
);
