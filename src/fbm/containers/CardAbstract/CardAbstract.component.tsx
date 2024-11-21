import React, { FC, memo, ReactNode } from 'react';
import { Card, Elevation } from '@blueprintjs/core';

import classes from './CardAbstract.module.css';

export type CardAbstractProps = {
  elevation?: Elevation | undefined;
  interactive?: boolean;
  styles?: string;
  children?: ReactNode;
  handleClick?: () => void;
  small?: boolean;
};

export const CardAbstract: FC<CardAbstractProps> = memo(
  ({ elevation, interactive, styles = '', children, handleClick, small }) => {
    return (
      <Card
        interactive={interactive}
        elevation={elevation}
        className={`${classes.cardStyle} ${
          small ? classes.smallCardStyle : ''
        } ${styles}`}
        onClick={handleClick}
      >
        {children}
      </Card>
    );
  }
);
