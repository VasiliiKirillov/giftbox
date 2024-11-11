import React, {
  useState,
  useRef,
  memo,
  useCallback,
  useEffect,
  RefObject,
} from 'react';

type DropdownListElementType = {
  name: string;
  id: string;
  [key: string]: string | number | null | boolean;
};

type DropdownComponentProps<T extends DropdownListElementType> = {
  listData: Array<T>;
  currentItem: string;
  changeItemAction: (value: T) => void;
  placeholderValue?: string;
  specialAction?: string;
  specialActionHandler?: (specialAction?: string) => void;
};

function useOnClickOutside(
  ref: RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        callback();
      }
    };
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [callback]);
}

const Dropdown = function <T extends DropdownListElementType>({
  listData,
  currentItem,
  changeItemAction,
  placeholderValue = '',
  specialAction,
  specialActionHandler,
}: DropdownComponentProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const listItemClick = (value: T) => {
    changeItemAction?.(value);
    setIsOpen(!isOpen);
  };

  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const handleClickOutside = useCallback(() => setIsOpen(false), []);
  useOnClickOutside(ref, handleClickOutside);

  // const sortedListData: Array<T> = useMemo(
  //   () =>
  //     [...listData].sort((prev, next) => prev.name.localeCompare(next.name)),
  //   [listData]
  // );

  return (
    <DropDownContainerStyled ref={ref}>
      <DropDownHeaderStyled
        isOpen={isOpen}
        currentItem={currentItem}
        onClick={toggleDropdown}
      >
        {currentItem || placeholderValue}
      </DropDownHeaderStyled>
      {isOpen && (
        <DropDownListContainerStyled>
          <DropDownListStyled>
            {specialAction && (
              <ListItemStyled
                onClick={() => {
                  specialActionHandler
                    ? specialActionHandler(specialAction)
                    : null;
                  setIsOpen(!isOpen);
                }}
              >
                {specialAction}
              </ListItemStyled>
            )}
            {listData.map((element, index) => (
              <ListItemStyled
                key={`${element.id}-${index}`}
                onClick={() => listItemClick(element)}
              >
                {element.name}
              </ListItemStyled>
            ))}
          </DropDownListStyled>
        </DropDownListContainerStyled>
      )}
    </DropDownContainerStyled>
  );
};

import styled from 'styled-components';

export const DropDownContainerStyled = styled.div`
  position: relative;
  height: 100%;
  min-width: 128px;
`;

export const DropDownHeaderStyled = styled.div<{
  isOpen: boolean;
  currentItem: string;
}>`
  padding: 6px 12px;
  font-weight: normal;
  box-sizing: border-box;
  font-size: 16px;
  color: ${(props) => (props.currentItem ? '#1b1b1b' : '#c4c4c4')};
  box-shadow: ${(props) => (props.isOpen ? '0px 0px 3px #a7a7a7' : 'none')};
  background: #f4f4f4;
  height: 100%;
  font-family: 'Readex Pro', sans-serif;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  }
`;

export const DropDownListContainerStyled = styled.div`
  position: absolute;
  width: 100%;
  top: 44px;
  z-index: 1;
`;

export const DropDownListStyled = styled.ul`
  background: #f4f4f4;
  box-shadow: 0 0 3px #a7a7a7;
  box-sizing: border-box;
  color: #3b4256;
  font-weight: normal;
  font-size: 16px;
  border-radius: 4px;
  height: 100%;
  padding: 8px 0;
  max-height: 400px;
  overflow: scroll;
`;

export const ListItemStyled = styled.li`
  list-style: none;
  padding: 8px 16px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 1;
  transition: all 0.2s;
  &:hover {
    opacity: 0.8;
    background-color: rgba(167, 178, 199, 0.1);
  }
`;

export const DropdownComponent = memo(Dropdown) as typeof Dropdown;
