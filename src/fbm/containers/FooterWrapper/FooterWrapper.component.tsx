import React, { FC, ReactNode } from 'react';

import classes from './FooterWrapper.module.css';

type FooterWrapperProps = {
  children: ReactNode;
};

export const FooterWrapper: FC<FooterWrapperProps> = ({ children }) => {
  return <div className={classes.footerWrapper}>{children}</div>;
};
