import React, { FC, memo, ReactNode } from 'react';

import { CardAbstract } from '../../containers/CardAbstract/CardAbstract.component';

type SmallCardContentProps = { children: ReactNode; handleClick?: () => void };

export const SmallCardContent: FC<SmallCardContentProps> = memo(
  ({ children, handleClick }) => {
    return (
      <CardAbstract
        elevation={2}
        interactive={Boolean(handleClick)}
        handleClick={handleClick}
        small
      >
        {children}
      </CardAbstract>
    );
  }
);
