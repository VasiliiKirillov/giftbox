import React, { createContext, FC, useRef, useState } from 'react';

import {
  ColumnWidthContextType,
  ColumnWidthType,
  TableContextHelpersProps,
} from './types';

export const ColumnWidthContext = createContext<ColumnWidthContextType>({
  columnWidth: {},
  setColumnWidth: null,
});

export const HeaderRefContext =
  createContext<React.MutableRefObject<HTMLTableRowElement | null> | null>(
    null
  );

export const ContextTableHelpers: FC<TableContextHelpersProps> = ({
  children,
}) => {
  const [columnWidth, setColumnWidth] = useState<ColumnWidthType>({});
  const tableHeaderRowRef = useRef(null);

  return (
    <ColumnWidthContext.Provider value={{ columnWidth, setColumnWidth }}>
      <HeaderRefContext.Provider value={tableHeaderRowRef}>
        {children}
      </HeaderRefContext.Provider>
    </ColumnWidthContext.Provider>
  );
};
