import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@blueprintjs/core';

import { getIsEmailGroupsExists } from '../../slices/emailGroups';

type NewCampaignButtonProps = { addNewCampaignHandler: () => void };

export const NewCampaignButton: FC<NewCampaignButtonProps> = memo(
  ({ addNewCampaignHandler }) => {
    const isEmailGroupsExists = useSelector(getIsEmailGroupsExists);

    return (
      <Button
        text={'+ New campaign'}
        large
        intent={isEmailGroupsExists ? 'success' : 'none'}
        disabled={!isEmailGroupsExists}
        onClick={addNewCampaignHandler}
        title={
          !isEmailGroupsExists
            ? 'You need at least one email group for campaign creation'
            : ''
        }
      />
    );
  }
);
