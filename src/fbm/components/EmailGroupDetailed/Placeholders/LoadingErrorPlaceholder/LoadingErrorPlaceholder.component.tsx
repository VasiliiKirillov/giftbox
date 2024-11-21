import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@blueprintjs/core';

import commonClasses from '../../../../misc/common.module.css';
import { PlaceholderNotification } from '../../../../containers/PlaceholderNotification/PlaceholderNotification.component';
import { AppDispatch } from '../../../../misc/store';
import { fetchDetailedEmailGroup } from '../../../../slices/emailGroupsDetailed';

type LoadingErrorPlaceholderProps = { emailGroupId: string };

export const LoadingErrorPlaceholder: FC<LoadingErrorPlaceholderProps> = memo(
  ({ emailGroupId }) => {
    const dispatch: AppDispatch = useDispatch();

    const handleEmailsError = () => {
      dispatch(fetchDetailedEmailGroup(emailGroupId));
    };

    return (
      <div className={commonClasses.placeholderContainer}>
        <PlaceholderNotification intent={'error'} text={'Emails loading error'}>
          <Button
            intent="danger"
            text="Try again"
            onClick={handleEmailsError}
          />
        </PlaceholderNotification>
      </div>
    );
  }
);
