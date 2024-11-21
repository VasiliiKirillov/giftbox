import React, { memo } from 'react';
import { Button } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

import commonClasses from '../../../../misc/common.module.css';

import { PlaceholderNotification } from '../../../../containers/PlaceholderNotification/PlaceholderNotification.component';

const EmptyPlaceholder = memo(() => {
  const navigate = useNavigate();

  return (
    <div className={commonClasses.placeholderContainer}>
      <PlaceholderNotification
        intent={'primary'}
        text={'Looks like you have no any email groups yet'}
      >
        <Button
          text={'+ First email group'}
          large
          intent="primary"
          onClick={() => navigate('/emailgroups/new')}
        />
      </PlaceholderNotification>
    </div>
  );
});

export default EmptyPlaceholder;
