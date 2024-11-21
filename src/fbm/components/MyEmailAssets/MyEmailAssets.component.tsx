import React, { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, H4 } from '@blueprintjs/core';

import { prettifyDate } from '../../misc/utils';
import commonClasses from '../../misc/common.module.css';
import { AppDispatch } from '../../misc/store';
import classes from './MyEmailAssets.module.css';
import {
  getEmailAssets,
  getEmailAssetsStatus,
  getIsEmailAssetsEmpty,
  getIsEmailAssetsExists,
  deleteEmailAsset,
  getEmailAssetsAmount,
} from '../../slices/emailAssets';
import { TitleHeading } from '../TitleHeading/TitleHeading.component';
import Placeholders from './Placeholders/Placeholders.component';
import DummyData from './DummyData/DummyData.component';
import useCommonModalDialog from '../../containers/CommonModal/CommonModal.hook';
import { EmailAssetsModal } from '../EmailAssetsModal/EmailAssetsModal.component';
import { useEmailAssetsModalData } from '../EmailAssetsModal/EmailAssetModal.service';

const STUB_EMAIL_ASSETS_AMOUNT = 9;

const MyEmailAssets = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const emailAssets = useSelector(getEmailAssets);
  const emailAssetsStatus = useSelector(getEmailAssetsStatus);
  const isEmailAssetsEmpty = useSelector(getIsEmailAssetsEmpty);
  const isEmailAssetsExists = useSelector(getIsEmailAssetsExists);
  const emailAssetsAmount = useSelector(getEmailAssetsAmount);

  const isShowDummyData = isEmailAssetsEmpty || emailAssetsStatus === 'failed';
  const isShowSkeleton = emailAssetsStatus === 'loading';

  const { showModal, closeModal } = useCommonModalDialog();

  const {
    editingEmailAsset,
    isEmailAssetDialogOpen,
    closeNewAssetDialog,
    openEmailAssetDialog,
    openEmailAssetDialogWithData,
  } = useEmailAssetsModalData();

  const stubArray = useMemo(() => {
    if (emailAssetsAmount >= STUB_EMAIL_ASSETS_AMOUNT) return [];

    const stub: number[] = [];
    stub.length = STUB_EMAIL_ASSETS_AMOUNT - emailAssetsAmount;
    return stub.fill(0, 0, STUB_EMAIL_ASSETS_AMOUNT - emailAssetsAmount);
  }, [emailAssetsAmount]);

  const handleShowConfirmationModal = (assetId: string) => {
    showModal({
      body: (
        <>
          <p>Are you sure you want to delete these asset?</p>
          <p>You won&apos;t be able to recover it.</p>
        </>
      ),
      title: 'Confirm deletion',
      mainButton: {
        action: async () => {
          await dispatch(deleteEmailAsset(assetId));
          closeModal();
        },
      },
      secondaryButton: {
        action: closeModal,
      },
    });
  };

  return (
    <>
      <EmailAssetsModal
        isDialogOpen={isEmailAssetDialogOpen}
        closeDialog={closeNewAssetDialog}
        editingEmailAsset={editingEmailAsset}
      />
      <div className={commonClasses.flexRow}>
        <TitleHeading headingText={'My email assets'} />
        {isEmailAssetsExists && !isShowSkeleton && (
          <div className={commonClasses.titleButtonWrapper}>
            <Button
              large
              text={'+ New email asset'}
              intent={'success'}
              onClick={openEmailAssetDialog}
            />
          </div>
        )}
      </div>

      <div className={classes.myEmailAssetsContentWrapper}>
        <Placeholders />
        <div className={classes.content}>
          {isShowSkeleton && <DummyData withSkeleton />}
          {isShowDummyData && <DummyData />}
          {isEmailAssetsExists && (
            <>
              {emailAssets.map((emailAsset) => (
                <Card
                  interactive
                  onClick={() => {
                    openEmailAssetDialogWithData(emailAsset);
                  }}
                  key={emailAsset.id}
                  elevation={2}
                  className={`${commonClasses.cardStyle} ${classes.cardStyle}`}
                >
                  <div className={classes.cardContent}>
                    <div className={commonClasses.flexColumn}>
                      <H4 className={commonClasses.cardTitle}>
                        {emailAsset.name}
                      </H4>
                      <p>Created: {prettifyDate(emailAsset.createdAt)}</p>
                      <p>Modified: {prettifyDate(emailAsset.updatedAt)}</p>
                    </div>
                    <div
                      className={`${commonClasses.flexRow} ${classes.editEmailAsset}`}
                    >
                      <Button minimal intent={'success'} text={'Edit'} />
                      <Button
                        minimal
                        intent={'danger'}
                        text={'Delete'}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleShowConfirmationModal(emailAsset.id);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              {emailAssetsAmount < STUB_EMAIL_ASSETS_AMOUNT &&
                stubArray.map((stubEl, index) => {
                  return (
                    <Card
                      key={index}
                      elevation={0}
                      className={`${commonClasses.cardStyle} ${classes.cardStyle} ${commonClasses.stubCardStyle}`}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default MyEmailAssets;
