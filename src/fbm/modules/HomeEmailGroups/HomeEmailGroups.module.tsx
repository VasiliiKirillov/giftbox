import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { H4 } from '@blueprintjs/core';

import commonClasses from '../../misc/common.module.css';
import classes from './HomeEmailGroups.module.css';
import { prettifyDate } from '../../misc/utils';
import {
  fetchEmailGroups,
  getEmailGroupsAmount,
  getEmailGroupsStatus,
  getHomeScreenEmailGroups,
  getIsEmailGroupsEmpty,
  getIsEmailGroupsExists,
  HOME_EMAIL_GROUPS_AMOUNT,
} from '../../slices/emailGroups';
import { TitleHeading } from '../../components/TitleHeading/TitleHeading.component';
import { SmallCardContent } from '../../components/SmallCardContent/SmallCardContent.component';
import { SmallCardStub } from '../../components/SmallCardStub/SmallCardStub.component';
import { AddNewShowAllFooter } from '../../components/AddNewShowAllFooter/AddNewShowAllFooter.component';
import { EmptyPlaceholder } from '../../components/EmptyPlaceholder/EmptyPlaceholder.component';
import { AppDispatch } from '../../misc/store';
import { LoadingErrorPlaceholder } from '../../components/LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import { ContentWrapper } from '../../containers/ContentWrapper/ContentWrapper.component';
import { ContainerWrapper } from '../../containers/ContainerWrapper/ContainerWrapper.component';

export const HomeEmailGroups = memo(() => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const emailGroupsStatus = useSelector(getEmailGroupsStatus);
  const isEmailGroupsEmpty = useSelector(getIsEmailGroupsEmpty);
  const isEmailGroupsExists = useSelector(getIsEmailGroupsExists);
  const emailGroups = useSelector(getHomeScreenEmailGroups);
  const emailGroupsAmount = useSelector(getEmailGroupsAmount);

  const isShowStubCards = isEmailGroupsEmpty || emailGroupsStatus === 'failed';
  const isShowSkeleton = emailGroupsStatus === 'loading';

  const existedCards = useMemo(
    () => (
      <>
        {emailGroups.map((emailGroup) => (
          <SmallCardContent
            key={emailGroup.id}
            handleClick={() => navigate(`/emailgroups/${emailGroup.id}`)}
          >
            <H4 className={commonClasses.cardTitle}>{emailGroup.name}</H4>
            <p>Modified: {prettifyDate(emailGroup.updatedAt)}</p>
            <p>Created: {prettifyDate(emailGroup.createdAt)}</p>
          </SmallCardContent>
        ))}
        {HOME_EMAIL_GROUPS_AMOUNT > emailGroupsAmount &&
          [0, 0, 0, 0]
            .slice(0, HOME_EMAIL_GROUPS_AMOUNT - emailGroupsAmount)
            .map((stubEl, index) => {
              return <SmallCardStub key={index} />;
            })}
      </>
    ),
    [emailGroups, emailGroupsAmount]
  );

  const homeEmailGroupsCards = useMemo(() => {
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
    } else if (isEmailGroupsExists) {
      return existedCards;
    }
    return null;
  }, [isShowSkeleton, isShowStubCards, isEmailGroupsEmpty, existedCards]);

  const handleOpenNewEmailGroup = useCallback(() => {
    navigate('/emailgroups/new');
  }, []);

  const handleEmailGroupsError = useCallback(() => {
    dispatch(fetchEmailGroups());
  }, []);

  return (
    <>
      <TitleHeading
        headingText={'Recent Email groups'}
        helperText={'Email groups are groups of your emails'}
      />
      <ContainerWrapper>
        {isEmailGroupsEmpty && (
          <EmptyPlaceholder
            notificationText={'Looks like you have no any email assets yet'}
            handleClick={handleOpenNewEmailGroup}
            buttonText={'+ First email asset'}
          />
        )}
        {emailGroupsStatus === 'failed' && (
          <LoadingErrorPlaceholder
            notificationText={'Email groups loading error'}
            buttonText={'Try again'}
            handleClick={handleEmailGroupsError}
          />
        )}
        <ContentWrapper styles={classes.homeEmailGroupsContent}>
          {homeEmailGroupsCards}
          <AddNewShowAllFooter
            addNewText={'+ New email group'}
            handleAddNew={() => navigate('/emailgroups/new')}
            showAllText={'Show all email groups...'}
            handleShowAll={() => navigate('/emailgroups')}
            showShowAll={emailGroupsAmount > 0}
          />
        </ContentWrapper>
      </ContainerWrapper>
    </>
  );
});
