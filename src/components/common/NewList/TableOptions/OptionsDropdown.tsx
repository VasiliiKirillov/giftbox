import React, { memo } from 'react';
import ReactDOM from 'react-dom';

import { OptionsDropdownProps, RowData } from './types';

import { DropdownElementStyled, DropdownStyled } from './styles';
import styled from 'styled-components';

type OptionsDropdownComponent = <T extends RowData>(
  props: OptionsDropdownProps<T>
) => JSX.Element | null;

export const OptionsDropdown: OptionsDropdownComponent = memo(
  ({
    toggleDropdown,
    optionsButtonRef,
    options,
    item,
    optionsDropdownOffset = { top: 0, right: 0 },
    parentElementId,
  }) => {
    const boundingOptionsButtonRect =
      optionsButtonRef.current?.getBoundingClientRect();
    const dropdownTopOffset = boundingOptionsButtonRect?.top;
    const dropdownRightOffset =
      document.body.clientWidth - (boundingOptionsButtonRect?.right || 0);
    const handleClick = (callback: (param: typeof item) => void) => {
      callback(item);
      toggleDropdown();
    };

    return ReactDOM.createPortal(
      Array.isArray(options) && (
        <>
          <ModalBackgroundStyled
            onClick={toggleDropdown}
            isTransparent={true}
          />
          <DropdownStyled
            topOffset={dropdownTopOffset}
            rightOffset={dropdownRightOffset}
            optionsDropdownOffset={optionsDropdownOffset}
          >
            {options
              .filter(({ getIsHidden }) => !getIsHidden?.(item))
              .map(({ name, callback, getIsDisabled }) => {
                const isDisabled = getIsDisabled?.(item);
                return (
                  <DropdownElementStyled
                    key={name}
                    isDisabled={isDisabled}
                    onClick={() =>
                      isDisabled ? void 0 : handleClick(callback)
                    }
                  >
                    {name}
                  </DropdownElementStyled>
                );
              })}
          </DropdownStyled>
        </>
      ),
      document.getElementById(parentElementId) as Element
    );
  }
);

export const ModalBackgroundStyled = styled.div<{ isTransparent?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ isTransparent }) =>
    isTransparent ? 'none' : '#253F7366'};
  box-sizing: border-box;
`;
