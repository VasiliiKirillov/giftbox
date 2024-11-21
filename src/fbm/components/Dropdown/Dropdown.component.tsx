import React, { memo, ReactNode } from 'react';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { Menu } from '@blueprintjs/core';

import classes from './Dropdown.module.css';

type DropdownElement = { id: string; name: string; [key: string]: any };

type DropdownProps<T extends DropdownElement> = {
  elements: T[];
  pickedElementName: string;
  handlePickedElement: (element: T) => void;
  disabled?: boolean;
};

type DropdownComponent = <T extends DropdownElement>(
  props: DropdownProps<T>
) => ReactNode;

export const Dropdown: DropdownComponent = memo(
  ({ elements, pickedElementName, handlePickedElement, disabled }) => {
    return (
      <Popover2
        className={classes.dropdownPopover}
        disabled={disabled}
        content={
          <Menu className={classes.dropdownMenu}>
            {elements.map((element) => (
              <MenuItem2
                key={element.id}
                text={element.name}
                onClick={() => {
                  handlePickedElement(element);
                }}
              />
            ))}
          </Menu>
        }
        fill={true}
        placement="bottom"
      >
        <button
          type="button"
          className={`bp4-button bp4-icon-caret-down bp4-align-left bp4-fill ${classes.dropdownButton}`}
          disabled={disabled}
        >
          <div className={classes.dropdownText}>{pickedElementName}</div>
        </button>
      </Popover2>
    );
  }
);
