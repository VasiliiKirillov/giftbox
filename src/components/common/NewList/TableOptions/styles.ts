import styled from 'styled-components';
import { OptionsDropdownOffset } from './types';

export const OptionsButtonStyled = styled.button<{
  isHidden?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  position: relative;
  cursor: pointer;
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
`;

export const DropdownStyled = styled.div<{
  topOffset?: number;
  rightOffset?: number;
  optionsDropdownOffset: OptionsDropdownOffset;
}>`
  position: absolute;
  display: flex;
  border: 1px solid #ddd;
  flex-direction: column;
  top: ${({ topOffset, optionsDropdownOffset }) =>
    topOffset ? `${topOffset - optionsDropdownOffset.top}px` : '0px'};
  right: ${({ rightOffset, optionsDropdownOffset }) =>
    rightOffset ? `${rightOffset - optionsDropdownOffset.right}px` : '0px'};
  background-color: white;
`;

export const DropdownElementStyled = styled.div<{
  isDisabled?: boolean;
}>`
  align-items: center;
  height: 36px;
  min-width: 192px;
  display: flex;
  padding: 8px;
  color: ${({ isDisabled }) => (isDisabled ? '#757575' : 'default')};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  background-color: ${({ isDisabled }) => (isDisabled ? '#ddd' : 'default')};

  &:hover {
    background-color: ${({ isDisabled }) => (isDisabled ? 'default' : '#eee')};
  }
`;
