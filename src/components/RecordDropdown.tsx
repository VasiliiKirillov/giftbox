import { memo, useState } from 'react';
import styled from 'styled-components';

type RecordDropdownProps<T extends { id: string; name: string }> = {
  listData: Array<T>;
  placeholderValue: string;
  pickedElement: T | null;
  setPickedElement: (value: T) => void;
};

export const DropdownComponent = function <
  T extends { id: string; name: string },
>({
  listData,
  pickedElement,
  setPickedElement,
  placeholderValue,
}: RecordDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleListItemClick = (element: T) => {
    setPickedElement(element);
    setIsOpen(false);
  };

  return (
    <DropDownContainerStyled>
      <DropDownHeaderStyled onClick={() => setIsOpen(!isOpen)}>
        {pickedElement?.name || placeholderValue}
      </DropDownHeaderStyled>
      {isOpen && (
        <DropDownListContainerStyled>
          <DropDownListStyled>
            {listData.map((element) => (
              <ListItemStyled
                key={element.id}
                onClick={() => handleListItemClick(element)}
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

// styles
export const DropDownHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const DropDownContainerStyled = styled.div`
  position: relative;
`;

const ListItemStyled = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 1;
`;

const DropDownListContainerStyled = styled.div`
  position: absolute;
  width: 100%;
  top: 24px;
  z-index: 1;
  background-color: white;
  border: 1px solid;
`;

export const DropDownListStyled = styled.ul`
  height: 100%;
  padding: 8px 0;
  max-height: 400px;
  overflow: scroll;
`;

export const RecordDropdown = memo(
  DropdownComponent
) as typeof DropdownComponent;
