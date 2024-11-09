import React, { memo, FC } from 'react';

import { LabelStyled } from './styles';
import styled from 'styled-components';

interface LabelFieldProps {
  labelText: string;
  isRequired?: boolean;
}

export const LabelField: FC<LabelFieldProps> = memo(
  ({ labelText, isRequired }) => (
    <LabelStyled>
      <LabelTextContainer>{labelText}</LabelTextContainer>
      {isRequired && <RequiredMark>*</RequiredMark>}
    </LabelStyled>
  )
);

const RequiredMark = styled.span`
  margin-left: 4px;
  color: #df2020;
`;

const LabelTextContainer = styled.span`
  display: inline-block; /* or use 'display: block' for block elements */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* or specify your desired width */
`;
