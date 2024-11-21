import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

import commonClasses from '../../misc/common.module.css';
import {
  Campaign,
  getCampaigns,
  getCampaignsStatus,
  getIsCampaignsEmpty,
  getIsCampaignsExists,
} from '../../slices/campaigns';
import { TitleHeading } from '../../components/TitleHeading/TitleHeading.component';
import { NewCampaignButton } from '../../components/NewCampaignButton/NewCampaignButton.component';
import { CampaignsTable } from '../../components/CampaignsTable/CampaignsTable.component';
import { NewCampaignModal } from '../../components/NewCampaignModal/NewCampaignModal.component';
import { useNewCampaignModalData } from '../../components/NewCampaignModal/NewCampaignModal.service';
import { ContainerWrapper } from '../../containers/ContainerWrapper/ContainerWrapper.component';
import { ContentWrapper } from '../../containers/ContentWrapper/ContentWrapper.component';
import { CampaignsPlaceholders } from '../../components/CampaignsPlaceholders/CampaignsPlaceholders.component';
import { CampaignsDummyData } from '../../components/CampaignsDummyData/CampaignsDummyData.component';
import classes from '../HomeCampaigns/HomeCampaigns.module.css';
import { prettifyDate } from '../../misc/utils';

export const MyCampaignsModule = memo(() => {
  const campaigns = useSelector(getCampaigns);
  const isCampaignsExists = useSelector(getIsCampaignsExists);
  const campaignsStatus = useSelector(getCampaignsStatus);
  const isCampaignsEmpty = useSelector(getIsCampaignsEmpty);
  const isShowDummyData = campaignsStatus === 'failed' || isCampaignsEmpty;

  const {
    isNewCampaignDialogOpen,
    closeNewCampaignDialog,
    openNewCampaignDialog,
  } = useNewCampaignModalData();

  const campaignsDataTable = useMemo(() => {
    if (campaignsStatus === 'loading') {
      return <CampaignsDummyData withSkeleton isHomePage />;
    } else if (isShowDummyData) {
      return <CampaignsDummyData isHomePage />;
    } else if (isCampaignsExists) {
      return campaigns.map((campaign: Campaign) => (
        <tr key={campaign.id}>
          <td className={classes.firstCampaignsElement}>{campaign.name}</td>
          <td>{campaign.state}</td>
          <td>{prettifyDate(campaign.createdAt)}</td>
          <td>{campaign.amountOfMessagesSent}</td>
          <td>{campaign.totalMessages}</td>
        </tr>
      ));
    }
    return null;
  }, [campaignsStatus, isCampaignsExists, campaigns]);

  return (
    <>
      <NewCampaignModal
        isDialogOpen={isNewCampaignDialogOpen}
        closeDialog={closeNewCampaignDialog}
      />
      <div className={commonClasses.flexRow}>
        <TitleHeading headingText={'My campaigns'} />
        {isCampaignsExists && (
          <div className={commonClasses.titleButtonWrapper}>
            <NewCampaignButton addNewCampaignHandler={openNewCampaignDialog} />
          </div>
        )}
      </div>
      <ContainerWrapper>
        <CampaignsPlaceholders />
        <ContentWrapper>
          <CampaignsTable>{campaignsDataTable}</CampaignsTable>
        </ContentWrapper>
      </ContainerWrapper>
    </>
  );
});
