import React, { memo, useCallback, useRef, useState } from 'react';

import { OptionsDropdown } from './OptionsDropdown';
import { RowData, TableOptionsProps } from './types';

import { OptionsButtonStyled } from './styles';

type TableOptionsComponent = <T extends RowData>(
  props: TableOptionsProps<T>
) => JSX.Element | null;
export const TableOptions: TableOptionsComponent = memo(
  ({ item, options, optionsDropdownOffset, parentElementId }) => {
    const optionsButtonRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
      setIsDropdownOpen(!isDropdownOpen);
    }, [isDropdownOpen]);

    return Array.isArray(options) ? (
      <>
        <OptionsButtonStyled
          onClick={toggleDropdown}
          ref={optionsButtonRef}
          isHidden={options.every((option) => option?.getIsHidden?.(item))}
        >
          <div>Opt</div>
        </OptionsButtonStyled>
        {isDropdownOpen && (
          <OptionsDropdown
            parentElementId={parentElementId}
            toggleDropdown={toggleDropdown}
            optionsButtonRef={optionsButtonRef}
            optionsDropdownOffset={optionsDropdownOffset}
            item={item}
            options={options}
          />
        )}
      </>
    ) : (
      <OptionsButtonStyled onClick={() => options.callback(item)}>
        {options.icon}
      </OptionsButtonStyled>
    );
  }
);
