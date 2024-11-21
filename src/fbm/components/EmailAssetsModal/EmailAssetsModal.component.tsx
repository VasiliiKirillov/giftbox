import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  EditableText,
  H4,
} from '@blueprintjs/core';

import commonClasses from '../../misc/common.module.css';
import classes from './EmailAssetsModal.module.css';
import { AppDispatch } from '../../misc/store';
import {
  createEmailAsset,
  EmailAsset,
  updateEmailAsset,
} from '../../slices/emailAssets';
import { useHandleEditAssetData } from './EmailAssetModal.service';

type EmailAssetsModalProps = {
  title?: string;
  anotherOneTitle?: string;
  oneMoreProp?: unknown;
  handleTitleClick?: () => void;
  handleClickTitle?: () => unknown;
  titleTitle?: boolean;
  isDialogOpen: boolean;
  closeDialog: () => void;
  editingEmailAsset?: EmailAsset;
  handleOpenModal?: () => void;
  handleCloseModal?: () => void;
};

export const EmailAssetsModal: FC<EmailAssetsModalProps> = memo(
  ({
    title,
    isDialogOpen,
    closeDialog,
    editingEmailAsset,
    handleOpenModal,
    handleCloseModal,
  }) => {
    const dispatch: AppDispatch = useDispatch();

    const [isEmailAssetContentLoading, setEmailAssetContentLoading] =
      useState(false);

    const [assetName, setAssetName] = useState('');
    const [assetSubject, setAssetSubject] = useState('');
    const [assetContent, setAssetContent] = useState('');

    // set init values from editAssetData
    useHandleEditAssetData(
      editingEmailAsset,
      setEmailAssetContentLoading,
      setAssetContent,
      setAssetName,
      setAssetSubject
    );

    // reset data on close
    useEffect(() => {
      if (isDialogOpen) return;

      handleOpenModal?.();
      handleCloseModal?.();
      setAssetName('');
      setAssetSubject('');
      setAssetContent('');
    }, [isDialogOpen]);

    const isMainButtonDisabled =
      assetName?.length === 0 ||
      !assetSubject ||
      assetSubject?.length === 0 ||
      assetContent.length === 0;

    const handleMainAction = async () => {
      if (editingEmailAsset) {
        await dispatch(
          updateEmailAsset({
            assetId: editingEmailAsset.id,
            assetName,
            assetSubject,
            assetContent,
          })
        );
      } else {
        await dispatch(
          createEmailAsset({ assetName, assetSubject, assetContent })
        );
      }
      closeDialog();
    };

    return (
      <Dialog
        icon={editingEmailAsset ? 'edit' : 'add'}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        style={{
          width: '600px',
          backgroundColor: 'white',
        }}
      >
        <DialogBody>
          {title && <div className={classes.emailAssetRow}>{title}</div>}
          <div className={commonClasses.flexRow}>
            <div className={classes.emailAssetRow}>
              <H4>Asset name</H4>
              <H4>:</H4>
            </div>
            <H4>
              <EditableText
                placeholder="..."
                maxLength={40}
                onChange={setAssetName}
                value={assetName}
              />
            </H4>
          </div>
          <div className={`${commonClasses.flexRow}`}>
            <div className={classes.emailAssetRow}>
              <H4>Subject</H4>
              <H4>:</H4>
            </div>
            <H4>
              <EditableText
                placeholder="..."
                maxLength={200}
                className={classes.subjectEmailAsset}
                onChange={setAssetSubject}
                value={assetSubject}
              />
            </H4>
          </div>
          <div className={commonClasses.flexColumn}>
            <div className={classes.emailAssetRow}>
              <H4>Email asset</H4>
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
              onChange={setAssetContent}
              value={assetContent}
            />
          </div>
        </DialogBody>
        <DialogFooter
          minimal={true}
          actions={
            <>
              <Button
                minimal
                intent="success"
                text={editingEmailAsset ? 'Save' : 'Create'}
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
