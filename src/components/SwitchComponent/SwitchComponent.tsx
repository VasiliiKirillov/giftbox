import React, { FC, memo } from 'react';

type SwitchComponentProps = {
  isSelected: boolean;
  setSelectedStatus: (a: boolean) => void;
};

export const SwitchComponent: FC<SwitchComponentProps> = memo(
  ({ isSelected, setSelectedStatus }) => (
    <SwitchBodyStyled
      role="button"
      isSelected={isSelected}
      onClick={() => setSelectedStatus(!isSelected)}
    >
      <SwitchStyled />
    </SwitchBodyStyled>
  )
);

import styled from 'styled-components';

interface SwitchComponentPropsStyles {
  isSelected: boolean;
}

export const SwitchBodyStyled = styled.div<SwitchComponentPropsStyles>`
  display: flex;
  width: 40px;
  height: 24px;
  padding: 0 2px;
  justify-content: ${(props) => (props.isSelected ? 'flex-end' : 'flex-start')};
  align-items: center;
  background: ${(props) => (props.isSelected ? '#838383' : '#d1d1d1')};
  cursor: pointer;
`;
export const SwitchStyled = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 1px;
  background: #fff;
`;
