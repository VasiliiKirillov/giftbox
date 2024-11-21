import React, { FC, memo } from 'react';
import { Button } from '@blueprintjs/core';

import { PlaceholderNotification } from '../../containers/PlaceholderNotification/PlaceholderNotification.component';

type EmptyPlaceholderType = {
  handleClick: () => void;
  notificationText: string;
  buttonText: string;
};

export const EmptyPlaceholder: FC<EmptyPlaceholderType> = memo(
  ({ handleClick, notificationText, buttonText }) => (
    <PlaceholderNotification intent={'primary'} text={notificationText}>
      <Button text={buttonText} large intent="primary" onClick={handleClick} />
    </PlaceholderNotification>
  )
);
