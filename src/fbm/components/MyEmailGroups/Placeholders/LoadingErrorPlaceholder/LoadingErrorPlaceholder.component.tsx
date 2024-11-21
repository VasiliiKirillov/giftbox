import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@blueprintjs/core';

import commonClasses from '../../../../misc/common.module.css';
import { PlaceholderNotification } from '../../../../containers/PlaceholderNotification/PlaceholderNotification.component';
import { fetchEmailGroups } from '../../../../slices/emailGroups';
import { AppDispatch } from '../../../../misc/store';

const LoadingErrorPlaceholder = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const handleCampaignsError = useCallback(() => {
    dispatch(fetchEmailGroups());
  }, []);

  return (
    <div className={commonClasses.placeholderContainer}>
      <PlaceholderNotification
        intent={'error'}
        text={'Email groups loading error'}
      >
        <Button
          intent="danger"
          text="Try again"
          onClick={handleCampaignsError}
        />
      </PlaceholderNotification>
    </div>
  );
});

export default LoadingErrorPlaceholder;
