import React, { memo } from 'react';

import { useDarkModeObserver } from '../../misc/hooks';
import classes from './SmallCardStub.module.css';
import { CardAbstract } from '../../containers/CardAbstract/CardAbstract.component';

export const SmallCardStub = memo(() => {
  const isDarkMode = useDarkModeObserver();

  return (
    <CardAbstract
      styles={
        isDarkMode ? classes.stubCardBackgroundDark : classes.stubCardBackground
      }
      small
    />
  );
});
