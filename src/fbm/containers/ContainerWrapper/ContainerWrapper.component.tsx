import React, { FC, ReactNode } from 'react';

import classes from './ContainerWrapper.module.css';

type ContainerWrapperProps = {
  children: ReactNode;
};

export const ContainerWrapper: FC<ContainerWrapperProps> = ({ children }) => {
  return <div className={classes.containerWrapper}>{children}</div>;
};
