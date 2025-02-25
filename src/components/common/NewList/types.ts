import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

type RenderFunction = (id: string) => JSX.Element;

export type RowData = {
  id: string;
  [key: string]: string | JSX.Element | number | RenderFunction;
};

export type OptionsData<T extends RowData> =
  | {
      icon: ReactNode;
      callback: (item: T) => void;
    }
  | Array<{
      name: string;
      getIsHidden?: (item: T) => boolean;
      getIsDisabled?: (item: T) => boolean;
      callback: (item: T) => void;
    }>;

type ReorderOptionsData<T extends RowData> = Record<keyof T, () => void>;

export type OptionsDropdownOffset = {
  top: number;
  right: number;
};

type CommonTableProps<T extends RowData> = {
  isDragAndDropActive?: boolean;
  handleDragStart?: () => void;
  handleDragEnd?: (
    isElementPlacedOnSamePosition: boolean,
    id: string,
    order: T,
    cancelAction: () => T[],
    updatedItems: T[]
  ) => void;
  optionsDropdownOffset?: OptionsDropdownOffset;
};

export type TableHeaderProps<
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
> = {
  headerData: H;
  options?: OptionsData<T>;
  reorderOptions?: ReorderOptionsData<T>;
};

export type TableProps<
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
> = CommonTableProps<T> &
  TableHeaderProps<T, H> & {
    data: Array<T>;
    isDraggable?: boolean;
  };

export type ListProps<
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
> = TableProps<T, H> & {
  pagination?: JSX.Element | boolean;
  isDraggable?: boolean;
};

export type CommonTableBodyProps<T extends RowData> = CommonTableProps<T> & {
  items: Array<T>;
  setItems: React.Dispatch<React.SetStateAction<Array<T>>>;
};

export type TableBodyProps<T extends RowData> = CommonTableBodyProps<T> & {
  children: (props?: { isDraggingOver: boolean }) => ReactNode;
  isDraggable: boolean;
};

export type DraggableTableBodyProps<T extends RowData> =
  CommonTableBodyProps<T> & {
    children: (props: { isDraggingOver: boolean }) => ReactNode;
  };

export type TableRowWrapperProps = {
  children: (props?: {
    provided: DraggableProvided;
    isDragging: boolean;
  }) => ReactElement<HTMLElement>;
  index: number;
  rowId: string;
  isDragAndDropActive: boolean;
  isDraggable: boolean;
};

export type TableRowProps<
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
> = {
  row: T;
  headerData: H;
  options?: OptionsData<T>;
  isDragging?: boolean;
  isDraggingOver?: boolean;
  provided?: DraggableProvided;
  optionsDropdownOffset?: OptionsDropdownOffset;
};

export type TableContextHelpersProps = {
  children: ReactNode;
};

export type ColumnWidthType = Record<string, string>;

export type ColumnWidthContextType = {
  columnWidth: ColumnWidthType;
  setColumnWidth: Dispatch<SetStateAction<ColumnWidthType>> | null;
};
