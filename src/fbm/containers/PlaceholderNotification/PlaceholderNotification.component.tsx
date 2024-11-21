import React, { FC, memo, ReactNode, useMemo } from 'react';
import { Colors, H3, Icon } from '@blueprintjs/core';

import classes from './PlaceholderNotification.module.css';
import { useDarkModeObserver } from '../../misc/hooks';

type PlaceholderNotificationProps = {
  text: string;
  intent: 'error' | 'primary';
  children: ReactNode;
};

export const PlaceholderNotification: FC<PlaceholderNotificationProps> = memo(
  ({ text, intent, children }) => {
    const isDarkMode = useDarkModeObserver();

    const NotificationIcon = useMemo(() => {
      if (intent === 'error') {
        return <Icon icon="error" size={24} color={Colors.RED3} />;
      } else if (intent === 'primary') {
        return <Icon icon="lightbulb" size={24} color={Colors.BLUE2} />;
      }
    }, [intent]);

    return (
      <div className={classes.placeholderContainer}>
        <div
          className={`${classes.placeholderMessage} ${
            isDarkMode ? classes.placeholderMessageDark : ''
          }`}
        >
          {NotificationIcon}
          <H3 className={classes.placeholderText}>{text}</H3>
          {children}
        </div>
      </div>
    );
  }
);
