import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CampaignsEmptyPlaceholder } from './CampaignsEmptyPlaceholder/CampaignsEmptyPlaceholder.component';
import {
  fetchCampaigns,
  getCampaignsStatus,
  getIsCampaignsEmpty,
} from '../../slices/campaigns';
import { LoadingErrorPlaceholder } from '../LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import { AppDispatch } from '../../misc/store';

export const CampaignsPlaceholders = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const campaignsLoadingStatus = useSelector(getCampaignsStatus);
  const isCampaignsEmpty = useSelector(getIsCampaignsEmpty);

  const isShowLoadingErrorPlaceholder = campaignsLoadingStatus === 'failed';

  const handleCampaignsError = useCallback(() => {
    dispatch(fetchCampaigns());
  }, []);

  return (
    <>
      {isShowLoadingErrorPlaceholder && (
        <LoadingErrorPlaceholder
          notificationText={'Campaigns loading error'}
          buttonText={'Try again'}
          handleClick={handleCampaignsError}
        />
      )}
      {isCampaignsEmpty && <CampaignsEmptyPlaceholder />}
    </>
  );
});
