import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

import commonClasses from '../../../misc/common.module.css';
import {
  getIsEmailGroupsEmpty,
  getIsEmailGroupsExists,
} from '../../../slices/emailGroups';
import { PlaceholderNotification } from '../../../containers/PlaceholderNotification/PlaceholderNotification.component';
import { useNewCampaignModalData } from '../../NewCampaignModal/NewCampaignModal.service';
import { NewCampaignModal } from '../../NewCampaignModal/NewCampaignModal.component';

export const CampaignsEmptyPlaceholder = memo(() => {
  const navigate = useNavigate();

  const isEmailGroupsEmpty = useSelector(getIsEmailGroupsEmpty);
  const isEmailGroupsExists = useSelector(getIsEmailGroupsExists);

  const {
    isNewCampaignDialogOpen,
    closeNewCampaignDialog,
    openNewCampaignDialog,
  } = useNewCampaignModalData();

  return (
    <>
      <NewCampaignModal
        isDialogOpen={isNewCampaignDialogOpen}
        closeDialog={closeNewCampaignDialog}
      />
      <div className={commonClasses.placeholderContainer}>
        <PlaceholderNotification
          intent={'primary'}
          text={'Looks like you have no any campaigns yet'}
        >
          {isEmailGroupsEmpty ? (
            <>
              <div className={'bp4-monospace-text'}>
                Before you add new campaign:
              </div>
              <div className={commonClasses.flexRow}>
                <div>Add new email group</div>
                <Button
                  text={'+ First email group'}
                  large
                  intent="primary"
                  onClick={() => navigate('/emailgroups/new')}
                />
              </div>
            </>
          ) : (
            <Button
              text={'+ First campaign'}
              large
              intent={isEmailGroupsExists ? 'primary' : 'none'}
              disabled={!isEmailGroupsExists}
              onClick={openNewCampaignDialog}
            />
          )}
        </PlaceholderNotification>
      </div>
    </>
  );
});
