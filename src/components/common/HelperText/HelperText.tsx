import React, { memo, FC } from 'react';

import { HelperTextStyled } from './styles';

interface HelperTextProps {
  additionalInfo: string;
}

export const HelperText: FC<HelperTextProps> = memo(({ additionalInfo }) => (
  <HelperTextStyled>{additionalInfo}</HelperTextStyled>
));
