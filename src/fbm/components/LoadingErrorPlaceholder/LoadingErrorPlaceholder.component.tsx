import React, { FC, memo } from 'react';
import { Button } from '@blueprintjs/core';

import { PlaceholderNotification } from '../../containers/PlaceholderNotification/PlaceholderNotification.component';

type LoadingErrorPlaceholderType = {
  handleClick: () => void;
  notificationText: string;
  buttonText: string;
};

export const LoadingErrorPlaceholder: FC<LoadingErrorPlaceholderType> = memo(
  ({ handleClick, notificationText, buttonText }) => {
    return (
      <PlaceholderNotification intent={'error'} text={notificationText}>
        <Button intent="danger" text={buttonText} onClick={handleClick} />
      </PlaceholderNotification>
    );
  }
);
