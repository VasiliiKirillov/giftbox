import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Divider } from '@blueprintjs/core';

import classes from './HomeCampaigns.module.css';
import {
  Campaign,
  getCampaignsAmount,
  getCampaignsStatus,
  getHomeScreenCampaigns,
  getIsCampaignsEmpty,
  getIsCampaignsExists,
} from '../../slices/campaigns';
import { CampaignsTable } from '../../components/CampaignsTable/CampaignsTable.component';
import { TitleHeading } from '../../components/TitleHeading/TitleHeading.component';
import { NewCampaignButton } from '../../components/NewCampaignButton/NewCampaignButton.component';
import { NewCampaignModal } from '../../components/NewCampaignModal/NewCampaignModal.component';
import { useNewCampaignModalData } from '../../components/NewCampaignModal/NewCampaignModal.service';
import { ContainerWrapper } from '../../containers/ContainerWrapper/ContainerWrapper.component';
import { ContentWrapper } from '../../containers/ContentWrapper/ContentWrapper.component';
import { FooterWrapper } from '../../containers/FooterWrapper/FooterWrapper.component';
import { CampaignsPlaceholders } from '../../components/CampaignsPlaceholders/CampaignsPlaceholders.component';
import { CampaignsDummyData } from '../../components/CampaignsDummyData/CampaignsDummyData.component';
import { prettifyDate } from '../../misc/utils';

export const HomeCampaigns = memo(() => {
  const navigate = useNavigate();

  const homeCampaigns = useSelector(getHomeScreenCampaigns);
  const campaignsAmount = useSelector(getCampaignsAmount);
  const campaignsStatus = useSelector(getCampaignsStatus);
  const isCampaignsEmpty = useSelector(getIsCampaignsEmpty);
  const isCampaignsExists = useSelector(getIsCampaignsExists);
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
      return homeCampaigns.map((campaign: Campaign) => (
        <tr
          key={campaign.id}
          className={campaignsAmount > 4 ? classes.lastChild : ''}
        >
          <td className={classes.firstCampaignsElement}>{campaign.name}</td>
          <td>{campaign.state}</td>
          <td>{prettifyDate(campaign.createdAt)}</td>
          <td>{campaign.amountOfMessagesSent}</td>
          <td>{campaign.totalMessages}</td>
        </tr>
      ));
    }
    return null;
  }, [campaignsStatus, isCampaignsExists, homeCampaigns]);

  return (
    <>
      <NewCampaignModal
        isDialogOpen={isNewCampaignDialogOpen}
        closeDialog={closeNewCampaignDialog}
      />
      <TitleHeading
        headingText={'Recent Campaigns'}
        helperText={`Campaigns involve tasks related to email broadcasting. First, you
        need to specify the group of emails you want to target. Then,
        choose the asset you want to broadcast, and start sending
        announcements about your updates`}
      />
      <ContainerWrapper>
        <CampaignsPlaceholders />
        <ContentWrapper>
          <CampaignsTable>{campaignsDataTable}</CampaignsTable>
          <Divider className={classes.divider} />
          <FooterWrapper>
            <NewCampaignButton addNewCampaignHandler={openNewCampaignDialog} />
            {campaignsAmount > 0 && (
              <Button
                minimal
                large
                intent="primary"
                text={'Show all campaigns...'}
                onClick={() => {
                  navigate('/campaigns');
                }}
              />
            )}
          </FooterWrapper>
        </ContentWrapper>
      </ContainerWrapper>
    </>
  );
});
