import React, { FC, memo, ReactNode } from 'react';

import { CardAbstract } from '../../containers/CardAbstract/CardAbstract.component';

type BigCardContentProps = { children: ReactNode; handleClick?: () => void };

export const BigCardContent: FC<BigCardContentProps> = memo(
  ({ children, handleClick }) => {
    return (
      <CardAbstract
        elevation={2}
        interactive={Boolean(handleClick)}
        handleClick={handleClick}
      >
        {children}
      </CardAbstract>
    );
  }
);
