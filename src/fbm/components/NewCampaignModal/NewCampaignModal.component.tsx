import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Colors,
  Dialog,
  DialogBody,
  DialogFooter,
  EditableText,
  H4,
  H6,
} from '@blueprintjs/core';

import commonClasses from '../../misc/common.module.css';
import classes from './NewCampaignModal.module.css';
import { AppDispatch } from '../../misc/store';
import { createCampaign } from '../../slices/campaigns';
import { EmailAssetsDropdown } from './EmailAssetsDropdown/EmailAssetsDropdown.component';
import { EmailGroupsDropdown } from './EmailGroupsDropdown/EmailGroupsDropdown.component';
import { SendTestEmailButton } from './SendTestEmailButton/SendTestEmailButton.component';
import { useHandlePickingEmailAsset } from './NewCampaignModal.service';

type EmailAssetsModalProps = {
  isDialogOpen: boolean;
  closeDialog: () => void;
};

export const NewCampaignModal: FC<EmailAssetsModalProps> = memo(
  ({ isDialogOpen, closeDialog }) => {
    const dispatch: AppDispatch = useDispatch();

    const [isEmailAssetContentLoading, setEmailAssetContentLoading] =
      useState(false);

    const [campaignName, setCampaignName] = useState('');
    const [pickedEmailGroupId, setPickedEmailGroupId] = useState('');

    const [campaignSubject, setCampaignSubject] = useState('');
    const [campaignContent, setCampaignContent] = useState('');

    const [emailAssetId, setPickedEmailAssetId] = useState<string | null>(null);

    // reset data on close
    useEffect(() => {
      if (isDialogOpen) return;

      setCampaignName('');
      setCampaignSubject('');
      setCampaignContent('');
      setPickedEmailGroupId('');
    }, [isDialogOpen]);

    const isMainButtonDisabled =
      campaignName.length === 0 ||
      campaignSubject.length === 0 ||
      campaignContent.length === 0 ||
      !pickedEmailGroupId;

    const handleMainAction = async () => {
      await dispatch(
        createCampaign({
          campaignName,
          pickedEmailGroupId,
          campaignSubject,
          campaignContent,
        })
      );
      closeDialog();
    };

    useHandlePickingEmailAsset(
      emailAssetId,
      setCampaignSubject,
      setCampaignContent,
      setEmailAssetContentLoading
    );

    return (
      <Dialog
        title="Start new campaign"
        icon="add"
        isOpen={isDialogOpen}
        onClose={closeDialog}
        style={{ width: '600px' }}
      >
        <DialogBody>
          <div
            className={`${commonClasses.flexRow} ${classes.campaignNameMargin}`}
          >
            <div className={classes.campaignEntityContainer}>
              <H4>Campaign name</H4>
              <H6 style={{ color: Colors.RED2 }}>*</H6>
              <H4>:</H4>
            </div>
            <H4>
              <EditableText
                placeholder="..."
                maxLength={40}
                onChange={setCampaignName}
                value={campaignName}
              />
            </H4>
          </div>
          <div className={`${commonClasses.flexRow} ${classes.dropdownGap}`}>
            <div className={commonClasses.flexRow}>
              <div className={classes.campaignEntityContainer}>
                <H4>Email group</H4>
                <H6 style={{ color: Colors.RED2 }}>*</H6>
                <H4>:</H4>
              </div>
              <EmailGroupsDropdown
                handlePickedEmailGroupId={setPickedEmailGroupId}
              />
            </div>
            <div className={commonClasses.flexRow}>
              <H4>Email asset:</H4>
              <EmailAssetsDropdown
                handlePickedEmailAssetId={setPickedEmailAssetId}
              />
            </div>
          </div>
          <div className={commonClasses.flexRow}>
            <div className={classes.campaignEntityContainer}>
              <H4>Subject</H4>
              <H6 style={{ color: Colors.RED2 }}>*</H6>
              <H4>:</H4>
            </div>
            <H4>
              <EditableText
                placeholder="..."
                className={classes.subjectNewCampaign}
                maxLength={200}
                onChange={setCampaignSubject}
                value={campaignSubject}
              />
            </H4>
          </div>
          <div className={commonClasses.flexColumn}>
            <div className={classes.campaignEntityContainer}>
              <H4>Email body</H4>
              <H6 style={{ color: Colors.RED2 }}>*</H6>
              <H4>:</H4>
            </div>
            <EditableText
              className={`${commonClasses.emailAssetContentBorder} ${
                isEmailAssetContentLoading ? 'bp4-skeleton' : ''
              }`}
              maxLines={12}
              minLines={4}
              multiline={true}
              placeholder="Edit asset text..."
              onChange={setCampaignContent}
              value={campaignContent}
            />
          </div>
          <SendTestEmailButton
            campaignContent={campaignContent}
            campaignSubject={campaignSubject}
          />
        </DialogBody>
        <DialogFooter
          minimal
          actions={
            <>
              <Button
                minimal
                intent="success"
                text="Start"
                disabled={isMainButtonDisabled}
                title={isMainButtonDisabled ? 'Fill all required fields' : ''}
                onClick={handleMainAction}
              />
              <Button
                minimal
                intent="danger"
                text={'Cancel'}
                onClick={closeDialog}
              />
            </>
          }
        />
      </Dialog>
    );
  }
);
