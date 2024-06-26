import React, { memo, FC } from 'react';

import { LabelStyled } from './styles';

interface LabelFieldProps {
  labelText: string;
  isRequired?: boolean;
}

export const LabelField: FC<LabelFieldProps> = memo(
  ({ labelText, isRequired }) => (
    <LabelStyled>
      {labelText}
      {isRequired && <span>*</span>}
    </LabelStyled>
  )
);
