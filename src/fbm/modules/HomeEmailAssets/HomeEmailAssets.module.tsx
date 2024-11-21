import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { H4 } from '@blueprintjs/core';

import commonClasses from '../../misc/common.module.css';
import classes from './HomeEmailAssets.module.css';
import { prettifyDate } from '../../misc/utils';
import {
  fetchEmailAssets,
  getEmailAssetsAmount,
  getEmailAssetsStatus,
  getHomeEmailAssets,
  getIsEmailAssetsEmpty,
  getIsEmailAssetsExists,
  HOME_EMAIL_ASSETS_AMOUNT,
} from '../../slices/emailAssets';
import { TitleHeading } from '../../components/TitleHeading/TitleHeading.component';
import { EmptyPlaceholder } from '../../components/EmptyPlaceholder/EmptyPlaceholder.component';
import { LoadingErrorPlaceholder } from '../../components/LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import { EmailAssetsModal } from '../../components/EmailAssetsModal/EmailAssetsModal.component';
import { useEmailAssetsModalData } from '../../components/EmailAssetsModal/EmailAssetModal.service';
import { SmallCardStub } from '../../components/SmallCardStub/SmallCardStub.component';
import { SmallCardContent } from '../../components/SmallCardContent/SmallCardContent.component';
import { AddNewShowAllFooter } from '../../components/AddNewShowAllFooter/AddNewShowAllFooter.component';
import { AppDispatch } from '../../misc/store';
import { ContentWrapper } from '../../containers/ContentWrapper/ContentWrapper.component';
import { ContainerWrapper } from '../../containers/ContainerWrapper/ContainerWrapper.component';

export const HomeEmailAssets = memo(() => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const emailAssetsStatus = useSelector(getEmailAssetsStatus);
  const isEmailAssetsEmpty = useSelector(getIsEmailAssetsEmpty);
  const isEmailAssetsExists = useSelector(getIsEmailAssetsExists);
  const emailAssets = useSelector(getHomeEmailAssets);
  const emailAssetsAmount = useSelector(getEmailAssetsAmount);

  const isShowStubCards = isEmailAssetsEmpty || emailAssetsStatus === 'failed';
  const isShowSkeleton = emailAssetsStatus === 'loading';

  const {
    editingEmailAsset,
    isEmailAssetDialogOpen,
    closeNewAssetDialog,
    openEmailAssetDialog,
    openEmailAssetDialogWithData,
  } = useEmailAssetsModalData();

  const existedCards = useMemo(
    () => (
      <>
        {emailAssets.map((emailAsset) => (
          <SmallCardContent
            key={emailAsset.id}
            handleClick={() => {
              openEmailAssetDialogWithData(emailAsset);
            }}
          >
            <H4 className={commonClasses.cardTitle}>{emailAsset.name}</H4>
            <p>Modified: {prettifyDate(emailAsset.updatedAt)}</p>
            <p>Created: {prettifyDate(emailAsset.createdAt)}</p>
          </SmallCardContent>
        ))}
        {HOME_EMAIL_ASSETS_AMOUNT > emailAssetsAmount &&
          [0, 0, 0, 0]
            .slice(0, HOME_EMAIL_ASSETS_AMOUNT - emailAssetsAmount)
            .map((stubEl, index) => {
              return <SmallCardStub key={index} />;
            })}
      </>
    ),
    [emailAssets, emailAssetsAmount]
  );

  const homeEmailAssetsCards = useMemo(() => {
    if (isShowSkeleton) {
      return [0, 0, 0, 0].map((dummyObject, index) => (
        <SmallCardContent key={index}>
          <H4 className={'bp4-skeleton'}>-</H4>
          <p className={'bp4-skeleton'}>-</p>
          <p className={'bp4-skeleton'}>-</p>
        </SmallCardContent>
      ));
    } else if (isShowStubCards) {
      return [0, 0, 0, 0].map((stubEl, index) => <SmallCardStub key={index} />);
    } else if (isEmailAssetsExists) {
      return existedCards;
    }
    return null;
  }, [isShowSkeleton, isShowStubCards, isEmailAssetsExists, existedCards]);

  const handleEmailAssetsError = useCallback(() => {
    dispatch(fetchEmailAssets());
  }, []);

  return (
    <>
      <EmailAssetsModal
        title={editingEmailAsset ? 'Editing case!' : undefined}
        isDialogOpen={isEmailAssetDialogOpen}
        closeDialog={closeNewAssetDialog}
        editingEmailAsset={editingEmailAsset}
      />
      <TitleHeading
        headingText={'Recent Email assets'}
        helperText={'Assets groups are groups of your assets'}
      />
      <ContainerWrapper>
        {isEmailAssetsEmpty && (
          <EmptyPlaceholder
            notificationText={'Looks like you have no any email assets yet'}
            handleClick={openEmailAssetDialog}
            buttonText={'+ First email asset'}
          />
        )}
        {emailAssetsStatus === 'failed' && (
          <LoadingErrorPlaceholder
            notificationText={'Email assets loading error'}
            buttonText={'Try again'}
            handleClick={handleEmailAssetsError}
          />
        )}
        <ContentWrapper styles={classes.homeEmailAssetsContent}>
          {homeEmailAssetsCards}
          <AddNewShowAllFooter
            addNewText={'+ New email asset'}
            handleAddNew={openEmailAssetDialog}
            showAllText={'Show all email assets...'}
            handleShowAll={() => navigate('/assets')}
            showShowAll={emailAssetsAmount > 0}
          />
        </ContentWrapper>
      </ContainerWrapper>
    </>
  );
});
