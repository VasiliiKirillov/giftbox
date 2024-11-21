import React, { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, H4 } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

import { prettifyDate } from '../../misc/utils';
import commonClasses from '../../misc/common.module.css';
import classes from './MyEmailGroups.module.css';
import {
  deleteEmailGroup,
  getEmailGroups,
  getEmailGroupsAmount,
  getEmailGroupsStatus,
  getIsEmailGroupsEmpty,
  getIsEmailGroupsExists,
} from '../../slices/emailGroups';
import { TitleHeading } from '../TitleHeading/TitleHeading.component';
import Placeholders from './Placeholders/Placeholders.component';
import DummyData from './DummyData/DummyData.component';
import { AppDispatch } from '../../misc/store';
import useCommonModalDialog from '../../containers/CommonModal/CommonModal.hook';

const STUB_EMAIL_GROUPS_AMOUNT = 9;

const MyEmailGroups = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();

  const emailGroups = useSelector(getEmailGroups);
  const emailGroupsStatus = useSelector(getEmailGroupsStatus);
  const isEmailGroupsEmpty = useSelector(getIsEmailGroupsEmpty);
  const isEmailGroupsExists = useSelector(getIsEmailGroupsExists);
  const emailGroupsAmount = useSelector(getEmailGroupsAmount);

  const isShowDummyData = isEmailGroupsEmpty || emailGroupsStatus === 'failed';
  const isShowSkeleton = emailGroupsStatus === 'loading';

  const { showModal, closeModal } = useCommonModalDialog();

  const handleShowConfirmationModal = (emailId: string) => {
    showModal({
      body: (
        <>
          <p>Are you sure you want to delete these item?</p>
          <p>You won&apos;t be able to recover it.</p>
        </>
      ),
      title: 'Confirm deletion',
      mainButton: {
        action: async () => {
          await dispatch(deleteEmailGroup(emailId));
          closeModal();
        },
      },
      secondaryButton: {
        action: closeModal,
      },
    });
  };

  const stubArray = useMemo(() => {
    if (emailGroupsAmount >= STUB_EMAIL_GROUPS_AMOUNT) return [];

    const stub: number[] = [];
    stub.length = STUB_EMAIL_GROUPS_AMOUNT - emailGroupsAmount;
    return stub.fill(0, 0, STUB_EMAIL_GROUPS_AMOUNT - emailGroupsAmount);
  }, [emailGroupsAmount]);

  return (
    <>
      <div className={commonClasses.flexRow}>
        <TitleHeading headingText={'My email groups'} />
        {isEmailGroupsExists && !isShowSkeleton && (
          <div className={commonClasses.titleButtonWrapper}>
            <Button
              large
              text={'+ New email group'}
              intent={'success'}
              onClick={() => navigate('/emailgroups/new')}
            />
          </div>
        )}
      </div>

      <div className={classes.myEmailGroupsContentWrapper}>
        <Placeholders />
        <div className={classes.myEmailGroupsContent}>
          {isShowSkeleton && <DummyData withSkeleton />}
          {isShowDummyData && <DummyData />}
          {isEmailGroupsExists && (
            <>
              {emailGroups.map((emailGroup) => (
                <Card
                  interactive
                  onClick={() => navigate(`/emailgroups/${emailGroup.id}`)}
                  key={emailGroup.id}
                  elevation={2}
                  className={`${commonClasses.cardStyle} ${classes.cardStyle}`}
                >
                  <div className={classes.cardContent}>
                    <div className={commonClasses.flexColumn}>
                      <H4 className={commonClasses.cardTitle}>
                        {emailGroup.name}
                      </H4>
                      <p>Created: {prettifyDate(emailGroup.createdAt)}</p>
                      <p>Modified: {prettifyDate(emailGroup.updatedAt)}</p>
                    </div>
                    <div
                      className={`${classes.editEmailGroups} ${commonClasses.flexRow}`}
                    >
                      <Button minimal intent={'success'} text={'Edit'} />
                      <Button
                        minimal
                        intent={'danger'}
                        text={'Delete'}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleShowConfirmationModal(emailGroup.id);
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              {emailGroupsAmount < STUB_EMAIL_GROUPS_AMOUNT &&
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

export default MyEmailGroups;
