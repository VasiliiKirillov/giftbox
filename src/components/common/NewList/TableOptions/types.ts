import { ReactNode } from 'react';

type RenderFunction = (id: string) => JSX.Element;

export type RowData = {
  id: string;
  [key: string]:
    | string
    | JSX.Element
    | number
    | RenderFunction
    | boolean
    | null;
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

export type OptionsDropdownOffset = {
  top: number;
  right: number;
};

export type TableOptionsProps<T extends RowData> = {
  item: T;
  options: OptionsData<T>;
  optionsDropdownOffset?: OptionsDropdownOffset;
  parentElementId: string;
};

export type OptionsDropdownProps<T extends RowData> = {
  toggleDropdown: () => void;
  optionsButtonRef: React.MutableRefObject<null | HTMLDivElement>;
  item: T;
  options: OptionsData<T>;
  optionsDropdownOffset?: OptionsDropdownOffset;
  parentElementId: string;
};
