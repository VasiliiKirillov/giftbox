import React, { FC, ReactNode } from 'react';

import classes from './ContentWrapper.module.css';

type ContentWrapperProps = {
  children: ReactNode;
  styles?: string;
};

export const ContentWrapper: FC<ContentWrapperProps> = ({
  children,
  styles = '',
}) => {
  return (
    <div className={`${classes.contentWrapper} ${styles}`}>{children}</div>
  );
};
