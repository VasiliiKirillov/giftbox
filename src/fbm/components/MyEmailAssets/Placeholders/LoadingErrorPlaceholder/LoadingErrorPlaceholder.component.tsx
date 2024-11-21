import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@blueprintjs/core';

import commonClasses from '../../../../misc/common.module.css';
import { PlaceholderNotification } from '../../../../containers/PlaceholderNotification/PlaceholderNotification.component';
import { fetchEmailAssets } from '../../../../slices/emailAssets';
import { AppDispatch } from '../../../../misc/store';

const LoadingErrorPlaceholder = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const handleAssetsError = useCallback(() => {
    dispatch(fetchEmailAssets());
  }, []);

  return (
    <div className={commonClasses.placeholderContainer}>
      <PlaceholderNotification
        intent={'error'}
        text={'Email assets loading error'}
      >
        <Button intent="danger" text="Try again" onClick={handleAssetsError} />
      </PlaceholderNotification>
    </div>
  );
});

export default LoadingErrorPlaceholder;
