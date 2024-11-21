import React, { FC, memo, useState } from 'react';
import { Callout, Colors, H2, Icon } from '@blueprintjs/core';

import commonClasses from '../../misc/common.module.css';
import classes from './TitleHeading.module.css';
import { useDarkModeObserver } from '../../misc/hooks';

type TitleHeadingProps = {
  headingText: string;
  helperText?: string;
};

export const TitleHeading: FC<TitleHeadingProps> = memo(
  ({ headingText, helperText }) => {
    const [isShowHelper, setIsShowHelper] = useState(false);

    const isDarkMode = useDarkModeObserver();

    return (
      <div className={`${commonClasses.flexRow} ${classes.headingContainer}`}>
        <H2>{headingText}</H2>
        {helperText && (
          <div
            className={classes.iconContainer}
            onMouseEnter={() => {
              setIsShowHelper(true);
            }}
            onMouseLeave={() => {
              setIsShowHelper(false);
            }}
          >
            <Icon icon={'info-sign'} size={14} color={Colors.GRAY5} />
            {isShowHelper && (
              <div
                className={`${classes.callout} ${
                  isDarkMode ? classes.calloutDark : ''
                }`}
              >
                <Callout intent={'primary'}>{helperText}</Callout>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
